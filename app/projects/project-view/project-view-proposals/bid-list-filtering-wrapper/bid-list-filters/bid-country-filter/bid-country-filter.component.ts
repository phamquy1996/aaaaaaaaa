import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IconSize } from '@freelancer/ui/icon';
import { LinkUnderline, LinkWeight } from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import {
  BidListFilters,
  CountryCount,
} from '../../bid-list-filtering-wrapper.types';

type CountryCountControl = CountryCount & { control: FormControl };

@Component({
  selector: 'app-bid-country-filter',
  template: `
    <fl-bit [flMarginBottom]="Margin.MID">
      <fl-text
        i18n="User country filter title"
        [flMarginBottom]="Margin.SMALL"
        [weight]="FontWeight.MEDIUM"
        [size]="TextSize.SMALL"
      >
        Country
      </fl-text>
      <fl-input
        flTrackingLabel="BidListCountryFilterQuery"
        i18n-placeholder="Search country placeholder"
        placeholder="Search a country"
        [control]="searchControl"
        [flMarginBottom]="Margin.MID"
        [iconStart]="'ui-search'"
      ></fl-input>

      <ng-container *ngIf="countriesFiltered$ | async as countriesFiltered">
        <!-- Mobile implementation -->
        <fl-bit [flShowMobile]="true">
          <fl-bit class="CountryListItemGroup">
            <ng-content *ngTemplateOutlet="allCountryOption"></ng-content>
            <app-country-filter-list-item
              *ngFor="
                let country of (showAllFlag$ | async)
                  ? countriesFiltered
                  : (countriesFiltered | slice: 0:MOBILE_COUNTRIES_TO_SHOW)
              "
              [control]="country.control"
              [country]="country.name"
              [count]="country.count"
              [flMarginBottom]="Margin.MID"
              [flShowMobile]="true"
              (click)="handleFilterChange()"
            >
            </app-country-filter-list-item>
          </fl-bit>
          <ng-container
            *ngIf="countriesFiltered.length > MOBILE_COUNTRIES_TO_SHOW"
          >
            <ng-content *ngTemplateOutlet="showAll"></ng-content>
          </ng-container>
        </fl-bit>

        <!-- Desktop implementation -->
        <fl-bit [flHideMobile]="true">
          <fl-bit
            class="CountryListItemGroup"
            [flMarginBottom]="Margin.XXSMALL"
          >
            <ng-content *ngTemplateOutlet="allCountryOption"></ng-content>
            <app-country-filter-list-item
              *ngFor="
                let country of (showAllFlag$ | async)
                  ? countriesFiltered
                  : (countriesFiltered | slice: 0:DESKTOP_COUNTRIES_TO_SHOW)
              "
              [control]="country.control"
              [country]="country.name"
              [count]="country.count"
              [flMarginBottom]="Margin.SMALL"
              [flHideMobile]="true"
              (click)="handleFilterChange()"
            >
            </app-country-filter-list-item>
          </fl-bit>
          <ng-container
            *ngIf="countriesFiltered.length > DESKTOP_COUNTRIES_TO_SHOW"
          >
            <ng-content *ngTemplateOutlet="showAll"></ng-content>
          </ng-container>
        </fl-bit>
      </ng-container>
    </fl-bit>
    <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>

    <!-- Templates -->
    <ng-template #allCountryOption>
      <app-country-filter-list-item
        country="All Countries"
        i18n-country="All countries filter option"
        [control]="allCountries"
        [count]="totalCount"
        [flMarginBottom]="Margin.MID"
        [flMarginBottomTablet]="Margin.SMALL"
        (click)="handleAllCountriesClicked()"
      >
      </app-country-filter-list-item>
    </ng-template>

    <ng-template #showAll>
      <fl-link
        *ngIf="(showAllFlag$ | async) === false"
        flTrackingLabel="BidCountryFilterShowAllCta"
        i18n="Show all countries"
        [size]="TextSize.SMALL"
        [underline]="LinkUnderline.NEVER"
        [weight]="LinkWeight.BOLD"
        (click)="handleShowAll()"
      >
        Show All
      </fl-link>
      <fl-link
        *ngIf="(showAllFlag$ | async) === true"
        flTrackingLabel="BidCountryFilterShowLessCta"
        i18n="Show less countries"
        [size]="TextSize.SMALL"
        [underline]="LinkUnderline.NEVER"
        [weight]="LinkWeight.BOLD"
        (click)="handleShowLess()"
      >
        Show Less
      </fl-link>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bid-country-filter-component.scss'],
})
export class BidCountryFilterComponent implements OnChanges, OnInit {
  FontType = FontType;
  FontWeight = FontWeight;
  IconSize = IconSize;
  ListItemType = ListItemType;
  ListItemPadding = ListItemPadding;
  LinkWeight = LinkWeight;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() countries: ReadonlyArray<CountryCount> = [];
  @Input() group: FormGroup;

  @Output() filterChanged = new EventEmitter();

  control: FormControl;
  countryFilter = new FormGroup({}); // Holds value of the country controls, each value from `countries` should be represented here
  countriesControl: ReadonlyArray<CountryCountControl>; // A zipped version of `countries` and `countryFilter`
  countriesFiltered$: Rx.Observable<ReadonlyArray<CountryCountControl>>;

  MOBILE_COUNTRIES_TO_SHOW = 3;
  DESKTOP_COUNTRIES_TO_SHOW = 5;

  private showAllFlagSubject$ = new Rx.BehaviorSubject<boolean>(false);
  showAllFlag$ = this.showAllFlagSubject$.asObservable();

  searchControl: FormControl;
  allCountries: FormControl;
  totalCount: number;

  ngOnInit() {
    this.control = this.group.get(BidListFilters.USER_COUNTRY) as FormControl;

    const controlValue = this.control.value as ReadonlyArray<string>;
    const hasInitialData = controlValue.length > 0;

    // Populate `countriesControl`
    this.countriesControl = this.countries.map(
      country =>
        ({
          ...country,
          control: this.getCountryControl(country.code, !hasInitialData),
        } as CountryCountControl),
    );

    this.searchControl = new FormControl();

    // Serve initial data
    controlValue.map(countryCode =>
      this.countryFilter.patchValue({ [countryCode]: true }),
    );

    this.allCountries = new FormControl();
    this.updateAllCountriesControl();

    const query$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      tap(() => this.showAllFlagSubject$.next(false)),
      map((query: string) => query.toLowerCase()),
    );

    this.countriesFiltered$ = query$.pipe(
      map(query =>
        this.countriesControl
          .filter(country => country.name.toLowerCase().includes(query))
          .sort((a, b) => (a.name > b.name ? 1 : -1)),
      ),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('countries' in changes) {
      this.totalCount = this.countries.reduce(
        (sum, country) => sum + country.count,
        0,
      );
    }
  }

  handleShowAll() {
    this.showAllFlagSubject$.next(true);
  }

  handleShowLess() {
    this.showAllFlagSubject$.next(false);
  }

  reset() {
    this.countriesControl.map(country => {
      country.control.patchValue(true);
    });

    this.allCountries.setValue(true);
    this.control.setValue([]);
    this.filterChanged.emit();
  }

  // Makes sure that all control exists for each country on retrieve
  getCountryControl(countryCode: string, defaultValue = true) {
    if (!this.countryFilter.get(countryCode)) {
      this.countryFilter.addControl(countryCode, new FormControl(defaultValue));
    }

    return this.countryFilter.get(countryCode);
  }

  handleAllCountriesClicked() {
    this.countriesControl.map(country =>
      country.control.setValue(this.allCountries.value),
    );

    this.handleFilterChange();
  }

  updateAllCountriesControl() {
    this.allCountries.setValue(
      this.countriesControl.every(country => country.control.value === true),
    );
  }

  handleFilterChange() {
    this.updateAllCountriesControl();

    this.control.setValue(
      this.countriesControl.every(country => country.control.value === true)
        ? []
        : this.countriesControl
            .filter(country => country.control.value)
            .map(country => country.code.toLowerCase()),
    );

    this.filterChanged.emit();
  }
}

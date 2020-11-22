import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackendUpdateResponse, Datastore } from '@freelancer/datastore';
import {
  CountriesCollection,
  Country,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { SelectItem } from '@freelancer/ui/select';
import {
  FontColor,
  FontType,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import { pattern, required } from '@freelancer/ui/validators';
import { isFormControl } from '@freelancer/utils';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

export const MARKETING_MOBILE_NUMBER_COOKIE = 'SKIP_MARKETING_MOBILE_NUMBER';

@Component({
  template: `
    <fl-bit class="MarketingMobile-modal">
      <ng-container *ngIf="newCountries$ | async; else loadingState">
        <fl-heading
          i18n="Marketing Mobile Number modal header"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H1"
          [flMarginBottom]="Margin.XLARGE"
        >
          Find freelancers even faster with help from our Recruiters
        </fl-heading>
        <ng-container *ngIf="submissionPromise | async as result">
          <fl-banner-alert
            *ngIf="result.status === 'error'"
            [type]="BannerAlertType.ERROR"
            [compact]="true"
            [closeable]="false"
            [flMarginBottom]="Margin.SMALL"
          >
            <ng-container i18n="Error message copy">
              Something went wrong. Please refresh the page and try again.
            </ng-container>
            <ng-container
              *ngIf="result.requestId"
              i18n="Error message for contacting support"
            >
              You can also contact support with the following request ID:
              {{ result.requestId }}.
            </ng-container>
          </fl-banner-alert>
        </ng-container>

        <fl-text
          i18n="recruiter phone number copy"
          [flMarginBottom]="Margin.XXXSMALL"
          [weight]="FontWeight.BOLD"
        >
          Phone number
        </fl-text>

        <fl-bit class="MarketingMobile" [flMarginBottom]="Margin.XLARGE">
          <ng-container *ngIf="formGroup.get('phoneCode') as control">
            <fl-select
              *ngIf="isFormControl(control)"
              class="MarketingMobile-phonecode"
              placeholder="Select country"
              flTrackingLabel="MarketingMobileNumberCountry"
              i18n-placeholder="Select country copy"
              [id]="'selectCountry'"
              [control]="control"
              [flMarginRightTablet]="Margin.XSMALL"
              [flMarginBottom]="Margin.XXSMALL"
              [flMarginBottomTablet]="Margin.NONE"
              [options]="countriesList"
              [flagStartCountryCode]="control.value?.code | lowercase"
              (change)="changeCountry(control.value)"
            ></fl-select>
          </ng-container>
          <ng-container *ngIf="formGroup.get('mobileNumber') as control">
            <fl-input
              *ngIf="isFormControl(control)"
              class="MarketingMobile-phoneNumber"
              placeholder="Phone number"
              flTrackingLabel="MarketingMobileNumberMobileNumber"
              i18n-placeholder="Phone number copy"
              [control]="control"
            ></fl-input>
          </ng-container>
        </fl-bit>
        <fl-text
          i18n="Marketing Mobile Number modal footer"
          [flMarginBottom]="Margin.MID"
          [color]="FontColor.MID"
          [displayLineBreaks]="true"
          [size]="TextSize.XXSMALL"
        >
          Our expert Recruiters will help find the perfect freelancer for the
          job, and they may call in the process. We will never share your
          contact details with freelancers.
        </fl-text>
        <fl-bit class="MarketingMobile-action">
          <fl-button
            flTrackingLabel="MarketingMobileNumberSkipButton"
            i18n="Skip button copy"
            [disabled]="
              submissionPromise && (submissionPromise | async) === null
            "
            [color]="ButtonColor.DEFAULT"
            [flMarginRight]="Margin.SMALL"
            [size]="ButtonSize.SMALL"
            (click)="handleSkip()"
          >
            Skip
          </fl-button>
          <fl-button
            flTrackingLabel="MarketingMobileNumberNextButton"
            i18n="Next button copy"
            [busy]="submissionPromise && (submissionPromise | async) === null"
            [color]="ButtonColor.SECONDARY"
            [disabled]="!formGroup.valid"
            [size]="ButtonSize.SMALL"
            (click)="handleSubmit()"
          >
            Submit
          </fl-button>
        </fl-bit>
      </ng-container>
    </fl-bit>

    <ng-template #loadingState>
      <fl-bit class="MarketingMobile-loading">
        <fl-spinner
          flTrackingLabel="ProjectsMarketingMobileNumberModalSpinner"
        ></fl-spinner>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./marketing-mobile-number-modal.component.scss'],
})
export class MarketingMobileNumberModalComponent implements OnInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  InputType = InputType;
  isFormControl = isFormControl;
  Margin = Margin;
  TextAlign = TextAlign;
  TextSize = TextSize;

  countriesList: ReadonlyArray<SelectItem>;
  formGroup: FormGroup;
  initialCountriesList: ReadonlyArray<SelectItem>;
  newCountries$: Rx.Observable<ReadonlyArray<Country>>;
  submissionPromise: Promise<BackendUpdateResponse<UsersSelfCollection>>;

  mobileNumberRequiredError = 'Please enter phone number';
  mobileNumberInvalidError = 'Please enter a valid phone number';
  phoneCodeError = 'Please select a country';

  @Input() userId: number;

  constructor(
    private cookies: CookieService,
    private datastore: Datastore,
    private fb: FormBuilder,
    private modalRef: ModalRef<MarketingMobileNumberModalComponent>,
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      mobileNumber: [
        '',
        [
          pattern(/^[0-9]*$/, this.mobileNumberInvalidError),
          required(this.mobileNumberRequiredError),
        ],
      ],
      phoneCode: ['', required(this.phoneCodeError)],
    });

    const countries$ = this.datastore
      .collection<CountriesCollection>('countries')
      .valueChanges();
    this.newCountries$ = countries$.pipe(
      map(countries => {
        this.initialCountriesList = countries.map(country => ({
          displayText: `${country.name} +${country.phoneCode}`,
          value: country,
        }));
        this.countriesList = [
          { displayText: '', value: '', disabled: true },
          ...this.initialCountriesList,
        ];
        return countries;
      }),
    );
  }

  changeCountry(country: Country) {
    this.countriesList = [...this.initialCountriesList];
    this.countriesList = this.countriesList.map(countryObject =>
      country.id === (countryObject.value as Country).id
        ? {
            ...countryObject,
            displayText: `${country.code} +${country.phoneCode}`,
          }
        : countryObject,
    );
  }

  handleSkip() {
    this.cookies.put(MARKETING_MOBILE_NUMBER_COOKIE, 'skip', {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
    this.modalRef.close('closed');
  }

  handleSubmit() {
    this.submissionPromise = this.datastore
      .collection<UsersSelfCollection>('usersSelf')
      .update(this.userId, {
        marketingMobileNumber: {
          phoneNumber: this.formGroup.controls.mobileNumber.value,
          countryCode: String(
            (this.formGroup.controls.phoneCode.value as Country).phoneCode,
          ),
        },
      })
      .then(result => {
        if (result.status === 'success') {
          this.modalRef.close('submit');
        }
        return result;
      });
  }
}

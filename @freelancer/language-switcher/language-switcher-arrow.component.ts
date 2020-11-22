import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppsDomainsMap, APPS_DOMAINS_MAP } from '@freelancer/config';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import { LanguagesCollection } from '@freelancer/datastore/collections';
import { Localization } from '@freelancer/localization';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { SelectBackgroundColor, SelectItem } from '@freelancer/ui/select';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageSwitcherTheme } from './language-switcher.component';
import { LanguageSwitcher } from './language-switcher.service';

@Component({
  selector: 'fl-language-switcher-arrow',
  template: `
    <fl-bit
      [flMarginBottom]="Margin.XXSMALL"
      [flMarginBottomTablet]="Margin.XSMALL"
    >
      <fl-label
        class="LangSwitcher-label"
        i18n="Language switcher label"
        for="language-select"
        [weight]="FontWeight.INHERIT"
        [size]="TextSize.INHERIT"
        [sizeTablet]="TextSize.SMALL"
        [color]="
          color === LanguageSwitcherTheme.LIGHT
            ? FontColor.LIGHT
            : FontColor.INHERIT
        "
      >
        Language:
      </fl-label>
    </fl-bit>
    <fl-bit class="LangSwitcher-form">
      <fl-select
        class="LangSwitcher-select"
        flTrackingLabel="LanguageSelector"
        [id]="'language-select'"
        [backgroundColor]="
          color === LanguageSwitcherTheme.LIGHT
            ? SelectBackgroundColor.DARK
            : SelectBackgroundColor.LIGHT
        "
        [control]="languageControl"
        [options]="languages$ | async"
        [flMarginBottom]="Margin.XXXSMALL"
        [flMarginBottomTablet]="Margin.NONE"
        [flMarginRightTablet]="Margin.XXSMALL"
      ></fl-select>
      <fl-button
        class="LangSwitcher-button"
        *ngIf="languageControl.dirty"
        i18n="Change Language Button"
        flTrackingLabel="LanguageSelectButton"
        [color]="ButtonColor.SECONDARY"
        (click)="onLanguageSubmit()"
      >
        Update
      </fl-button>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./language-switcher-arrow.component.scss'],
})
export class LanguageSwitcherArrowComponent implements OnInit {
  ButtonColor = ButtonColor;
  Margin = Margin;
  FontColor = FontColor;
  FontWeight = FontWeight;
  SelectBackgroundColor = SelectBackgroundColor;
  LanguageSwitcherTheme = LanguageSwitcherTheme;
  TextSize = TextSize;

  @Input() selectBackgroundColor: SelectBackgroundColor;
  @Input() color: LanguageSwitcherTheme;

  languageControl: FormControl = new FormControl(
    this.localization.languageCode,
  );
  languages$: Rx.Observable<ReadonlyArray<SelectItem>>;
  languagesCollection: DatastoreCollection<LanguagesCollection>;

  constructor(
    private datastore: Datastore,
    private languageSwitcher: LanguageSwitcher,
    private localization: Localization,
    @Inject(APPS_DOMAINS_MAP) private appsDomainsMap: AppsDomainsMap,
  ) {}

  ngOnInit() {
    const languageCodes = Object.keys(this.appsDomainsMap.arrow);

    this.languagesCollection = this.datastore.collection<LanguagesCollection>(
      'languages',
      query => query.where('code', 'in', languageCodes),
    );

    this.languages$ = this.languagesCollection.valueChanges().pipe(
      map(languages =>
        languages.map(language => ({
          value: language.code,
          displayText: language.name,
        })),
      ),
    );
  }

  onLanguageSubmit() {
    this.languageSwitcher.switchLanguage(this.languageControl.value);
  }
}

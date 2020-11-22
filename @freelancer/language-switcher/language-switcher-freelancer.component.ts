import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  DomainsCollection,
  LanguagesCollection,
} from '@freelancer/datastore/collections';
import { Localization } from '@freelancer/localization';
import { Location } from '@freelancer/location';
import { IconColor } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageSwitcherTheme } from './language-switcher.component';

@Component({
  selector: 'fl-language-switcher-freelancer',
  template: `
    <fl-icon
      [flHideMobile]="true"
      [name]="'ui-globe'"
      [color]="
        color === LanguageSwitcherTheme.LIGHT
          ? IconColor.LIGHT
          : IconColor.INHERIT
      "
      [flMarginRight]="Margin.XSMALL"
    ></fl-icon>
    <fl-link
      flTrackingLabel="goToChooseCountry"
      [link]="'/choose-your-country'"
      [size]="TextSize.INHERIT"
      [color]="
        color === LanguageSwitcherTheme.LIGHT
          ? LinkColor.LIGHT
          : LinkColor.INHERIT
      "
      [hoverColor]="
        color === LanguageSwitcherTheme.LIGHT
          ? LinkHoverColor.LIGHT
          : LinkHoverColor.DEFAULT
      "
    >
      {{ (domainName$ | async) || 'Unknown Domain' }} /
      {{ language$ | async }}
    </fl-link>
  `,
  styleUrls: ['./language-switcher-freelancer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherFreelancerComponent implements OnInit {
  IconColor = IconColor;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  Margin = Margin;
  LanguageSwitcherTheme = LanguageSwitcherTheme;
  TextSize = TextSize;

  language$: Rx.Observable<string>;
  domainName$: Rx.Observable<string | undefined>;

  @Input() color: LanguageSwitcherTheme;

  constructor(
    private localization: Localization,
    private datastore: Datastore,
    private location: Location,
  ) {}

  ngOnInit() {
    const domainName = this.location.hostname;

    this.domainName$ = this.datastore
      .collection<DomainsCollection>('domains', query =>
        // slice off the `www` because the DB doesn't have it.
        // FIXME: move the hack to the endpoint
        query.where('domainName', '==', domainName.replace(/^www\./, '')),
      )
      .valueChanges()
      .pipe(map(domains => (domains.length > 0 ? domains[0].name : undefined)));

    this.language$ = this.datastore
      .document<LanguagesCollection>(
        'languages',
        this.localization.languageCode,
      )
      .valueChanges()
      .pipe(map(language => language.name));
  }
}

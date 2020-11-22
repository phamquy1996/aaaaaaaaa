import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SearchFreelancersEntry } from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { LinkIconPosition } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';

@Component({
  selector: 'app-user-search-results',
  template: `
    <fl-bit class="Heading" [flMarginBottom]="Margin.SMALL">
      <fl-text
        i18n="Browse Search Freelancers heading"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Top Freelancers
      </fl-text>
      <fl-link
        i18n="Browse Search Freelancers view all"
        flTrackingLabel="Browse-SearchFreelancers-ViewAll"
        [iconName]="'ui-arrow-right'"
        [iconPosition]="LinkIconPosition.RIGHT"
        [iconSize]="IconSize.XSMALL"
        [link]="'/search/users/'"
        [size]="TextSize.XXSMALL"
      >
        View All
      </fl-link>
    </fl-bit>

    <fl-bit class="Body">
      <fl-grid
        *ngIf="searchResults?.length; else noResultsTemplate"
        [flMarginBottom]="Margin.MID"
      >
        <ng-container *ngIf="!loading; else loadingTemplate">
          <fl-col
            *ngFor="let item of searchResults"
            [col]="12"
            [colTablet]="4"
            [flMarginBottom]="Margin.SMALL"
          >
            <app-user-search-results-item
              [trackingLabel]="'Browse-SearchFreelancers-UserSearchResultItem'"
              [user]="item"
            ></app-user-search-results-item>
          </fl-col>
        </ng-container>
      </fl-grid>
    </fl-bit>

    <ng-template #loadingTemplate>
      <fl-col
        *flRepeat="6"
        [col]="12"
        [colTablet]="4"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-bit class="LoadingResultItem">
          <fl-user-avatar [users]="[undefined]"></fl-user-avatar>
          <fl-loading-text [rows]="2"></fl-loading-text>
        </fl-bit>
      </fl-col>
    </ng-template>

    <ng-template #noResultsTemplate>
      <fl-text
        i18n="Browse Search Freelancers No Results"
        [color]="FontColor.MID"
        [flMarginBottom]="Margin.MID"
      >
        No results found
      </fl-text>
    </ng-template>
  `,
  styleUrls: ['./user-search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchResultsComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkIconPosition = LinkIconPosition;
  Margin = Margin;
  TextTransform = TextTransform;

  @Input() loading: boolean;
  @Input() searchResults: ReadonlyArray<SearchFreelancersEntry>;
}

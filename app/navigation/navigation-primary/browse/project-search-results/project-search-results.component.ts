import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  SearchActiveProject,
  SearchKeywordProject,
} from '@freelancer/datastore/collections';
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
  selector: 'app-project-search-results',
  template: `
    <fl-bit class="Heading" [flMarginBottom]="Margin.SMALL">
      <fl-text
        i18n="Browse Search Projects heading"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Top Projects
      </fl-text>
      <fl-link
        i18n="Browse Search Projects view all"
        flTrackingLabel="Browse-SearchProjects-ViewAll"
        [iconName]="'ui-arrow-right'"
        [iconPosition]="LinkIconPosition.RIGHT"
        [iconSize]="IconSize.XSMALL"
        [link]="'/search/projects/'"
        [size]="TextSize.XXSMALL"
      >
        View All
      </fl-link>
    </fl-bit>

    <fl-bit class="Body">
      <fl-list
        *ngIf="searchResults?.length; else noResultsTemplate"
        [flMarginBottom]="Margin.MID"
        [outerPadding]="false"
      >
        <ng-container *ngIf="!loading; else loadingTemplate">
          <fl-list-item *ngFor="let item of searchResults">
            <app-project-search-results-item
              [project]="item"
              [trackingLabel]="'Browse-SearchProjects-ProjectSearchResultItem'"
            ></app-project-search-results-item>
          </fl-list-item>
        </ng-container>
      </fl-list>
    </fl-bit>

    <ng-template #loadingTemplate>
      <fl-list-item *flRepeat="3">
        <fl-bit class="LoadingResultItem">
          <fl-user-avatar [users]="[undefined]"></fl-user-avatar>
          <fl-loading-text [rows]="3"></fl-loading-text>
          <fl-loading-text
            class="LoadingResultItem-right"
            [flHideMobile]="true"
            [flHideTablet]="true"
            [rows]="2"
          ></fl-loading-text>
        </fl-bit>
      </fl-list-item>
    </ng-template>

    <ng-template #noResultsTemplate>
      <fl-text
        i18n="Browse Search Projects No Results"
        [color]="FontColor.MID"
        [flMarginBottom]="Margin.MID"
      >
        No results found
      </fl-text>
    </ng-template>
  `,
  styleUrls: ['./project-search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSearchResultsComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkIconPosition = LinkIconPosition;
  Margin = Margin;
  TextTransform = TextTransform;

  @Input() loading: boolean;
  @Input() searchResults: ReadonlyArray<
    SearchActiveProject | SearchKeywordProject
  >;
}

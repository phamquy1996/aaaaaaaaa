import { Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-home-page-crowd-favorite-loading-state',
  template: `
    <fl-bit class="Loading-padding">
      <fl-bit
        class="LoadingContainer Loading-header"
        [flMarginBottom]="Margin.XXXLARGE"
        [flMarginBottomTablet]="Margin.LARGE"
      >
        <fl-loading-text
          class="LoadingBlock"
          [padded]="false"
        ></fl-loading-text>
      </fl-bit>
      <fl-bit class="LoadingContainer Loading-category">
        <fl-loading-text
          class="LoadingBlock"
          [padded]="false"
        ></fl-loading-text>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./crowd-favorite-loading-state.component.scss'],
})
export class HomePageCrowdFavoriteLoadingStateComponent {
  Margin = Margin;
}

import { Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-home-page-hire-categories-loading-state',
  template: `
    <fl-bit
      [flMarginBottom]="Margin.XLARGE"
      [flMarginBottomDesktop]="Margin.XXXLARGE"
    >
      <fl-bit
        class="LoadingContainer Loading-header"
        [flMarginBottom]="Margin.MID"
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
  styleUrls: ['./hire-categories-loading-state.component.scss'],
})
export class HomePageHireCategoriesLoadingStateComponent {
  Margin = Margin;
}

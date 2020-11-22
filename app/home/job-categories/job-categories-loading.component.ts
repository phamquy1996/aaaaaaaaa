import { Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-job-categories-loading-card',
  template: `
    <fl-bit [flMarginBottom]="Margin.XLARGE">
      <fl-bit [flMarginBottom]="Margin.XLARGE">
        <fl-loading-text
          class="Loading-header"
          [padded]="false"
        ></fl-loading-text>
      </fl-bit>
      <fl-loading-text
        class="Loading-content"
        [padded]="false"
      ></fl-loading-text>
    </fl-bit>
  `,
  styleUrls: ['./job-categories-loading.component.scss'],
})
export class HomePageJobCategoriesLoadingComponent {
  Margin = Margin;
}

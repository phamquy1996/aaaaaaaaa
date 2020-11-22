import { Component } from '@angular/core';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-high-conversion-page-header',
  template: `
    <fl-heading
      [headingType]="HeadingType.H1"
      [size]="TextSize.XLARGE"
      [weight]="HeadingWeight.BOLD"
      [flMarginBottom]="Margin.XSMALL"
    >
      <ng-content></ng-content>
    </fl-heading>
  `,
})
export class HighConversionPageHeaderComponent {
  Margin = Margin;
  TextSize = TextSize;
  HeadingWeight = HeadingWeight;
  HeadingType = HeadingType;
}

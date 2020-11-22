import { Component } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-freelancer-verified-landing-status-modal-rejected',
  template: `
    <fl-heading
      i18n="Freelancer Verified status declined header"
      [flMarginBottom]="Margin.SMALL"
      [headingType]="HeadingType.H3"
      [size]="TextSize.LARGE"
    >
      You are not eligible.
    </fl-heading>

    <fl-text i18n="Freelancer Verified status declined description">
      Our verification team has examined your information and decided not to
      approve your application to get verified.
    </fl-text>
  `,
})
export class FreelancerVerifiedLandingStatusModalRejectedComponent {
  HeadingType = HeadingType;
  Margin = Margin;
  TextSize = TextSize;
}

import { Component, Input } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-hourly-award-form-layout',
  template: `
    <fl-bit class="HourlyAwardForm">
      <!-- Main body section -->
      <fl-bit class="HourlyAwardForm-bodySection">
        <ng-content select="[HourlyAwardForm=body]"></ng-content>
      </fl-bit>

      <!-- Footer section -->
      <fl-bit>
        <fl-hr *ngIf="withSeparator" [flMarginBottom]="Margin.XSMALL"></fl-hr>
        <fl-bit class="HourlyAwardForm-ctaSection">
          <ng-content select="[HourlyAwardForm=cta]"></ng-content>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./hourly-award-form-layout.component.scss'],
})
export class HourlyAwardFormLayoutComponent {
  Margin = Margin;

  @Input() withSeparator = false;
}

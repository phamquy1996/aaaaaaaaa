import { Component } from '@angular/core';

@Component({
  selector: 'app-hourly-award-cta-layout',
  template: `
    <fl-bit class="HourlyAwardCTA-switchAwardTypeButton">
      <ng-content select="[HourlyAwardCTA=switchAwardTypeButton]"></ng-content>
    </fl-bit>
    <fl-bit class="HourlyAwardCTA-awardButton">
      <ng-content select="[HourlyAwardCTA=awardButton]"></ng-content>
    </fl-bit>
  `,
  styleUrls: ['./hourly-award-cta-layout.component.scss'],
})
export class HourlyAwardCTALayoutComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-hourly-award-layout',
  template: `
    <fl-bit class="HourlyAwardLayout-body">
      <ng-content select="[HourlyAwardLayout=body]"></ng-content>
    </fl-bit>
    <fl-bit class="HourlyAwardLayout-sidebar">
      <ng-content select="[HourlyAwardLayout=sidebar]"></ng-content>
    </fl-bit>
  `,
  styleUrls: ['./hourly-award-layout.component.scss'],
})
export class HourlyAwardLayoutComponent {}

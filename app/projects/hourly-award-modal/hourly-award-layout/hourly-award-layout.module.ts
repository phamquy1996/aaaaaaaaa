import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { HourlyAwardModalHeadingComponent } from '../hourly-award-modal-heading/hourly-award-modal-heading.component';
import { HourlyAwardCTALayoutComponent } from './hourly-award-cta-layout/hourly-award-cta-layout.component';
import { HourlyAwardFormLayoutComponent } from './hourly-award-form-layout/hourly-award-form-layout.component';
import { HourlyAwardLayoutComponent } from './hourly-award-layout.component';
@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [
    HourlyAwardLayoutComponent,
    HourlyAwardFormLayoutComponent,
    HourlyAwardModalHeadingComponent,
    HourlyAwardCTALayoutComponent,
  ],
  exports: [
    HourlyAwardLayoutComponent,
    HourlyAwardFormLayoutComponent,
    HourlyAwardModalHeadingComponent,
    HourlyAwardCTALayoutComponent,
  ],
})
export class HourlyAwardLayoutModule {}

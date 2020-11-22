import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { HourlyAwardAsHourlySidebarComponent } from './hourly-award-as-hourly-sidebar.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [HourlyAwardAsHourlySidebarComponent],
  exports: [HourlyAwardAsHourlySidebarComponent],
})
export class HourlyAwardAsHourlySidebarModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { ToastAlertsComponent } from './toast-alerts.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [ToastAlertsComponent],
  exports: [ToastAlertsComponent],
})
export class ToastAlertsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { NotificationsBannerComponent } from './notifications-banner.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [NotificationsBannerComponent],
  exports: [NotificationsBannerComponent],
})
export class NotificationsBannerModule {}

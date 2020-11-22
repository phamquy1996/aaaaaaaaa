import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [UiModule],
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}

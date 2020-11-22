import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { NetworkAlertComponent } from './network-alert.component';

@NgModule({
  imports: [UiModule],
  declarations: [NetworkAlertComponent],
  exports: [NetworkAlertComponent],
})
export class NetworkAlertModule {}

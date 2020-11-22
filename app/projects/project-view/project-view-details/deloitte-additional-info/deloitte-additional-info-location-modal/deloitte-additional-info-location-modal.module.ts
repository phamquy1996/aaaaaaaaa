import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { DeloitteAdditionalInfoLocationModalComponent } from './deloitte-additional-info-location-modal.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [DeloitteAdditionalInfoLocationModalComponent],
  entryComponents: [DeloitteAdditionalInfoLocationModalComponent],
})
export class DeloitteAdditionalInfoLocationModalModule {}

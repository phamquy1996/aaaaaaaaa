import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { MembershipDurationComponent } from './membership-duration.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [MembershipDurationComponent],
  exports: [MembershipDurationComponent],
})
export class MembershipDurationModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { GiveGetReferComponent } from './give-get-refer/give-get-refer.component';
import { GiveGetReferralListComponent } from './give-get-referral-list/give-get-referral-list.component';
import { GiveGetStatsComponent } from './give-get-stats/give-get-stats.component';
import { GiveComponent } from './give.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [
    GiveComponent,
    GiveGetReferComponent,
    GiveGetReferralListComponent,
    GiveGetStatsComponent,
  ],
  exports: [GiveComponent],
})
export class GiveSharedModule {}

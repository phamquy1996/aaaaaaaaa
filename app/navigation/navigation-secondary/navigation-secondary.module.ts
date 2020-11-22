import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  DatastoreReferralInvitationCheckModule,
  DatastoreUsersSelfModule,
} from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BarItemComponent } from './bar-item/bar-item.component';
import { BarComponent } from './bar/bar.component';
import { CompatLinkActiveDirective } from './compat-link-active.directive';

// tslint:disable-next-line:validate-ng-module
@NgModule({
  imports: [
    CommonModule,
    DatastoreReferralInvitationCheckModule,
    DatastoreUsersSelfModule,
    UiModule,
    RouterModule,
    TrackingModule,
    PerfectScrollbarModule,
  ],
  declarations: [BarComponent, BarItemComponent, CompatLinkActiveDirective],
  exports: [BarComponent, BarItemComponent],
})
export class NavigationSecondaryModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreReferralInvitationCheckModule,
  DatastoreThreadsModule,
  DatastoreUsersSelfModule,
} from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { NavigationChildModule } from './navigation-child/navigation-child.module';
import { NavigationLoggedOutModule } from './navigation-logged-out/navigation-logged-out.module';
import { NavigationPrimaryModule } from './navigation-primary/navigation-primary.module';
import { NavigationComponent } from './navigation.component';

@NgModule({
  imports: [
    CommonModule,
    DatastoreReferralInvitationCheckModule,
    DatastoreThreadsModule,
    DatastoreUsersSelfModule,
    NavigationPrimaryModule,
    NavigationChildModule,
    NavigationLoggedOutModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
})
export class NavigationModule {}

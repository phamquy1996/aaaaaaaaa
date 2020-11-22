import { NgModule } from '@angular/core';
import { DatastoreGrantsModule } from '@freelancer/datastore/collections';
import { PartnerDashboardAccess } from './partner-dashboard-access.service';

@NgModule({
  imports: [DatastoreGrantsModule],
  providers: [PartnerDashboardAccess],
})
export class PartnerDashboardAccessModule {}

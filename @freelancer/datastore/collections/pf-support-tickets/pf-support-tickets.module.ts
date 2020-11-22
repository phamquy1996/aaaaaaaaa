import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { pfSupportTicketsBackend } from './pf-support-tickets.backend';
import { pfSupportTicketsReducer } from './pf-support-tickets.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('pfSupportTickets', pfSupportTicketsReducer),
    BackendModule.forFeature('pfSupportTickets', pfSupportTicketsBackend),
  ],
})
export class DatastorePfSupportTicketsModule {}

import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { projectOfferBackend } from './project-offer.backend';
import { projectOfferReducer } from './project-offer.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('projectOffer', projectOfferReducer),
    BackendModule.forFeature('projectOffer', projectOfferBackend),
  ],
})
export class DatastoreProjectOfferModule {}

import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { userRequiresGdprBackend } from './user-requires-gdpr.backend';
import { userRequiresGdprReducer } from './user-requires-gdpr.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('userRequiresGdpr', userRequiresGdprReducer),
    BackendModule.forFeature('userRequiresGdpr', userRequiresGdprBackend),
  ],
})
export class DatastoreUserRequiresGdprModule {}

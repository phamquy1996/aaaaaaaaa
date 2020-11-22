import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { applicationScopesBackend } from './application-scopes.backend';
import { applicationScopesReducer } from './application-scopes.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('applicationScopes', applicationScopesReducer),
    BackendModule.forFeature('applicationScopes', applicationScopesBackend),
  ],
})
export class DatastoreApplicationScopesModule {}

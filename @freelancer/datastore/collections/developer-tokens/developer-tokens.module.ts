import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { developerTokensBackend } from './developer-tokens.backend';
import { developerTokensReducer } from './developer-tokens.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('developerTokens', developerTokensReducer),
    BackendModule.forFeature('developerTokens', developerTokensBackend),
  ],
})
export class DatastoreDeveloperTokensModule {}

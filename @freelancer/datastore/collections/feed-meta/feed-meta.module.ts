import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { feedMetaBackend } from './feed-meta.backend';
import { feedMetaReducer } from './feed-meta.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('feedMeta', feedMetaReducer),
    BackendModule.forFeature('feedMeta', feedMetaBackend),
  ],
})
export class DatastoreFeedMetaModule {}

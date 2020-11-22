import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { siteStatsBackend } from './site-stats.backend';
import { siteStatsReducer } from './site-stats.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('siteStats', siteStatsReducer),
    BackendModule.forFeature('siteStats', siteStatsBackend),
  ],
})
export class DatastoreSiteStatsModule {}

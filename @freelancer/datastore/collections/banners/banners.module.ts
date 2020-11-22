import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { bannersBackend } from './banners.backend';
import { bannersReducer } from './banners.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('banners', bannersReducer),
    BackendModule.forFeature('banners', bannersBackend),
  ],
})
export class DatastoreBannersModule {}

import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { reviewsBackend } from './reviews.backend';
import { reviewsReducer } from './reviews.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('reviews', reviewsReducer),
    BackendModule.forFeature('reviews', reviewsBackend),
  ],
})
export class DatastoreReviewsModule {}

import { NgModule } from '@angular/core';
import { BackendModule } from '@freelancer/datastore/core';
import { StoreModule } from '@ngrx/store';
import { emailIsAvailableForArrowBackend } from './email-is-available-for-arrow.backend';
import { emailIsAvailableForArrowReducer } from './email-is-available-for-arrow.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      'emailIsAvailableForArrow',
      emailIsAvailableForArrowReducer,
    ),
    BackendModule.forFeature(
      'emailIsAvailableForArrow',
      emailIsAvailableForArrowBackend,
    ),
  ],
})
export class DatastoreEmailIsAvailableForArrowModule {}

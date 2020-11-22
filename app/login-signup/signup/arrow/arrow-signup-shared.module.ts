import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreCountriesModule,
  DatastoreUserRequiresGdprModule,
} from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { SuccessRedirectModule } from 'app/login-signup/success-redirect';
import { SignupStepsModule } from '../steps/signup-steps.module';
import { ArrowSignupComponent } from './arrow-signup.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DatastoreCountriesModule,
    DatastoreUserRequiresGdprModule,
    SignupStepsModule,
    TrackingModule,
    SuccessRedirectModule,
  ],
  exports: [ArrowSignupComponent],
  declarations: [ArrowSignupComponent],
})
export class ArrowSignupSharedModule {}

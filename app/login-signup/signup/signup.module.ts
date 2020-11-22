import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatastoreUserRequiresGdprModule } from '@freelancer/datastore/collections';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ResetPasswordModule } from 'app/login-signup/reset-password/reset-password.module';
import { SuccessRedirectModule } from '../success-redirect';
import { SignupComponent } from './signup.component';
import { SignupStepsModule } from './steps/signup-steps.module';

@NgModule({
  imports: [
    SignupStepsModule,
    SuccessRedirectModule,
    DatastoreUserRequiresGdprModule,
    ResetPasswordModule,
    CommonModule,
    PipesModule,
    TrackingModule,
    UiModule,
  ],
  exports: [SignupComponent],
  declarations: [SignupComponent],
})
export class SignupModule {}

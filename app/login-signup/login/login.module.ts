import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { ResetPasswordModule } from 'app/login-signup/reset-password/reset-password.module';
import { SuccessRedirectModule } from '../success-redirect';
import { LoginComponent } from './login.component';
import { LoginStepsModule } from './steps/login-steps.module';

@NgModule({
  imports: [
    LoginStepsModule,
    SuccessRedirectModule,
    ResetPasswordModule,
    CommonModule,
    PipesModule,
    TrackingModule,
    UiModule,
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
})
export class LoginModule {}

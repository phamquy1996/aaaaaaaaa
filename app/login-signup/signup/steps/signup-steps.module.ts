import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaptchaModule } from '@freelancer/captcha';
import { ComponentsModule } from '@freelancer/components';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { FormLogoModule } from 'app/login-signup/form-logo/form-logo.module';
import { LoginSignupButtonsModule } from 'app/login-signup/login-signup-buttons.module';
import { LoginSignupErrorsModule } from 'app/login-signup/login-signup-errors/login-signup-errors.module';
import { UsernameSelectModule } from 'app/login-signup/username-select/username-select.module';
import { AccountTypeFormComponent } from './account-type-form/account-type-form.component';
import { CaptchaFormComponent } from './captcha-form/captcha-form.component';
import {
  DetailsFormComponent,
  DetailsFormHeaderComponent,
} from './details-form/details-form.component';
import { FacebookSignupComponent } from './facebook-signup/facebook-signup.component';
import { GdprFormComponent } from './gdpr-form/gdpr-form.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    LoginSignupButtonsModule,
    LoginSignupErrorsModule,
    FormLogoModule,
    PipesModule,
    TrackingModule,
    UiModule,
    UsernameSelectModule,
    CaptchaModule,
  ],
  exports: [
    AccountTypeFormComponent,
    DetailsFormComponent,
    DetailsFormHeaderComponent,
    FacebookSignupComponent,
    GdprFormComponent,
    CaptchaFormComponent,
    UsernameSelectModule,
  ],
  declarations: [
    AccountTypeFormComponent,
    DetailsFormComponent,
    DetailsFormHeaderComponent,
    FacebookSignupComponent,
    GdprFormComponent,
    CaptchaFormComponent,
  ],
})
export class SignupStepsModule {}

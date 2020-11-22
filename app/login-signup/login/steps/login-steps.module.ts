import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import { PipesModule } from '@freelancer/pipes';
import { PwaModule } from '@freelancer/pwa';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { FormLogoModule } from 'app/login-signup/form-logo/form-logo.module';
import { LoginSignupButtonsModule } from 'app/login-signup/login-signup-buttons.module';
import { LoginSignupErrorsModule } from 'app/login-signup/login-signup-errors/login-signup-errors.module';
import { TwoFactorFormModule } from '../two-factor-form/two-factor-form.module';
import { CredentialsFormComponent } from './credentials-form/credentials-form.component';
import { FacebookLinkComponent } from './facebook-link/facebook-link.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormLogoModule,
    LoginSignupButtonsModule,
    LoginSignupErrorsModule,
    PipesModule,
    TrackingModule,
    TwoFactorFormModule,
    UiModule,
    PwaModule,
  ],
  exports: [
    CredentialsFormComponent,
    FacebookLinkComponent,
    TwoFactorFormModule,
  ],
  declarations: [CredentialsFormComponent, FacebookLinkComponent],
})
export class LoginStepsModule {}

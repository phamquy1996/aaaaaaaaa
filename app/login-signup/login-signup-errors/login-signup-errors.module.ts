import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { LoginSignupErrorsComponent } from './login-signup-errors.component';

@NgModule({
  imports: [CommonModule, UiModule, TrackingModule],
  declarations: [LoginSignupErrorsComponent],
  exports: [LoginSignupErrorsComponent],
})
export class LoginSignupErrorsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CaptchaComponent } from './captcha.component';

@NgModule({
  imports: [NgxCaptchaModule, CommonModule, ReactiveFormsModule],
  exports: [CaptchaComponent],
  declarations: [CaptchaComponent],
})
export class CaptchaModule {}

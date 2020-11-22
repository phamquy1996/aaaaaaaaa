import { Component, Inject, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CAPTCHA_CONFIG } from './captcha.config';
import { CaptchaConfig } from './captcha.interface';

@Component({
  selector: 'fl-captcha',
  template: `
    <ngx-recaptcha2
      #captchaElement
      [siteKey]="config.recaptchaPublicKey"
      [formControl]="control"
    ></ngx-recaptcha2>
  `,
})
export class CaptchaComponent {
  @Input() control: FormControl;

  @ViewChild('captchaElement', { static: true })
  captchaElement: ReCaptcha2Component;

  constructor(@Inject(CAPTCHA_CONFIG) public config: CaptchaConfig) {}

  reset() {
    this.captchaElement.resetCaptcha();
  }
}

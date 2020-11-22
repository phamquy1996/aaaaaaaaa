import { InjectionToken } from '@angular/core';
import { CaptchaConfig } from './captcha.interface';

export const CAPTCHA_CONFIG = new InjectionToken<CaptchaConfig>(
  'CaptchaConfig',
);

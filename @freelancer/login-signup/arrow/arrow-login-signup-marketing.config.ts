import { InjectionToken } from '@angular/core';
import { ArrowLoginSignupMarketingConfig } from './arrow-login-signup-marketing.interface';

export const ARROW_LOGIN_SIGNUP_MARKETING_CONFIG = new InjectionToken<
  ArrowLoginSignupMarketingConfig
>('ArrowLoginSignupMarketingConfig');

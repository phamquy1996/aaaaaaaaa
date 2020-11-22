import { InjectionToken } from '@angular/core';
import { FacebookConfig } from './facebook.interface';

export const FACEBOOK_CONFIG = new InjectionToken<FacebookConfig>(
  'FacebookConfig',
);

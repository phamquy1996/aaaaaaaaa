import { InjectionToken } from '@angular/core';
import { AuthConfig } from './auth.interface';

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AuthConfig');
export const ADMIN_AUTH_CONFIG = new InjectionToken<AuthConfig>(
  'AdminAuthConfig',
);

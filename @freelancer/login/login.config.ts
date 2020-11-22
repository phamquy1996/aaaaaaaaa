import { InjectionToken } from '@angular/core';
import { AuthServiceInterface } from '@freelancer/auth';
import { LoginConfig, LoginServiceInterface } from './login.interface';

export const LOGIN_REDIRECT_SERVICE = new InjectionToken<LoginServiceInterface>(
  'LoginServiceInterface',
);

export const LOGIN_AUTH_SERVICE = new InjectionToken<AuthServiceInterface>(
  'AuthServiceInterface',
);

export const LOGIN_CONFIG = new InjectionToken<LoginConfig>('LoginConfig');

import { InjectionToken } from '@angular/core';
import { AuthServiceInterface } from '@freelancer/auth';
import { FreelancerLocationPwaInterface } from './location.interface';

export const FREELANCER_LOCATION_AUTH_PROVIDER = new InjectionToken<
  AuthServiceInterface
>('FreelancerLocationAuthProvider');

export const FREELANCER_LOCATION_HTTP_BASE_URL_PROVIDER = new InjectionToken<
  string
>('FreelancerLocationHttpBaseUrlProvider');

export const FREELANCER_LOCATION_PWA_PROVIDER = new InjectionToken<
  FreelancerLocationPwaInterface
>('FreelancerLocationPwaProvider');

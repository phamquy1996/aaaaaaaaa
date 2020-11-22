import { InjectionToken } from '@angular/core';
import { AuthServiceInterface } from '@freelancer/auth';
import {
  FreelancerHttpABTestOverridesInterface,
  FreelancerHttpConfig,
} from './freelancer-http.interface';

export const FREELANCER_HTTP_CONFIG = new InjectionToken<FreelancerHttpConfig>(
  'FreelancerHttpConfig',
);

export const FREELANCER_HTTP_AUTH_PROVIDERS = new InjectionToken<
  ReadonlyArray<AuthServiceInterface>
>('FreelancerHttpAuthProviders');

export const FREELANCER_HTTP_ABTEST_OVERRIDES_PROVIDER = new InjectionToken<
  ReadonlyArray<FreelancerHttpABTestOverridesInterface>
>('FreelancerHttpABTestOverridesProvider');

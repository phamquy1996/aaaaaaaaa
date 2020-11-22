import { InjectionToken } from '@angular/core';
import { FreelancerPwaTrackingInterface, PwaConfig } from './interface';

export const PWA_CONFIG = new InjectionToken<PwaConfig>('PwaConfig');

export const FREELANCER_PWA_TRACKING_PROVIDER = new InjectionToken<
  FreelancerPwaTrackingInterface
>('FreelancerPwaTrackingInterface');

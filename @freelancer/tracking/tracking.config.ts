import { InjectionToken } from '@angular/core';
import { TrackingConfig } from './tracking.interface';

export const TRACKING_CONFIG = new InjectionToken<TrackingConfig>(
  'TrackingConfig',
);

export const DISABLE_ERROR_TRACKING = new InjectionToken<boolean>(
  'DisableSentry',
);

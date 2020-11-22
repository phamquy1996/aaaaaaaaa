import { InjectionToken } from '@angular/core';
import { ThreatmetrixConfig } from './threatmetrix.interface';

export const THREATMETRIX_CONFIG = new InjectionToken<ThreatmetrixConfig>(
  'ThreatmetrixConfig',
);

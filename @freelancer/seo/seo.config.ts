import { InjectionToken } from '@angular/core';
import { SeoConfig } from './seo.interface';

export const SEO_CONFIG = new InjectionToken<SeoConfig>('SeoConfig');

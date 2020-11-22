import { InjectionToken } from '@angular/core';
import { Locale } from '@freelancer/config';

export const LANGUAGE_COOKIE = new InjectionToken<Locale>('LanguageCookie');

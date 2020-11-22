import { InjectionToken } from '@angular/core';
import { AppsDomainsMap } from './interface';

// The application runtime environments (dev/stg/sandbox/prod)
export enum Environment {
  DEV = 'dev',
  STG = 'stg',
  SANDBOX = 'sandbox',
  PROD = 'prod',
}

// Webapp applications. Add you new app here, and fill-in the config bellow.
export enum Applications {
  MAIN = 'main', // 'gaf'
  DEVELOPERS = 'developers',
  ADMIN = 'admin',
  BITS = 'bits',
  ARROW = 'arrow',
  DELOITTE = 'deloitte',
  FREIGHTLANCER = 'freightlancer',
}

export enum CompatApplications {
  COMPAT = 'compat', // 'gaf'
  COMPAT_ARROW = 'compat-arrow',
  COMPAT_DELOITTE = 'compat-deloitte',
  COMPAT_FREIGHTLANCER = 'compat-freightlancer',
}

export enum AlternateApplications {
  FREEMARKET = 'freemarket',
  QABOX = 'qabox',
  EXTERNAL_SANDBOX = 'externalSandbox',
}

// Currently supported locales (ISO 639-1 codes except "fil" which
// is ISO_639-2). Yeah I know that's a mess
export type Locale =
  | 'af'
  | 'bn'
  | 'ca'
  | 'cs'
  | 'cs-CZ'
  | 'da'
  | 'da-DK'
  | 'de'
  | 'de-DE'
  | 'el'
  | 'el-GR'
  | 'en'
  | 'en-AU'
  | 'en-BD'
  | 'en-CA'
  | 'en-GB'
  | 'en-IE'
  | 'en-IN'
  | 'en-IS'
  | 'en-JM'
  | 'en-NZ'
  | 'en-PH'
  | 'en-PK'
  | 'en-SG'
  | 'en-ZA'
  | 'es'
  | 'es-AR'
  | 'es-CL'
  | 'es-CO'
  | 'es-EC'
  | 'es-ES'
  | 'es-MX'
  | 'es-PE'
  | 'es-UY'
  | 'fi'
  | 'fi-FI'
  | 'fil'
  | 'fr'
  | 'fr-FR'
  | 'hi'
  | 'hu'
  | 'hu-HU'
  | 'id'
  | 'id-ID'
  | 'it'
  | 'it-IT'
  | 'ja'
  | 'ja-JP'
  | 'ko'
  | 'ko-KR'
  | 'ms'
  | 'ms-MY'
  | 'nb'
  | 'nb-NO'
  | 'nl'
  | 'pl'
  | 'pl-PL'
  | 'pt'
  | 'pt-BR'
  | 'pt-PT'
  | 'ro'
  | 'ro-RO'
  | 'ru'
  | 'ru-RU'
  | 'sl'
  | 'sl-SI'
  | 'sq'
  | 'sq-AL'
  | 'sv'
  | 'sv-SE'
  | 'sw'
  | 'sw-KE'
  | 'th'
  | 'th-TH'
  | 'tr'
  | 'tr-TR'
  | 'uk'
  | 'uk-UA'
  | 'vi'
  | 'vi-VN'
  | 'zh'
  | 'zh-CN'
  | 'zh-HK';

export const APPS_DOMAINS_MAP = new InjectionToken<AppsDomainsMap>(
  'AppsDomainsMap',
);

export const APP_NAME = new InjectionToken<Applications & CompatApplications>(
  'Applications',
);

export const ENVIRONMENT_NAME = new InjectionToken<Environment>('Environment');

export const SITE_NAME = new InjectionToken<string>('SiteName');

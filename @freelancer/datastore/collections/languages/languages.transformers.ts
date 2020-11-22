import { LanguageApi } from 'api-typings/translations/translations_types';
import { Language } from './languages.model';

export function transformLanguage(language: LanguageApi): Language {
  return {
    id: language.code,
    code: language.code,
    name: language.language,
    englishName: language.english_name,
    active: language.active,
  };
}

import { Language } from './languages.model';

// TODO: Generate other languages
export function generateLanguagesObject(): Language {
  return {
    id: 'en',
    code: 'en',
    name: 'English',
    englishName: 'English',
    active: true,
  };
}

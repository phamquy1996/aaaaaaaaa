import { LanguageDetectGetResult } from './language-detect.backend-model';
import { LanguageDetect } from './language-detect.model';

export function transformLanguageDetect(
  languageDetect: LanguageDetectGetResult,
): LanguageDetect {
  return {
    id: languageDetect.id,
    code: languageDetect.code,
    name: languageDetect.name,
    likelihood: languageDetect.likelihood,
    source: languageDetect.source,
    text: languageDetect.text,
  };
}

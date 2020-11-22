import { EmailIsAvailableForArrowGetResultAjaxApi } from './email-is-available-for-arrow.backend-model';
import { EmailIsAvailableForArrow } from './email-is-available-for-arrow.model';

export function transformEmailIsAvailableForArrow(
  emailIsAvailableForArrow: EmailIsAvailableForArrowGetResultAjaxApi,
): EmailIsAvailableForArrow {
  return {
    id: emailIsAvailableForArrow.email,
    email: emailIsAvailableForArrow.email,
    isAvailable: emailIsAvailableForArrow.isAvailable,
  };
}

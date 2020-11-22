import { CanViewEmployerProfileGetResultAjax } from './can-view-employer-profile.backend-model';
import { CanViewEmployerProfile } from './can-view-employer-profile.model';

export function transformCanViewEmployerProfile(
  response: CanViewEmployerProfileGetResultAjax,
): CanViewEmployerProfile {
  return {
    id: response.userId,
    canViewEmployerProfile: response.canViewEmployerProfile,
  };
}

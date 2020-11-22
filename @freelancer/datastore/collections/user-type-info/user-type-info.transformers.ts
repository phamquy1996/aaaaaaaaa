import { UserTypeInfoRawPayload } from './user-type-info.backend-model';
import { UserTypeInfo } from './user-type-info.model';

export function transformUserTypeInfo(
  userTypeInfo: UserTypeInfoRawPayload,
): UserTypeInfo {
  return {
    id: userTypeInfo.id,
    lookingFor: userTypeInfo.looking_for,
  };
}

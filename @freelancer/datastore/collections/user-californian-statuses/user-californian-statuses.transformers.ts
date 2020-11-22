import { UserCalifornianStatusGetResultAjaxApi } from './user-californian-statuses.backend-model';
import { UserCalifornianStatus } from './user-californian-statuses.model';

export function transformUserCalifornianStatuses(
  userCalifornianStatus: UserCalifornianStatusGetResultAjaxApi,
  authUid: string,
): UserCalifornianStatus {
  return {
    id: authUid,
    ip: userCalifornianStatus.ip,
    isUserPotentiallyCalifornian: userCalifornianStatus.isUserPotentialCali,
    isUserCalifornian: userCalifornianStatus.isUserCali,
  };
}

import { DeloitteUserInfoAjax } from './deloitte-user-info.backend-model';
import { DeloitteUserInfo } from './deloitte-user-info.model';

export function transformDeloitteUserInfo(
  deloitteUserInfo: DeloitteUserInfoAjax,
): DeloitteUserInfo {
  return {
    id: deloitteUserInfo.id,
    phone: deloitteUserInfo.phone,
    title: deloitteUserInfo.title,
    company: deloitteUserInfo.company,
    department: deloitteUserInfo.department,
  };
}

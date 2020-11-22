import { AccountProgressAjax } from './account-progress.backend-model';
import { AccountProgress } from './account-progress.model';

export function transformAccountProgress(
  accountProgress: AccountProgressAjax,
): AccountProgress {
  return {
    ...accountProgress,
    verificationCode: accountProgress.verificationCode || undefined,
  };
}

import { isDefined } from '@freelancer/utils';
import { TrialApi } from 'api-typings/memberships/memberships_types';
import { transformMembershipPackage } from '../membership-packages/membership-packages.transformers';
import { MembershipTrial } from './membership-trials.model';

export function transformMembershipTrials(trial: TrialApi): MembershipTrial {
  if (!isDefined(trial.id)) {
    throw new Error('Trial id should always have a value');
  }

  if (!isDefined(trial.pkg)) {
    throw new Error('Trial pkg should always have a value');
  }

  if (!isDefined(trial.trial_package)) {
    throw new Error('Trial trial_package should always have a value');
  }

  return {
    id: trial.id,
    packageId: trial.package_id,
    duration: trial.duration,
    eligible: trial.eligible,
    trialPackageId: trial.trial_package_id,
    trialDuration: trial.duration,
    timeValidStart: trial.time_valid_start && trial.time_valid_start * 1000,
    timeValidEnd: trial.time_valid_end && trial.time_valid_end * 1000,
    isDefault: trial.is_default,
    package: transformMembershipPackage(trial.pkg),
    trialPackage: transformMembershipPackage(trial.trial_package),
  };
}

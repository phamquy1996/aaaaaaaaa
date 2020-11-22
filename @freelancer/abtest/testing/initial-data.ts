import {
  ProjectExperiments,
  SessionExperiments,
  UserExperiments,
} from '../experiments';

export const sessionExperiments: Partial<SessionExperiments> = {
  'T194698-home-page-aa-test': 'control',
  'T194698-home-page-aa-test-v1': 'control',
};

export const userExperiments: Partial<UserExperiments> = {
  'T214387-freelancer-suggested-milestones': 'control',
  'T111865-logged-in-pjp-live-chat-just-enrollment': 'control',
  'T198995-bid-card-redesign-v3': 'control',
  'T171655-replace-ebc-with-profile-page': 'control',
  'T58186-giveget-delayed-payment-verify-v2': 'control',
  'T90189-image-thumbnail-service': 'control',
  'T151438-ga-fb-conversion-tracking-v1': 'control',
  'T183128-projects-amount-overview-on-dashboard': 'control',
  'T178308-freelancer-my-projects-empty-state-V2': 'control',
  webapp_playground_test: 'control',
};
export const projectExperiments: Partial<ProjectExperiments> = {};

export const isWhitelistUser = false;

export const shouldEnrol = true;

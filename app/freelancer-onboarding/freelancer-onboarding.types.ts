export enum FreelancerOnboardingSteps {
  SKILLS = 'skills',
  LINKED_ACCOUNTS = 'linked-accounts',
  PROFILE_DETAILS = 'profile-details',
  EMAIL_VERIFICATION = 'email-verification',
  PHONE_VERIFICATION = 'phone-verification',
  PAYMENT_VERIFICATION = 'payment-verification',
  MEMBERSHIP_OFFER = 'membership-offer',
}

export enum ProfileDetailsSteps {
  PHOTO_AND_NAME = 'photo-and-name',
  HEADLINE_AND_SUMMARY = 'headline-and-summary',
  LANGUAGES_AND_BIRTHDATE = 'languages-and-birthdate',
  ADDRESS = 'address',
}

export enum FreelancerOnboardingBaseRoutes {
  PARENT = '/new-freelancer/',
  PROFILE_DETAILS = '/new-freelancer/profile-details/',
}

export const percentProgress = {
  [FreelancerOnboardingSteps.SKILLS]: 10,
  [FreelancerOnboardingSteps.LINKED_ACCOUNTS]: 30,
  [FreelancerOnboardingSteps.PROFILE_DETAILS]: 30,
  [ProfileDetailsSteps.PHOTO_AND_NAME]: 30,
  [ProfileDetailsSteps.HEADLINE_AND_SUMMARY]: 50,
  [ProfileDetailsSteps.LANGUAGES_AND_BIRTHDATE]: 65,
  [ProfileDetailsSteps.ADDRESS]: 75,
  [FreelancerOnboardingSteps.EMAIL_VERIFICATION]: 80,
  [FreelancerOnboardingSteps.PHONE_VERIFICATION]: 90,
};

export enum LinkedAccountType {
  FACEBOOK = 1,
  LINKEDIN,
}

export interface UrlParams {
  readonly link: string;
  readonly queryParams?: any;
}

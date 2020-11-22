export enum SubscriptionType {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
  ANNUAL_PRE_PAID = 'annual_pre_paid',
}

export enum SubscriptionAction {
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  CONTINUE = 'continue',
  TRIAL = 'trial',
}

export enum LegacyMembershipPackages {
  INTRO = 'plan15',
  STARTER = 'plan15_1',
  BASIC = 'plan20',
  BASIC_WITH_EXAM = 'plan20_1',
  PLUS = 'plan25',
  PLUS_WITH_EXAM = 'plan25_1',
  STANDARD = 'plan30',
  PROFESSIONAL = 'plan30_1',
  PROFESSIONAL_WITH_EXAM = 'plan30_2',
  PREMIUM = 'plan50',
  PREMIER = 'plan50_1',
  PREMIER_WITH_EXAM = 'plan50_2',
  PREMIER_1500_BIDS = 'plan50_3',
}

export const GRANDFATHERED_PACKAGE_IDS: ReadonlyArray<number> = [
  // STARTER,
  17,
  // BASIC_WITH_EXAM,
  21,
  // PLUS_WITH_EXAM,
  18,
  // STANDARD,
  3,
  // PROFESSIONAL_WITH_EXAM,
  19,
  // PREMIUM,
  4,
  // PREMIER_1500_BIDS,
  23,
];

export const PROFILE_BENEFITS: ReadonlyArray<string> = [
  'bids_limit',
  'skills_limit',
  'freelancer_reward',
  'cover_photo',
  'project_watching',
  'preferred_freelancer',
  'same_day_withdrawal',
  'employer_following',
];

export const CONTEST_BENEFITS: ReadonlyArray<string> = [
  'free_highlighted_contest_entries',
  'free_sealed_contest_entries',
];

export const PROJECT_BENEFITS: ReadonlyArray<string> = [
  'offsite_invoice',
  'free_hidden_bids',
  'free_extend',
  'bid_on_premium_projects',
  'freelancer_insights',
  'free_non_disclosure_agreement',
];

export const MEMBERSHIP_BADGES: ReadonlyArray<string> = [
  'level-one',
  'level-two',
  'level-three',
  'level-four',
  'level-five',
];

export const HIGH_LTV_COUPON = 'annual-discount-high-ltv-monthly';
export const HIGH_LTV_DAYS_REQUIRED = 90;
export const CORPORATE_MEMBERSHIP_PACKAGE_ID = 22;
export const CURRENT_SALE = 'HALLOWEEN2020';

// Don't show the current sale prices if a user is currently subscribed to the following packages
export const SALE_PACKAGE_BLACKLIST: ReadonlyArray<LegacyMembershipPackages> = [
  LegacyMembershipPackages.BASIC_WITH_EXAM,
  LegacyMembershipPackages.PLUS_WITH_EXAM,
  LegacyMembershipPackages.PROFESSIONAL_WITH_EXAM,
  LegacyMembershipPackages.PREMIER_WITH_EXAM,
  LegacyMembershipPackages.PREMIER_1500_BIDS,
];

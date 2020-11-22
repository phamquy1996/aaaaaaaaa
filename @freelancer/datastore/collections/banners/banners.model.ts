import { Currency } from '../currencies/currencies.model';

export enum CloseableDashboardBannerId {
  CORPORATE_UPSELL = 'dashboard_corporate_upsell',
  EXAM_UPSELL = 'dashboard_exam_upsell',
  FREELANCER_VERIFIED = 'freelancer_verified',
  MEMBERSHIP_UPSELL = 'dashboard_membership_upsell',
  WELCOME_BACK = 'dashboard_welcome_back',
}

export enum BannerId {
  NONE = 'none',

  // dashboard
  CORPORATE_UPSELL = 'corporate_upsell',
  EXAM_UPSELL = 'exam_upsell',
  FREELANCER_VERIFIED = 'freelancer_verified',
  GIVE_GET = 'give_get',
  MEMBERSHIP_UPSELL = 'membership_upsell',
  MISSING_FIRST_MILESTONE = 'missing_first_milestone',
  PROJECT_MANAGEMENT = 'project_management',
  WELCOME_BACK = 'welcome_back',

  // profile widget upsell
  MEMBERSHIP_UPGRADE_UPSELL = 'membership_upgrade_upsell',
  PLUS_UPSELL = 'plus_upsell',
  PREMIUM_UPSELL = 'premium_upsell',
  GET_STARTED = 'get_started',

  // verification
  REFERRAL_BONUS = 'referral_bonus',
  PARTNERSHIP_PAYMENT_VERIFICATION = 'partnership_payment_verification',
  EMAIL_VERIFICATION = 'email_verification',
  PENDING_INFORMATION_REQUEST = 'pending_information_request',
  VAT_VERIFICATION = 'vat_verification',
  TCS_VERIFICATION = 'tcs_verification',
  CALIFORNIAN_VERIFICATION = 'californian_verification',
  CREDIT_CARD_VERIFICATION = 'credit_card_verification',
  CREDIT_CARD_VERIFICATION_IN_PROGRESS = 'credit_card_verification_in_progress',
  FORCE_PHONE_VERIFICATION = 'force_phone_verification',
  SECURE_PHONE_SETUP = 'secure_phone_setup',
  ACCOUNT_LIMITED = 'account_limited',
  KYC = 'kyc',
  CORPORATE_KYC = 'corporate_kyc',
  FORCE_CREDIT_CARD_VERIFICATION = 'force_credit_card_verification',
  EXPIRING_CREDIT_CARD = 'expiring_credit_card',
  PHONE_VERIFICATION = 'phone_verification',
}

export const enum BannerType {
  DASHBOARD = 'dashboard',
  PROFILE_WIDGET_UPSELL = 'profile_widget_upsell',
  USER_PROFILE = 'user_profile',
  VERIFICATION = 'verification',
}

export interface BannerBase {
  readonly id: BannerId;
  readonly type: BannerType;
}

/**
 * A banner for various membership and give-get promotions.
 * Primarily used on the dashboard (https://www.freelancer.com/dashboard).
 */
export type Banner =
  | MissingFirstMilestoneBanner
  | WelcomeBackBanner
  | MembershipUpsellBanner
  | ExamUpsellBanner
  | GiveGetBanner
  | ProjectManagementBanner
  | NoBanner
  | MembershipUpgradeUpsellBanner
  | PlusUpsellBanner
  | PremiumUpsellBanner
  | GettingStartedBanner
  | ReferralBonusBanner
  | PartnershipPaymentVerificationBanner
  | EmailVerificationBanner
  | PendingInformationRequestBanner
  | VatVerificationBanner
  | TcsVerificationBanner
  | CreditCardVerificationBanner
  | CreditCardVerificationInProgressBanner
  | ForcePhoneVerificationBanner
  | SecurePhoneSetupBanner
  | AccountLimitedBanner
  | KycBanner
  | CorporateKycBanner
  | ForceCreditCardVerificationBanner
  | ExpiringCreditCardBanner
  | PhoneVerificationBanner
  | CalifornianVerificationBanner
  | CorporateUpsellBanner
  | FreelancerVerifiedBanner;

/* Dashboard banners */
export interface MissingFirstMilestoneBanner extends BannerBase {
  readonly id: BannerId.MISSING_FIRST_MILESTONE;
  readonly projectTitle: string;
  readonly projectUrl: string;
  readonly sellerDisplayName: string;
}

export interface WelcomeBackBanner extends BannerBase {
  readonly id: BannerId.WELCOME_BACK;
  readonly reward: WelcomeBackReward;
}

export interface MembershipUpsellBanner extends BannerBase {
  readonly id: BannerId.MEMBERSHIP_UPSELL;
  readonly bidsLimit: number;
  readonly packageId: number;
  readonly packageCode: string;
}

export interface FreelancerVerifiedBanner extends BannerBase {
  readonly id: BannerId.FREELANCER_VERIFIED;
}

export interface ExamUpsellBanner extends BannerBase {
  readonly id: BannerId.EXAM_UPSELL;
}

export interface GiveGetBanner extends BannerBase {
  readonly id: BannerId.GIVE_GET;
}

export interface ProjectManagementBanner extends BannerBase {
  readonly id: BannerId.PROJECT_MANAGEMENT;
}

export interface NoBanner extends BannerBase {
  readonly id: BannerId.NONE;
}

export interface WelcomeBackReward {
  readonly amount: number;
  readonly currency: Currency;
}

/* Profile widget upsell banners */
export interface MembershipUpgradeUpsellBanner extends BannerBase {
  readonly id: BannerId.MEMBERSHIP_UPGRADE_UPSELL;
}

export interface PlusUpsellBanner extends BannerBase {
  readonly id: BannerId.PLUS_UPSELL;
}

export interface GettingStartedBanner extends BannerBase {
  readonly id: BannerId.GET_STARTED;
}

export interface PremiumUpsellBanner extends BannerBase {
  readonly id: BannerId.PREMIUM_UPSELL;
}

export interface ReferralBonusBanner extends BannerBase {
  readonly id: BannerId.REFERRAL_BONUS;
  readonly currencyCode: string;
  readonly amount: number;
  readonly referrer: string;
}

export interface PartnershipPaymentVerificationBanner extends BannerBase {
  readonly id: BannerId.PARTNERSHIP_PAYMENT_VERIFICATION;
}

export interface EmailVerificationBanner extends BannerBase {
  readonly id: BannerId.EMAIL_VERIFICATION;
  readonly email: string;
  readonly name: string;
  readonly userId: number;
  readonly key: string;
}

export interface PendingInformationRequestBanner extends BannerBase {
  readonly id: BannerId.PENDING_INFORMATION_REQUEST;
  readonly daysLeft: number;
}

export interface VatVerificationBanner extends BannerBase {
  readonly id: BannerId.VAT_VERIFICATION;
}

export interface TcsVerificationBanner extends BannerBase {
  readonly id: BannerId.TCS_VERIFICATION;
}

export interface CreditCardVerificationBanner extends BannerBase {
  readonly id: BannerId.CREDIT_CARD_VERIFICATION;
}

export interface CreditCardVerificationInProgressBanner extends BannerBase {
  readonly id: BannerId.CREDIT_CARD_VERIFICATION_IN_PROGRESS;
}

export interface ForcePhoneVerificationBanner extends BannerBase {
  readonly id: BannerId.FORCE_PHONE_VERIFICATION;
}

export interface SecurePhoneSetupBanner extends BannerBase {
  readonly id: BannerId.SECURE_PHONE_SETUP;
}

export interface AccountLimitedBanner extends BannerBase {
  readonly id: BannerId.ACCOUNT_LIMITED;
}

export interface KycBanner extends BannerBase {
  readonly id: BannerId.KYC;
}

export interface CorporateKycBanner extends BannerBase {
  readonly id: BannerId.CORPORATE_KYC;
}

export interface ForceCreditCardVerificationBanner extends BannerBase {
  readonly id: BannerId.FORCE_CREDIT_CARD_VERIFICATION;
}

export interface ExpiringCreditCardBanner extends BannerBase {
  readonly id: BannerId.EXPIRING_CREDIT_CARD;
  readonly daysLeft: number;
}

export interface PhoneVerificationBanner extends BannerBase {
  readonly id: BannerId.PHONE_VERIFICATION;
  readonly name: string;
}

export interface CalifornianVerificationBanner extends BannerBase {
  readonly id: BannerId.CALIFORNIAN_VERIFICATION;
}

export interface CorporateUpsellBanner extends BannerBase {
  readonly id: BannerId.CORPORATE_UPSELL;
}

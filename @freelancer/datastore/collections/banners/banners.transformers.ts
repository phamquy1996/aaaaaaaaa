import { assertNever } from '@freelancer/utils';
import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { BannerAjax } from './banners.backend-model';
import { Banner, BannerId } from './banners.model';

export function transformBanners(banner: BannerAjax): Banner {
  switch (banner.id) {
    case BannerId.ACCOUNT_LIMITED:
    case BannerId.CALIFORNIAN_VERIFICATION:
    case BannerId.CORPORATE_KYC:
    case BannerId.CORPORATE_UPSELL:
    case BannerId.CREDIT_CARD_VERIFICATION:
    case BannerId.CREDIT_CARD_VERIFICATION_IN_PROGRESS:
    case BannerId.EMAIL_VERIFICATION:
    case BannerId.EXAM_UPSELL:
    case BannerId.EXPIRING_CREDIT_CARD:
    case BannerId.FORCE_CREDIT_CARD_VERIFICATION:
    case BannerId.FORCE_PHONE_VERIFICATION:
    case BannerId.FREELANCER_VERIFIED:
    case BannerId.GET_STARTED:
    case BannerId.GIVE_GET:
    case BannerId.KYC:
    case BannerId.MEMBERSHIP_UPGRADE_UPSELL:
    case BannerId.MEMBERSHIP_UPSELL:
    case BannerId.MISSING_FIRST_MILESTONE:
    case BannerId.NONE:
    case BannerId.PARTNERSHIP_PAYMENT_VERIFICATION:
    case BannerId.PENDING_INFORMATION_REQUEST:
    case BannerId.PHONE_VERIFICATION:
    case BannerId.PLUS_UPSELL:
    case BannerId.PREMIUM_UPSELL:
    case BannerId.PROJECT_MANAGEMENT:
    case BannerId.REFERRAL_BONUS:
    case BannerId.SECURE_PHONE_SETUP:
    case BannerId.TCS_VERIFICATION:
    case BannerId.VAT_VERIFICATION:
      return banner;
    case BannerId.WELCOME_BACK:
      return {
        id: banner.id,
        type: banner.type,
        reward: {
          amount: banner.reward.amount,
          currency: transformCurrencyAjax(banner.reward.currency),
        },
      };
    default:
      return assertNever(banner);
  }
}

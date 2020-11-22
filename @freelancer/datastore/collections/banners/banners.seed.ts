import { Banner, BannerId, BannerType } from './banners.model';

export function generateBannerObjects(): ReadonlyArray<Banner> {
  return [
    {
      id: BannerId.CREDIT_CARD_VERIFICATION,
      type: BannerType.VERIFICATION,
    },
    {
      id: BannerId.MISSING_FIRST_MILESTONE,
      type: BannerType.DASHBOARD,
      projectUrl: 'Graphic-Design/Project-for-STF-4932641',
      sellerDisplayName: 'STF2089FL',
      projectTitle: 'Project for STF2089FL',
    },
    {
      id: BannerId.NONE,
      type: BannerType.PROFILE_WIDGET_UPSELL,
    },
  ];
}

import { toNumber } from '@freelancer/utils';
import { MembershipSaleItemAjax } from './membership-sale.backend-model';
import { MembershipSale } from './membership-sale.model';

export function transformMembershipSaleItem(
  sale: MembershipSaleItemAjax,
  authUid: string,
): MembershipSale {
  return {
    id: toNumber(authUid),
    couponCode: sale.couponCode,
    timeStart: sale.timeStart * 1000,
    timeEnd: sale.timeEnd * 1000,
    heroImageSourceUrl: sale.heroImageSourceUrl,
    heroTitle: sale.heroTitle,
    heroSubtitle: sale.heroSubtitle,
  };
}

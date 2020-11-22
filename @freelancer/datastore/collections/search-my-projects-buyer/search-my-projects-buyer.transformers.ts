import { toNumber } from '@freelancer/utils';
import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { SearchMyProjectsBuyerEntryAjax } from './search-my-projects-buyer.backend-model';
import { SearchMyProjectsBuyerEntry } from './search-my-projects-buyer.model';

export function transformSearchMyProjects(
  item: SearchMyProjectsBuyerEntryAjax,
): SearchMyProjectsBuyerEntry {
  return {
    amountLeft: item.amount_left,
    bidAmount: toNumber(item.bid_amount),
    bidId: toNumber(item.bid_id),
    currency: transformCurrencyAjax(item.currency),
    id: toNumber(item.project.id),
    jobList: item.jobList,
    paidAmount: toNumber(item.paid_amount),
    title: item.project.name,
    type: item.type,
    user: {
      fullname: item.user.fullname ? item.user.fullname : undefined,
      id: toNumber(item.user.id),
      profileLogoUrl: item.user.profile_logo_url,
      username: item.user.username,
    },
  };
}

import { BidAwardDraftApi } from 'api-typings/projects/projects';
import { BidAwardDraft } from './bid-award-drafts.model';

export function transformBidAwardDraft(
  bidAwardDraft: BidAwardDraftApi,
): BidAwardDraft {
  return {
    id: bidAwardDraft.id,
    bidId: bidAwardDraft.bid_id,
    workLimit: bidAwardDraft.work_limit || undefined,
    billingCycle: bidAwardDraft.billing_cycle || undefined,
    skipHourlyContract: bidAwardDraft.skip_hourly_contract || undefined,
    timeCreated: bidAwardDraft.time_created * 1000,
  };
}

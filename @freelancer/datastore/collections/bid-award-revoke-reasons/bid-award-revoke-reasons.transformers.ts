import { BidAwardRevokeReasonsGetResultAjax } from './bid-award-revoke-reasons.backend-model';
import { BidAwardRevokeReason } from './bid-award-revoke-reasons.model';

export function transformBidAwardRevokeReasons(
  bidAwardRevokeReason: BidAwardRevokeReasonsGetResultAjax,
): BidAwardRevokeReason {
  return {
    id: bidAwardRevokeReason.id,
    reason: bidAwardRevokeReason.reason,
  };
}

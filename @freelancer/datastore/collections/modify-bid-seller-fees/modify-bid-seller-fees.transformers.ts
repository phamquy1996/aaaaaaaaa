import { ModifyBidSellerFeeGetResultAjaxApi } from './modify-bid-seller-fees.backend-model';
import { ModifyBidSellerFee } from './modify-bid-seller-fees.model';

export function transformModifyBidSellerFee(
  modifyBidSellerFee: ModifyBidSellerFeeGetResultAjaxApi,
): ModifyBidSellerFee {
  return {
    // Ideally sellerFee is decided by current bid amount with requested bid amount
    // Since we can't get bid amount in real time, we will just use id-requestedAmount
    // Since this is only GET, so the edge case of bidId remain same but current bid amount changes, sellerFee changes is rare
    id: `${modifyBidSellerFee.bidId}-${modifyBidSellerFee.newAmount}`,
    bidId: modifyBidSellerFee.bidId,
    sellerFee: modifyBidSellerFee.sellerFee,
    newAmount: modifyBidSellerFee.newAmount,
  };
}

import { toNumber } from '@freelancer/utils';
import { DepositPageVarsResultAjax } from './deposit-page-vars.backend-model';
import {
  DepositPageVars,
  DepositPageVarsBackUrl,
  DepositPageVarsBanner,
  DepositPageVarsGeneratedVars,
} from './deposit-page-vars.model';

export function transformDepositPageVars(
  depositPageVars: DepositPageVarsResultAjax,
): DepositPageVars {
  return {
    amount: toNumber(depositPageVars.amount),
    currency: toNumber(depositPageVars.currency),
    back: depositPageVars.back,
    orgBackUrl: depositPageVars.orgBackUrl,
    bidderId: depositPageVars.bidderId,
    contractQuantity: depositPageVars.contractQuantity,
    dataToken: depositPageVars.dataToken,
    descr: depositPageVars.descr,
    durationCycle: depositPageVars.durationCycle,
    durationType: depositPageVars.durationType,
    entryId: depositPageVars.entryId,
    hiremeInitialMilestoneTracking:
      depositPageVars.hiremeInitialMilestoneTracking,
    listingId: depositPageVars.listingId,
    membershipCoupon: depositPageVars.membershipCoupon,
    membershipRef: depositPageVars.membershipRef,
    milestoneAmount: depositPageVars.milestoneAmount,
    milestoneRequestId: depositPageVars.milestoneRequestId,
    nextAction: depositPageVars.nextAction,
    oneTimeNotify: depositPageVars.oneTimeNotify,
    packageId: depositPageVars.packageId,
    priorityRef: depositPageVars.priorityRef,
    redirected: depositPageVars.redirected,
    refAction: depositPageVars.refAction,
    returnToProject: depositPageVars.returnToProject,
    toCorporateOnboarding: depositPageVars.toCorporateOnboarding,
    toFinancialDashboard: depositPageVars.toFinancialDashboard,
    orgTrackingToken: depositPageVars.orgTrackingToken,
    uid: depositPageVars.uid,
    pid: depositPageVars.pid,
    upgradeOptions: depositPageVars.upgradeOptions,
    username: depositPageVars.username,
    verifiedPayment: depositPageVars.verifiedPayment,
    paymentItem: depositPageVars.paymentItem,
    id: depositPageVars.id,
    cartId: toNumber(depositPageVars.cartId),
    generatedVars: transformGeneratedVars(depositPageVars),
  };
}

function transformGeneratedVars(
  depositPageVars: DepositPageVarsResultAjax,
): DepositPageVarsGeneratedVars {
  return {
    trackingToken: depositPageVars.trackingToken || undefined,
    backUrl: transformUrl(depositPageVars.backUrl),
    banner: transformBanner(depositPageVars.banner),
  };
}

function transformUrl(url: {
  readonly raw: string | false;
  readonly encoded: string | false;
}): DepositPageVarsBackUrl {
  return {
    raw: url.raw || undefined,
    encoded: url.encoded || undefined,
  };
}

function transformBanner(banner: {
  readonly body: string | false;
  readonly cancelUrl: string | false;
  readonly cancelBtnText: string | false;
}): DepositPageVarsBanner {
  return {
    body: banner.body || undefined,
    cancelUrl: banner.cancelUrl || undefined,
    cancelBtnText: banner.cancelBtnText || undefined,
  };
}

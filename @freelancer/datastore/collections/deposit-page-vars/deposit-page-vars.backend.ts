import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { DepositPageVarsCollection } from './deposit-page-vars.types';

export function depositPageVarsBackend(): Backend<DepositPageVarsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'payment/depositPageVars.php',
      isGaf: true,
      params: {
        cartId: getQueryParamValue(query, 'cartId')[0],
        pid: getQueryParamValue(query, 'pid')[0],
        amount: getQueryParamValue(query, 'amount')[0],
        back: getQueryParamValue(query, 'back')[0],
        orgBackUrl: getQueryParamValue(query, 'orgBackUrl')[0],
        bidderId: getQueryParamValue(query, 'bidderId')[0],
        contractQuantity: getQueryParamValue(query, 'contractQuantity')[0],
        currency: getQueryParamValue(query, 'currency')[0],
        dataToken: getQueryParamValue(query, 'dataToken')[0],
        descr: getQueryParamValue(query, 'descr')[0],
        durationCycle: getQueryParamValue(query, 'durationCycle')[0],
        durationType: getQueryParamValue(query, 'durationType')[0],
        entryId: getQueryParamValue(query, 'entryId')[0],
        hiremeInitialMilestoneTracking: getQueryParamValue(
          query,
          'hiremeInitialMilestoneTracking',
        )[0],
        listingId: getQueryParamValue(query, 'listingId')[0],
        membershipCoupon: getQueryParamValue(query, 'membershipCoupon')[0],
        membershipRef: getQueryParamValue(query, 'membershipRef')[0],
        milestoneAmount: getQueryParamValue(query, 'milestoneAmount')[0],
        milestoneRequestId: getQueryParamValue(query, 'milestoneRequestId')[0],
        nextAction: getQueryParamValue(query, 'nextAction')[0],
        oneTimeNotify: getQueryParamValue(query, 'oneTimeNotify')[0],
        packageId: getQueryParamValue(query, 'packageId')[0],
        priorityRef: getQueryParamValue(query, 'priorityRef')[0],
        redirected: getQueryParamValue(query, 'redirected')[0],
        refAction: getQueryParamValue(query, 'refAction')[0],
        returnToProject: getQueryParamValue(query, 'returnToProject')[0],
        toCorporateOnboarding: getQueryParamValue(
          query,
          'toCorporateOnboarding',
        )[0],
        toFinancialDashboard: getQueryParamValue(
          query,
          'toFinancialDashboard',
        )[0],
        orgTrackingToken: getQueryParamValue(query, 'orgTrackingToken')[0],
        uid: getQueryParamValue(query, 'uid')[0],
        upgradeOptions: getQueryParamValue(query, 'upgradeOptions')[0],
        username: getQueryParamValue(query, 'username')[0],
        verifiedPayment: getQueryParamValue(query, 'verifiedPayment')[0],
        paymentItem: getQueryParamValue(query, 'paymentItem')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}

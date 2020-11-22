import { PartialPaymentsCartItem } from '@freelancer/payments-cart';
import { assertNever } from '@freelancer/utils';
import {
  ContextTypeApi,
  ProjectFeeTypeApi,
} from 'api-typings/payments/payments';

export enum ProjectFeeType {
  MILESTONE = 1,
  HOURLY_INITIAL_PAYMENT = 2,
}

function transformProjectFeeSubType(subType: ProjectFeeTypeApi) {
  switch (subType) {
    case ProjectFeeTypeApi.MILESTONE:
      return ProjectFeeType.MILESTONE;
    case ProjectFeeTypeApi.HOURLY_INITIAL_PAYMENT:
      return ProjectFeeType.HOURLY_INITIAL_PAYMENT;
    default:
      return assertNever(subType);
  }
}

export function transformProjectFeeToCartItem(
  draftId: number,
  currencyId: number,
  fee: number,
  subType: ProjectFeeTypeApi = ProjectFeeTypeApi.MILESTONE,
): PartialPaymentsCartItem {
  return {
    contextType: ContextTypeApi.PROJECT_FEE,
    contextId: `${draftId}`,
    description: 'Project fee',
    currencyId,
    amount: fee,
    useBonus: false,
    contextSubType: transformProjectFeeSubType(subType),
  };
}

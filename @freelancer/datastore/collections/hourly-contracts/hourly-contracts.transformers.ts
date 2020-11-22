import { UndefinedFieldsToNull } from '@freelancer/types';
import {
  HourlyContractApi,
  HourlyContractBillingCycleApi,
} from 'api-typings/payments/payments';
import { HourlyContract } from './hourly-contracts.model';

export function transformHourlyContract(
  hourlyContract: HourlyContractApi,
): HourlyContract {
  if (
    !hourlyContract.id ||
    !hourlyContract.project_id ||
    !hourlyContract.bid_id ||
    !hourlyContract.billing_cycle ||
    !hourlyContract.invoice_payment_method
  ) {
    throw new ReferenceError(`Missing a required hourly contract field.`);
  }

  if (
    hourlyContract.billing_cycle !== HourlyContractBillingCycleApi.WEEKLY &&
    hourlyContract.billing_cycle !== HourlyContractBillingCycleApi.MONTHLY
  ) {
    throw new ReferenceError(`Billing Cycle must be monthly or weekly`);
  }

  return {
    id: hourlyContract.id,
    projectId: hourlyContract.project_id,
    bidId: hourlyContract.bid_id,
    defaultHourlyRate: hourlyContract.default_hourly_rate,
    defaultWorkLimit: hourlyContract.default_work_limit,
    billingCycle: hourlyContract.billing_cycle,
    invoicePaymentMethod: hourlyContract.invoice_payment_method,
    currentHourlyRate: hourlyContract.current_hourly_rate,
    currentWorkLimit: hourlyContract.current_work_limit,
    timezone: hourlyContract.timezone,
    bidderId: hourlyContract.bidder_id,
    projectOwnerId: hourlyContract.project_owner_id,
    invalidTime: hourlyContract.invalid_time
      ? hourlyContract.invalid_time * 1000
      : undefined,
    timeTrackingStopped: hourlyContract.time_tracking_stopped
      ? hourlyContract.time_tracking_stopped * 1000
      : undefined,
    invoiceId: hourlyContract.invoice_id,
    active: !hourlyContract.invalid_time,
  };
}

export function transformWSHourlyContract(
  hourlyContract: UndefinedFieldsToNull<HourlyContractApi>,
): HourlyContract {
  if (
    !hourlyContract.id ||
    !hourlyContract.project_id ||
    !hourlyContract.bid_id ||
    !hourlyContract.billing_cycle ||
    !hourlyContract.invoice_payment_method
  ) {
    throw new ReferenceError(`Missing a required hourly contract field.`);
  }

  if (
    hourlyContract.billing_cycle !== HourlyContractBillingCycleApi.WEEKLY &&
    hourlyContract.billing_cycle !== HourlyContractBillingCycleApi.MONTHLY
  ) {
    throw new ReferenceError(`Billing Cycle must be monthly or weekly`);
  }

  return {
    id: hourlyContract.id,
    projectId: hourlyContract.project_id,
    bidId: hourlyContract.bid_id,
    defaultHourlyRate: hourlyContract.default_hourly_rate || undefined,
    defaultWorkLimit: hourlyContract.default_work_limit || undefined,
    billingCycle: hourlyContract.billing_cycle,
    invoicePaymentMethod: hourlyContract.invoice_payment_method,
    currentHourlyRate: hourlyContract.current_hourly_rate || undefined,
    currentWorkLimit: hourlyContract.current_work_limit || undefined,
    timezone: hourlyContract.timezone
      ? {
          id: hourlyContract.timezone.id || undefined,
          country: hourlyContract.timezone.country || undefined,
          timezone: hourlyContract.timezone.timezone || undefined,
          offset: hourlyContract.timezone.offset || undefined,
        }
      : undefined,
    bidderId: hourlyContract.bidder_id || undefined,
    projectOwnerId: hourlyContract.project_owner_id || undefined,
    invalidTime: hourlyContract.invalid_time
      ? hourlyContract.invalid_time * 1000
      : undefined,
    timeTrackingStopped: hourlyContract.time_tracking_stopped
      ? hourlyContract.time_tracking_stopped * 1000
      : undefined,
    invoiceId: hourlyContract.invoice_id || undefined,
    active: !hourlyContract.invalid_time,
  };
}

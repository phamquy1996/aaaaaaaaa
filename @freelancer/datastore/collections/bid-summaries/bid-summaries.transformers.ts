import { BidSummaryApi } from 'api-typings/projects/projects';
import { BidSummary } from './bid-summaries.model';

export function transformBidSummary(bidSummary: BidSummaryApi): BidSummary {
  const {
    bid_id,
    milestone_summary,
    current_hourly_cycle_summary,
  } = bidSummary;

  return {
    id: bid_id,
    milestoneSummary: {
      paidAmount: milestone_summary.paid_amount,
      pendingAmount: milestone_summary.pending_amount,
    },
    currentHourlyCycleSummary: current_hourly_cycle_summary && {
      hourlyRate: current_hourly_cycle_summary.hourly_rate,
      billingCycleStartTime:
        current_hourly_cycle_summary.billing_cycle_start_time * 1000,
      billingCycleEndTime:
        current_hourly_cycle_summary.billing_cycle_end_time * 1000,
      timeTrackingLimit:
        current_hourly_cycle_summary.time_tracking_limit * 60 * 60,
      totalTrackedTimeInCycle:
        current_hourly_cycle_summary.total_tracked_time_in_cycle,
      uninvoicedTrackedTimeInCycle:
        current_hourly_cycle_summary.uninvoiced_tracked_time_in_cycle,
    },
  };
}

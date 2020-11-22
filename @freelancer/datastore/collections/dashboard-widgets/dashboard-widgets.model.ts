export enum DashboardWidgetType {
  BIDS_REMAINING = 'bids_remaining',
  GROUPS = 'groups',
  LOCAL_JOBS = 'local_jobs',
  MY_PROFILE = 'my_profile',
  PF_SUPPORT = 'pf_support',
  POLLS = 'polls',
  ZERO_COMMISSION = 'zero_commission',
}

/**
 * A widget displayed on the dashboard (https://www.freelancer.com/dashboard).
 * Each card or panel is one widget, and each user sees different widgets.
 */
export interface DashboardWidget {
  readonly id: DashboardWidgetType;
  readonly order: number;
}

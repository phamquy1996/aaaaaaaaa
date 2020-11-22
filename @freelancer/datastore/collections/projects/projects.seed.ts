import { generateId } from '@freelancer/datastore/testing';
import {
  FrontendProjectStatusApi,
  PoolApi,
  TimeUnitApi,
} from 'api-typings/common/common';
import {
  BidAwardStatusApi,
  BidPaidStatusApi,
  MilestoneStatusApi,
  ProjectDurationApi,
  ProjectStatusApi,
  ProjectSubStatusApi,
  ProjectTypeApi,
} from 'api-typings/projects/projects';
import { Bid } from '../bids/bids.model';
import {
  CurrencyCode,
  generateCurrencyObject,
  usdCurrency,
} from '../currencies/currencies.seed';
import { Enterprise } from '../enterprise/enterprise.model';
import { generateExchangeRateObject } from '../exchange-rates/exchange-rates.seed';
import { Milestone } from '../milestones/milestones.model';
import {
  Project,
  ProjectBudget,
  ProjectCollaborations,
  ProjectHourlyProjectInfo,
  ProjectUpgrades,
} from './projects.model';

export interface GenerateProjectOptions {
  readonly ownerId: number;
  readonly projectId?: number;
  readonly projectType?: ProjectTypeApi;
  readonly currencyCode?: CurrencyCode;
  readonly status?: ProjectStatusApi;
  readonly subStatus?: ProjectSubStatusApi;
  readonly selectedBids?: ReadonlyArray<Bid>;
  readonly budget?: ProjectBudget;
  readonly local?: boolean;
  readonly hireme?: boolean;
  readonly upgrades?: ProjectUpgrades;
  readonly enterpriseIds?: ReadonlyArray<number>;
  readonly isArrowProject?: boolean;
  readonly projectCollaborations?: ReadonlyArray<ProjectCollaborations>;
  readonly activate?: boolean;
  readonly hourlyProjectInfo?: ProjectHourlyProjectInfo;
  readonly billingCode?: string;
}

/**
 * Returns a project object. By default, this is a fixed NHM project that is
 * "Active" aka "Open for Bidding".
 */
export function generateProjectObject({
  ownerId,
  projectId,
  currencyCode = CurrencyCode.USD,
  projectType = ProjectTypeApi.FIXED,
  status = ProjectStatusApi.ACTIVE,
  subStatus,
  selectedBids = [],
  budget = { minimum: 250, maximum: 750 },
  local = false,
  hireme = false,
  upgrades = {
    assisted: false,
    featured: false,
    fulltime: false,
    ipContract: false,
    listed: false,
    NDA: false,
    nonpublic: false,
    projectManagement: false,
    qualified: false,
    sealed: false,
    urgent: false,
    extend: false,
    unpaidRecruiter: false,
    pfOnly: false,
  },
  enterpriseIds,
  isArrowProject = false,
  projectCollaborations = [],
  billingCode,
}: GenerateProjectOptions): Project {
  const id = projectId !== undefined ? projectId : generateId();

  return {
    id,
    bidPeriod: 7,
    bidStats: { bidCount: 0, bidAvg: 0 },
    budget,
    currency: generateCurrencyObject(currencyCode),
    deleted: false,
    // WARNING: Do not rely on this in tests or in the app. It can be broken for projects
    // that move backwards in the project flow at any point (e.g. cancelled then reawarded),
    // and multi-award. Use ProjectStatusHelper instead.
    frontendProjectStatus: FrontendProjectStatusApi.OPEN,
    hideBids: false,
    hireme,
    language: 'en',
    local,
    ownerId,
    previewDescription: 'A long project description',
    projectCollaborations,
    seoUrl: `project-${id}`,
    status,
    subStatus,
    timeSubmitted: Date.now(),
    title: 'A demo project',
    type: projectType,
    upgrades,
    poolIds: [PoolApi.FREELANCER],
    enterpriseIds: enterpriseIds ?? (isArrowProject ? [Enterprise.ARROW] : []),
    isEscrowProject: false, // TODO: Only messaging uses this field for Cali checks
    isSellerKycRequired: false, // TODO: Cali KYC
    isBuyerKycRequired: false,
    isDeloitteProject: false,
    isTokenProject: false,
    isArrowProject,
    selectedBids: selectedBids.filter(
      // Sadly this is an implementation detail related to REST API call made by
      // the datastore, which excludes cancelled, rejected and revoked bids.
      // Therefore, in order to reflect this in all of our frontend seed data,
      // these bids will never appear as part of the project's selected bids.
      bid =>
        bid.awardStatus === BidAwardStatusApi.PENDING ||
        bid.awardStatus === BidAwardStatusApi.AWARDED,
    ),
    customFieldValues: [],
    billingCode,
  };
}

export function fixedProject(): Pick<GenerateProjectOptions, 'projectType'> {
  return {
    projectType: ProjectTypeApi.FIXED,
  };
}

/**
 *
 * Hourly project can be awarded as fixed,
 * in which case we can't rely on the projectType
 * but have to check that hourlyContract is undefined.
 */
const hourlyProject: Pick<
  GenerateProjectOptions,
  'projectType' | 'hourlyProjectInfo' | 'budget'
> = {
  projectType: ProjectTypeApi.HOURLY,
  hourlyProjectInfo: {
    commitment: {
      hours: 40,
      interval: TimeUnitApi.WEEK,
    },
    durationEnum: ProjectDurationApi.UNSPECIFIED,
  },
  budget: { minimum: 15, maximum: 25 },
};

export function fixedUsdProject(): Pick<
  GenerateProjectOptions,
  'projectType' | 'currencyCode'
> {
  return { ...fixedProject(), ...usdCurrency() };
}

export function hourlyUsdProject(): Pick<
  GenerateProjectOptions,
  'projectType' | 'hourlyProjectInfo' | 'currencyCode'
> {
  return { ...hourlyProject, ...usdCurrency() };
}

/** Returns a project that is pending approval by EQA via admin. */
export function pendingProject(): Pick<
  GenerateProjectOptions,
  'status' | 'subStatus' | 'selectedBids'
> {
  return {
    status: ProjectStatusApi.PENDING,
    subStatus: undefined,
    selectedBids: [],
  };
}

/** Returns a project that has been rejected by EQA. */
export function rejectedProject(): Pick<
  GenerateProjectOptions,
  'status' | 'subStatus' | 'selectedBids'
> {
  return {
    status: ProjectStatusApi.REJECTED,
    subStatus: undefined,
    selectedBids: [],
  };
}

/**
 * This seems to be a very specific case of ending a project. An accepted bid can
 * be cancelled (award_status of 'canceled') by ending the project as complete
 * without creating any milestones or invoices.
 *
 * Ending a project this way indicates that the project is no longer needed.
 */
export function cancelledProject(): Pick<
  GenerateProjectOptions,
  'status' | 'subStatus' | 'selectedBids'
> {
  return {
    status: ProjectStatusApi.CLOSED,
    // Don't ask: https://phabricator.tools.flnltd.com/w/team/hiring_experience/feature_specifications/project_states/cancel_seller/
    subStatus: ProjectSubStatusApi.CANCEL_SELLER,
    // If a previously accepted bid is marked as complete with no milestones,
    // it's removed from the selected bids of the project (because it's awardStatus
    // becomes `canceled`). The complete bid can be awarded again, along with
    // other bids on the project, but the project remains closed to further bidding.
    selectedBids: [],
  };
}

/**
 * This refers to the specific case of closing a project **for bidding**, which
 * is only allowed when the project is open for bidding, i.e. is unawarded.
 */
export function closedProject(): Pick<
  GenerateProjectOptions,
  'status' | 'subStatus' | 'selectedBids'
> {
  return {
    status: ProjectStatusApi.FROZEN,
    subStatus: ProjectSubStatusApi.FROZEN_TIMEOUT,
    // Existing bids can still be awarded, after which the project resumes its
    // normal project flow
    selectedBids: [],
  };
}

/**
 * Returns a project that has awarded bids. The bids passed in can be accepted,
 * revoked, or rejected.
 */
export function awardedProject({
  selectedBids = [],
}: {
  readonly selectedBids: ReadonlyArray<Bid> | undefined;
}): Pick<GenerateProjectOptions, 'status' | 'subStatus' | 'selectedBids'> {
  const hasAcceptedBids = selectedBids.some(
    bid => bid.awardStatus === BidAwardStatusApi.AWARDED,
  );
  return {
    status: hasAcceptedBids ? ProjectStatusApi.CLOSED : ProjectStatusApi.FROZEN,
    subStatus: hasAcceptedBids
      ? ProjectSubStatusApi.CLOSED_AWARDED
      : ProjectSubStatusApi.FROZEN_AWARDED,
    selectedBids,
  };
}

/**
 * Returns a project that is incomplete by ending the accepted bid as incomplete.
 * There's no difference in project and bid statuses between partial payment and
 * no payment.
 *
 * A bid can only be marked as incomplete if it has not been fully paid, since
 * a bid is automatically complete if released milestone value >= bid amount.
 */
// TODO: What happens for multi-award?
export function incompleteProject({
  selectedBids = [],
}: {
  readonly selectedBids: ReadonlyArray<Bid> | undefined;
}): Pick<GenerateProjectOptions, 'status' | 'subStatus' | 'selectedBids'> {
  if (
    selectedBids.some(bid => bid.paidStatus === BidPaidStatusApi.FULLY_PAID)
  ) {
    throw new Error(
      'An incomplete project cannot have fully paid bids. You might be looking for `completeProject` instead.',
    );
  }

  return {
    status: ProjectStatusApi.CLOSED,
    subStatus: ProjectSubStatusApi.CANCEL_SELLER,
    selectedBids,
  };
}

/**
 * Returns a project with a complete bid. This is done by releasing milestones
 * with value >= bid amount (fully paid), or < bid amount (partly paid).
 *
 * NOTE: Confusingly, when a project is "ended" it is actually the bid that is
 * ended. This is important when a project has multiple awarded (selected) bids.
 * If one bid is marked as complete but another has been accepted, the project
 * status on the PVP is still `In-Progress` (see ProjectStatusHelper).
 */
export function completeProject({
  selectedBids = [],
  milestones = [],
}: {
  readonly selectedBids: ReadonlyArray<Bid> | undefined;
  readonly milestones?: ReadonlyArray<Milestone>;
}): Pick<GenerateProjectOptions, 'status' | 'subStatus' | 'selectedBids'> {
  const hasFullyPaidBid = selectedBids.some(bid => {
    const totalReleasedMilestones = milestones
      .filter(milestone => milestone.bidId === bid.id)
      .filter(milestone => milestone.status === MilestoneStatusApi.CLEARED)
      .reduce((acc, milestone) => acc + (milestone.amount || 0), 0);

    return totalReleasedMilestones >= bid.amount;
  });

  return {
    status: ProjectStatusApi.CLOSED,
    subStatus: hasFullyPaidBid
      ? ProjectSubStatusApi.CLOSED_AWARDED
      : ProjectSubStatusApi.CANCEL_SELLER,
    selectedBids,
  };
}

/**
 * A premium project is one whose average budget is >= 1500 USD, or has a bid
 * with amount >= $1500 USD.
 */
export function premiumProject({
  currencyCode = CurrencyCode.USD,
}: {
  readonly currencyCode?: CurrencyCode;
} = {}): Pick<GenerateProjectOptions, 'budget'> {
  const minimum = 1000;
  const maximum = 2000;
  const usdExchangeRate = generateExchangeRateObject(currencyCode).from[
    CurrencyCode.USD
  ];

  return {
    budget: {
      minimum: Math.ceil(minimum * usdExchangeRate),
      maximum: Math.ceil(maximum * usdExchangeRate),
    },
  };
}

/**
 * A premium verified project is one which has minimum budget >= $3000 USD and requires
 * bidders to be Freelancer Verified.
 */
export function premiumVerifiedProject({
  currencyCode = CurrencyCode.USD,
}: {
  readonly currencyCode?: CurrencyCode;
} = {}): Pick<GenerateProjectOptions, 'budget'> {
  const minimum = 3000;
  const maximum = 5000;
  const usdExchangeRate = generateExchangeRateObject(currencyCode).from[
    CurrencyCode.USD
  ];

  return {
    budget: {
      minimum: Math.ceil(minimum * usdExchangeRate),
      maximum: Math.ceil(maximum * usdExchangeRate),
    },
  };
}

/**
 * A non-premium project (avg. project budget < $1500 USD) that still allows premium bid amounts (>= $1500 USD).
 */
export function largeBudgetNonPremiumProject({
  currencyCode = CurrencyCode.USD,
}: {
  readonly currencyCode?: CurrencyCode;
} = {}): Pick<GenerateProjectOptions, 'budget'> {
  const minimum = 100;
  const maximum = 2000;
  const usdExchangeRate = generateExchangeRateObject(currencyCode).from[
    CurrencyCode.USD
  ];

  return {
    budget: {
      minimum: Math.ceil(minimum * usdExchangeRate),
      maximum: Math.ceil(maximum * usdExchangeRate),
    },
  };
}

/**
 * The featured upgrade adds additional requirements to bidding.
 */
export function featuredUpgrade(): Pick<GenerateProjectOptions, 'upgrades'> {
  return {
    upgrades: {
      assisted: false,
      featured: true,
      fulltime: false,
      ipContract: false,
      listed: false,
      NDA: false,
      nonpublic: false,
      projectManagement: false,
      qualified: false,
      sealed: false,
      urgent: false,
      extend: false,
      unpaidRecruiter: false,
      pfOnly: false,
    },
  };
}

export function arrowProject(): Pick<GenerateProjectOptions, 'isArrowProject'> {
  return { isArrowProject: true };
}

export function facebookProject(): Pick<
  GenerateProjectOptions,
  'enterpriseIds'
> {
  return {
    enterpriseIds: [Enterprise.FACEBOOK],
  };
}

import {
  BudgetApi,
  HourlyProjectInfoApi,
  ProjectApi,
  ProjectBidStatsApi,
  ProjectCollaborationApi,
  ProjectsGetResultApi,
  ProjectTimeframeApi,
  ProjectUpgradesApi,
} from 'api-typings/projects/projects';
import { transformBid } from '../bids/bids.transformers';
import { transformCurrency } from '../currencies/currencies.transformers';
import { transformCustomFieldValues } from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import { transformDeloitteProjectDetails } from '../deloitte/deloitte.transformers';
import {
  Enterprise,
  Pool,
  POOL_ID_TO_POOL_API_MAP,
} from '../enterprise/enterprise.model';
import {
  Project,
  ProjectBidStats,
  ProjectBudget,
  ProjectCollaborations,
  ProjectHourlyProjectInfo,
  ProjectTimeframe,
  ProjectUpgrades,
} from './projects.model';

export function transformProject(
  project: ProjectApi,
  selectedBidsList?: ProjectsGetResultApi['selected_bids'],
): Project {
  if (
    !project.bid_stats ||
    !project.budget ||
    !project.currency ||
    !project.seo_url ||
    !project.time_submitted ||
    !project.type
  ) {
    throw new ReferenceError(`Missing a required project field.`);
  }
  const selectedBids = selectedBidsList ? selectedBidsList[project.id] : [];
  return {
    id: project.id,
    bidPeriod: project.bidperiod, // bidperiod is an integer amount of days, should not be transformed
    bidStats: transformBidStats(project.bid_stats),
    budget: transformProjectBudget(project.budget),
    currency: transformCurrency(project.currency),
    billingCode: project.billing_code,
    deleted: project.deleted,
    frontendProjectStatus: project.frontend_project_status,
    hideBids: project.hidebids,
    hireme: project.hireme || false,
    hourlyProjectInfo: project.hourly_project_info
      ? transformProjectHourlyProjectInfo(project.hourly_project_info)
      : undefined,
    language: project.language || 'en',
    local: project.local || false,
    ownerId: project.owner_id,
    previewDescription: project.preview_description || '',
    projectCollaborations: (project.project_collaborations || []).map(
      transformProjectCollaborations,
    ),
    seoUrl: project.seo_url,
    status: project.status,
    subStatus: project.sub_status,
    timeSubmitted: project.time_submitted * 1000, // Turn seconds to ms
    title: project.title,
    type: project.type,
    upgrades: project.upgrades
      ? transformProjectUpgrades(project.upgrades)
      : emptyProjectUpgrades(),
    // Handle the case where pool IDs are an integer, but also the case where
    // they are strings, to maintain forwards and backwards compatibility.
    // TODO: Cleanup T221545
    poolIds: (project.pool_ids || []).map(id =>
      typeof id === 'string' ? id : POOL_ID_TO_POOL_API_MAP[id as Pool],
    ),
    enterpriseIds: project.enterprise_ids,
    // TODO: T213935 - This is deprecated and will be removed.
    deloitteDetails: project.deloitte_details
      ? transformDeloitteProjectDetails(project.deloitte_details)
      : undefined,
    timeframe: project.timeframe
      ? transformTimeframe(project.timeframe)
      : undefined,
    isEscrowProject: project.is_escrow_project,
    isSellerKycRequired: project.is_seller_kyc_required,
    isBuyerKycRequired: project.is_buyer_kyc_required,
    isDeloitteProject: project.enterprise_ids
      ? project.enterprise_ids.includes(Enterprise.DELOITTE_DC)
      : false,
    isTokenProject: project.currency.code === 'TKN',
    isArrowProject: project.enterprise_ids
      ? project.enterprise_ids.includes(Enterprise.ARROW)
      : false,
    selectedBids: selectedBids ? selectedBids.map(transformBid) : [],
    files: project.files,
    customFieldValues: project.enterprise_metadata_values
      ? project.enterprise_metadata_values.map(value =>
          transformCustomFieldValues(value),
        )
      : [],
    jobs: project.jobs,
  };
}

export function transformTimeframe(
  timeframe: ProjectTimeframeApi,
): ProjectTimeframe {
  return {
    startDate: timeframe.start_date ? timeframe.start_date * 1000 : undefined,
    endDate: timeframe.end_date ? timeframe.end_date * 1000 : undefined,
  };
}

export function transformBidStats(
  bidStats: ProjectBidStatsApi,
): ProjectBidStats {
  return {
    bidCount: bidStats.bid_count || 0,
    bidAvg: Math.ceil(bidStats.bid_avg || 0),
  };
}

export function transformProjectBudget(budget: BudgetApi): ProjectBudget {
  return {
    minimum: budget.minimum,
    maximum: budget.maximum,
    name: budget.name,
    projectType: budget.project_type,
    currencyId: budget.currency_id,
  };
}

export function transformProjectHourlyProjectInfo(
  info: HourlyProjectInfoApi,
): ProjectHourlyProjectInfo {
  return {
    commitment: info.commitment,
    durationEnum: info.duration_enum,
  };
}

function transformProjectCollaborations(
  collaboration: ProjectCollaborationApi,
): ProjectCollaborations {
  if (!collaboration.id) {
    throw new ReferenceError(`Missing project collaboration id.`);
  }

  return {
    context: collaboration.context,
    contextOwnerId: collaboration.context_owner_id,
    id: collaboration.id,
    permissions: collaboration.permissions || [],
    status: collaboration.status,
    timeCreated: (collaboration.time_created || 0) * 1000, // Turn seconds to ms
    userId: collaboration.user_id,
  };
}

export function transformProjectUpgrades(
  upgrades: ProjectUpgradesApi,
): ProjectUpgrades {
  return {
    assisted: upgrades.assisted || false,
    featured: upgrades.featured || false,
    fulltime: upgrades.fulltime || false,
    ipContract: upgrades.ip_contract || false,
    listed: upgrades.listed || false,
    NDA: upgrades.NDA || false,
    nonpublic: upgrades.nonpublic || false,
    projectManagement: upgrades.project_management || false,
    qualified: upgrades.qualified || false,
    sealed: upgrades.sealed || false,
    urgent: upgrades.urgent || false,
    extend: upgrades.extend || false,
    pfOnly: upgrades.pf_only || false,
  };
}

export function emptyProjectUpgrades(): ProjectUpgrades {
  return {
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
    pfOnly: false,
  };
}

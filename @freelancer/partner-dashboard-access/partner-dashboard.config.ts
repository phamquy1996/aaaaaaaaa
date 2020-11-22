import {
  EnterpriseApi,
  EntityTypeApi,
  PoolApi,
} from 'api-typings/common/common';
import { GrantedPermissionApi } from 'api-typings/grants/grants';

export enum Partner {
  ARROW = 'arrow',
  DELOITTE = 'deloitte',
  FACEBOOK = 'facebook',
  IBM = 'ibm',
}

export enum PartnerDashboardFeature {
  MARKETPLACE_STATS = 'marketplaceStats',
  PROJECT_DETAILS = 'projectDetails',
  PROJECT_TRACKER = 'projectTracker',
  CONCIERGE_QUEUE = 'conciergeQueue',
}

export declare type EntityGrantedPermissionsMap = {
  [k in EntityTypeApi]?: ReadonlyArray<GrantedPermissionApi>;
};

export const PARTNER_DASHBOARD_FEATURE_PERMISSIONS_MAP: {
  readonly [k in PartnerDashboardFeature]: EntityGrantedPermissionsMap;
} = {
  [PartnerDashboardFeature.MARKETPLACE_STATS]: {
    [EntityTypeApi.ENTERPRISE]: [GrantedPermissionApi.VIEW_MARKETPLACE_STATS],
  },
  [PartnerDashboardFeature.PROJECT_DETAILS]: {
    [EntityTypeApi.ENTERPRISE]: [
      GrantedPermissionApi.VIEW_PROJECT_MILESTONES,
      GrantedPermissionApi.VIEW_PROJECT_THREADS,
      GrantedPermissionApi.VIEW_PROJECT_NDA_DETAILS,
      GrantedPermissionApi.VIEW_PRIVATE_BIDS,
      GrantedPermissionApi.VIEW_SUPPORT_SESSIONS,
    ],
    [EntityTypeApi.POOL]: [GrantedPermissionApi.VIEW_ALL_PROJECTS],
  },
  [PartnerDashboardFeature.PROJECT_TRACKER]: {
    [EntityTypeApi.ENTERPRISE]: [
      GrantedPermissionApi.VIEW_PROJECT_MILESTONES,
      GrantedPermissionApi.VIEW_PROJECT_THREADS,
      GrantedPermissionApi.VIEW_PROJECT_NDA_DETAILS,
      GrantedPermissionApi.VIEW_PRIVATE_BIDS,
      GrantedPermissionApi.VIEW_SUPPORT_SESSIONS,
    ],
    [EntityTypeApi.POOL]: [GrantedPermissionApi.VIEW_ALL_PROJECTS],
  },
  [PartnerDashboardFeature.CONCIERGE_QUEUE]: {
    [EntityTypeApi.ENTERPRISE]: [
      GrantedPermissionApi.VIEW_PRIVATE_BIDS,
      GrantedPermissionApi.VIEW_PROJECT_NDA_DETAILS,
      GrantedPermissionApi.CREATE_PROJECT_COLLABORATION,
    ],
  },
};

export const PARTNER_STRING_TO_PARTNER_MAP: {
  readonly [k in string]: Partner;
} = {
  deloitte: Partner.DELOITTE,
  arrow: Partner.ARROW,
  facebook: Partner.FACEBOOK,
  ibm: Partner.IBM,
};

export const PARTNER_TO_POOL_API_MAP: {
  readonly [k in Partner]: PoolApi;
} = {
  [Partner.ARROW]: PoolApi.ARROW_PRIVATE,
  [Partner.DELOITTE]: PoolApi.DELOITTE_DC,
  [Partner.FACEBOOK]: PoolApi.FACEBOOK,
  [Partner.IBM]: PoolApi.IBM,
};

// Mapping between partner name and its enterprise id
// There is no mapping enum yet, so create it here
export const PARTNER_TO_ENTERPRISE_ID_MAP: {
  [k in Partner]: number;
} = {
  [Partner.DELOITTE]: 1,
  [Partner.ARROW]: 2,
  [Partner.FACEBOOK]: 3,
  [Partner.IBM]: 18,
};

// Mapping between partner name and its pool id
// There is no mapping enum yet, so create it here
export const PARTNER_TO_POOL_ID_MAP: {
  readonly [k in Partner]: number;
} = {
  [Partner.DELOITTE]: 2,
  [Partner.ARROW]: 3,
  [Partner.FACEBOOK]: 4,
  [Partner.IBM]: 9,
};

// Mapping between partner name and its
// EnterpriseApi
export const PARTNER_TO_ENTERPRISE_API_MAP: {
  readonly [k in string]: EnterpriseApi;
} = {
  [Partner.DELOITTE]: EnterpriseApi.DELOITTE_DC,
  [Partner.ARROW]: EnterpriseApi.ARROW,
  [Partner.FACEBOOK]: EnterpriseApi.FACEBOOK,
};

export const PARTNER_TO_FEATURE_MAP: {
  readonly [k in string]: ReadonlyArray<PartnerDashboardFeature>;
} = {
  [Partner.DELOITTE]: [
    PartnerDashboardFeature.PROJECT_TRACKER,
    PartnerDashboardFeature.PROJECT_DETAILS,
  ],
  [Partner.ARROW]: [
    PartnerDashboardFeature.MARKETPLACE_STATS,
    PartnerDashboardFeature.PROJECT_TRACKER,
    PartnerDashboardFeature.PROJECT_DETAILS,
    PartnerDashboardFeature.CONCIERGE_QUEUE,
  ],
  [Partner.FACEBOOK]: [
    PartnerDashboardFeature.PROJECT_TRACKER,
    PartnerDashboardFeature.PROJECT_DETAILS,
  ],
  [Partner.IBM]: [PartnerDashboardFeature.PROJECT_TRACKER],
};

export const PARTNER_USD_TOGGLE_MAP: {
  readonly [k in Partner]: boolean;
} = {
  [Partner.ARROW]: true,
  [Partner.DELOITTE]: false,
  [Partner.FACEBOOK]: true,
  [Partner.IBM]: true,
};

/**
 * If it's undefined, use their actual logo.
 * If there is a string, use the specified name instead.
 */
export const PARTNER_LOGO_NAME_MAP: {
  readonly [k in Partner]: string | undefined;
} = {
  [Partner.ARROW]: undefined,
  [Partner.DELOITTE]: undefined,
  [Partner.FACEBOOK]: undefined,
  [Partner.IBM]: 'IBM',
};

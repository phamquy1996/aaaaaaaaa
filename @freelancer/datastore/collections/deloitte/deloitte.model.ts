import { SelectGroups, SelectItem } from '@freelancer/ui/select';
import {
  DeloitteBusinessLineApi,
  DeloitteGigWorkerLevelApi,
  DeloitteIndustryApi,
  DeloitteIndustryGroupApi,
  DeloitteOfferingApi,
  DeloitteOfferingPortfolioApi,
  DeloittePracticeApi,
  DeloitteProjectTypeApi,
  DeloitteUtilizationApi,
} from 'api-typings/projects/deloitte';

/**
 * Deloitte project details found in a Deloitte project
 */
export interface DeloitteProjectDetails {
  readonly billingCode: string;
  readonly industryOffering: DeloitteIndustryOffering;
  readonly clearance?: string;
  readonly itar?: boolean;
}

export interface DeloitteProjectDetailsGet {
  readonly billingCode: string;
  readonly industryOffering: DeloitteIndustryOffering;
  readonly clearance?: string;
  readonly itar?: string;
}

export interface DeloitteIndustryOffering {
  readonly projectType: DeloitteProjectTypeApi;
  readonly practice: DeloittePracticeApi;
  readonly industry: DeloitteIndustryApi;
  readonly offering: DeloitteOfferingApi;
}

// @see {@link https://phabricator.tools.flnltd.com/D125102|Deloitte billing code regex}
export const deloitteBillingCodeMatcher: RegExp = /([A-Z]{3}[\d]{5})-?([A-Z\d]{2})-?([A-Z\d]{2})-?([A-Z\d]{2})-?([\d]{4})/;
export const deloitteBillingCodePattern: RegExp = /^[A-Z]{3}[\d]{5}-?[A-Z\d]{2}-?[A-Z\d]{2}-?[A-Z\d]{2}-?[\d]{4}$/i;

export const DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteProjectTypeApi]: string;
} = {
  [DeloitteProjectTypeApi.CLIENT_BILLABLE]: 'Client Billable',
  [DeloitteProjectTypeApi.FIRM_INITIATIVE]: 'Firm Initiative',
  [DeloitteProjectTypeApi.PRD]: 'PRD',
  [DeloitteProjectTypeApi.OTHER_INVESTMENT]: 'Other Investments',
  [DeloitteProjectTypeApi.SKILLS_BASED_VOLUNTEERING]:
    'Skills-Based Volunteering',
  [DeloitteProjectTypeApi.INTERNAL_SERVICES]:
    'Internal Services (Internal Practitioners Only)',
};

export const DELOITTE_UTILIZATION_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteUtilizationApi]: string;
} = {
  [DeloitteUtilizationApi.UTILIZATION]: 'Utilization',
  [DeloitteUtilizationApi.ADJUSTED_UTILIZATION]: 'Adjusted Utilization',
  [DeloitteUtilizationApi.NO_UTILIZATION]: 'No Utilization',
};

export const DELOITTE_WORKER_LEVEL_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteGigWorkerLevelApi]: string;
} = {
  [DeloitteGigWorkerLevelApi.ANALYST]: 'Analyst',
  [DeloitteGigWorkerLevelApi.CONSULTANT]: 'Consultant',
  [DeloitteGigWorkerLevelApi.SENIOR_CONSULTANT]: 'Senior Consultant',
  [DeloitteGigWorkerLevelApi.MANAGER]: 'Manager',
  [DeloitteGigWorkerLevelApi.SENIOR_MANAGER]: 'Senior Manager',
  [DeloitteGigWorkerLevelApi.PPMD]: 'PPMD',
};

export const DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteBusinessLineApi]: string;
} = {
  [DeloitteBusinessLineApi.AUDIT_AND_ASSURANCE]: 'Audit & Assurance',
  [DeloitteBusinessLineApi.CONSULTING]: 'Consulting',
  [DeloitteBusinessLineApi.INTERNAL_SERVICES]: 'Internal Services',
  [DeloitteBusinessLineApi.RISK_AND_FINANCIAL_ADVISORY]:
    'Risk & Financial Advisory',
  [DeloitteBusinessLineApi.TAX]: 'Tax',
};

export const DELOITTE_PRACTICE_DISPLAY_NAME_MAP: {
  readonly [k in DeloittePracticeApi]: string;
} = {
  [DeloittePracticeApi.COMMERCIAL_CORE]: 'Commercial Core',
  [DeloittePracticeApi.COMMERCIAL_USDC_ONSITE]: 'Commercial PDM',
  [DeloittePracticeApi.COMMERCIAL_USDC_INCENTER]: 'Commercial USDC',
  [DeloittePracticeApi.GPS_CORE]: 'GPS Core',
  [DeloittePracticeApi.GPS_USDC_ONSITE]: 'GPS PDM',
  [DeloittePracticeApi.GPS_USDC_INCENTER]: 'GPS USDC',
  [DeloittePracticeApi.USI_ONSITE]: 'USI Onsite',
  [DeloittePracticeApi.USI_OFFSHORE]: 'USI Offshore',
  [DeloittePracticeApi.GPS_OPERATIONAL_EXCELLENCE]:
    'GPS Operational Excellence (OpX)',
};

export const DELOITTE_INDUSTRY_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteIndustryApi]: string;
} = {
  [DeloitteIndustryApi.AUTOMOTIVE]: 'Automotive',
  [DeloitteIndustryApi.AUTOMOTIVE_TRANSPORTATION_HOSPITALITY_AND_SERVICES]:
    'Automotive, Transportation, Hospitality & Services',
  [DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS]:
    'Banking & Capital Markets',
  [DeloitteIndustryApi.CIVIL_GOVERNMENT]: 'Civil Government',
  [DeloitteIndustryApi.CONSUMER_PRODUCTS]: 'Consumer Products',
  [DeloitteIndustryApi.CROSS_SECTOR_C]: 'Cross Consumer',
  [DeloitteIndustryApi.CROSS_SECTOR_CI]: 'Cross CI',
  [DeloitteIndustryApi.CROSS_SECTOR_ERI]: 'Cross ER&I',
  [DeloitteIndustryApi.CROSS_SECTOR_FS]: 'Cross FS',
  [DeloitteIndustryApi.CROSS_SECTOR_GPS]: 'Cross GPS',
  [DeloitteIndustryApi.CROSS_SECTOR_LSHC]: 'Cross LS&HC',
  [DeloitteIndustryApi.CROSS_SECTOR_TMT]: 'Cross TMT',
  [DeloitteIndustryApi.DEFENSE_SECURITY_AND_JUSTICE]:
    'Defense Security & Justice',
  [DeloitteIndustryApi.FEDERAL_HEALTH]: 'Federal Health',
  [DeloitteIndustryApi.HEALTH_CARE]: 'Health Care',
  [DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION]:
    'Industrial Products & Construction',
  [DeloitteIndustryApi.INSURANCE]: 'Insurance',
  [DeloitteIndustryApi.INVESTMENT_MANAGEMENT]: 'Investment Management',
  [DeloitteIndustryApi.INVESTMENT_MANAGEMENT_AND_REAL_ESTATE]:
    'Investment Management & Real Estate',
  [DeloitteIndustryApi.LIFE_SCIENCES]: 'Life Sciences',
  [DeloitteIndustryApi.MEDIA_AND_ENTERTAINMENT]: 'Media & Entertainment',
  [DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS]: 'Oil, Gas & Chemicals',
  [DeloitteIndustryApi.POWER_AND_UTILITIES]: 'Power & Utilities',
  [DeloitteIndustryApi.REAL_ESTATE]: 'Real Estate',
  [DeloitteIndustryApi.RETAIL_AND_CONSUMER_PRODUCTS]:
    'Retail & Consumer Products',
  [DeloitteIndustryApi.RETAIL_WHOLESALE_AND_DISTRIBUTION]:
    'Retail, Wholesale, & Distribution',
  [DeloitteIndustryApi.STATE_LOCAL_AND_HIGHER_EDUCATION]:
    'State, Local, & Higher Education',
  [DeloitteIndustryApi.TECHNOLOGY]: 'Technology',
  [DeloitteIndustryApi.TRANSPORTATION_HOSPITALITY_AND_SERVICES]:
    'Transportation, Hospitality, & Services',
  [DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT]:
    'Telecom, Media, & Entertainment',
};

export const DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteIndustryGroupApi]: string;
} = {
  [DeloitteIndustryGroupApi.CONSUMER]: 'Consumer',
  [DeloitteIndustryGroupApi.ENERGY_RESOURCES_AND_INDUSTRIALS]:
    'Energy, Resources & Industrials',
  [DeloitteIndustryGroupApi.FINANCIAL_SERVICES]: 'Financial Services',
  [DeloitteIndustryGroupApi.GOVERNMENT_AND_PUBLIC_SECTOR]:
    'Government & Public Sector',
  [DeloitteIndustryGroupApi.LIFE_SCIENCES_AND_HEALTH_CARE]:
    'Life Sciences & Health Care',
  [DeloitteIndustryGroupApi.TECHNOLOGY_MEDIA_AND_TELECOM]:
    'Technology, Media & Telecom',
};

export const DELOITTE_INDUSTRY_FULL_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteIndustryApi]: string;
} = {
  [DeloitteIndustryApi.AUTOMOTIVE_TRANSPORTATION_HOSPITALITY_AND_SERVICES]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[DeloitteIndustryGroupApi.CONSUMER]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.AUTOMOTIVE_TRANSPORTATION_HOSPITALITY_AND_SERVICES
    ]
  }`,
  [DeloitteIndustryApi.CROSS_SECTOR_C]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[DeloitteIndustryGroupApi.CONSUMER]
  }, ${DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_C]}`,
  [DeloitteIndustryApi.RETAIL_AND_CONSUMER_PRODUCTS]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[DeloitteIndustryGroupApi.CONSUMER]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.RETAIL_AND_CONSUMER_PRODUCTS
    ]
  }`,
  [DeloitteIndustryApi.CROSS_SECTOR_TMT]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.TECHNOLOGY_MEDIA_AND_TELECOM
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_TMT]
  }`,
  [DeloitteIndustryApi.TECHNOLOGY]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.TECHNOLOGY_MEDIA_AND_TELECOM
    ]
  }, ${DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.TECHNOLOGY]}`,
  [DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.TECHNOLOGY_MEDIA_AND_TELECOM
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT
    ]
  }`,
  [DeloitteIndustryApi.CROSS_SECTOR_ERI]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.ENERGY_RESOURCES_AND_INDUSTRIALS
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_ERI]
  }`,
  [DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.ENERGY_RESOURCES_AND_INDUSTRIALS
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION
    ]
  }`,
  [DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.ENERGY_RESOURCES_AND_INDUSTRIALS
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS
    ]
  }`,
  [DeloitteIndustryApi.POWER_AND_UTILITIES]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.ENERGY_RESOURCES_AND_INDUSTRIALS
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.POWER_AND_UTILITIES]
  }`,
  [DeloitteIndustryApi.CROSS_SECTOR_FS]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.FINANCIAL_SERVICES
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_FS]
  }`,
  [DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.FINANCIAL_SERVICES
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS
    ]
  }`,
  [DeloitteIndustryApi.INSURANCE]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.FINANCIAL_SERVICES
    ]
  }, ${DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.INSURANCE]}`,
  [DeloitteIndustryApi.INVESTMENT_MANAGEMENT_AND_REAL_ESTATE]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.FINANCIAL_SERVICES
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.INVESTMENT_MANAGEMENT_AND_REAL_ESTATE
    ]
  }`,
  [DeloitteIndustryApi.CROSS_SECTOR_GPS]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.GOVERNMENT_AND_PUBLIC_SECTOR
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_GPS]
  }`,
  [DeloitteIndustryApi.CROSS_SECTOR_LSHC]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.LIFE_SCIENCES_AND_HEALTH_CARE
    ]
  }, ${
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_LSHC]
  }`,
  [DeloitteIndustryApi.HEALTH_CARE]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.LIFE_SCIENCES_AND_HEALTH_CARE
    ]
  }, ${DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.HEALTH_CARE]}`,
  [DeloitteIndustryApi.LIFE_SCIENCES]: `${
    DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
      DeloitteIndustryGroupApi.LIFE_SCIENCES_AND_HEALTH_CARE
    ]
  }, ${DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.LIFE_SCIENCES]}`,
  // Backwards compatibility for removed industry sectors
  [DeloitteIndustryApi.AUTOMOTIVE]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.AUTOMOTIVE],
  [DeloitteIndustryApi.CIVIL_GOVERNMENT]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CIVIL_GOVERNMENT],
  [DeloitteIndustryApi.CONSUMER_PRODUCTS]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CONSUMER_PRODUCTS],
  [DeloitteIndustryApi.CROSS_SECTOR_CI]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_CI],
  [DeloitteIndustryApi.DEFENSE_SECURITY_AND_JUSTICE]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.DEFENSE_SECURITY_AND_JUSTICE
    ],
  [DeloitteIndustryApi.FEDERAL_HEALTH]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.FEDERAL_HEALTH],
  [DeloitteIndustryApi.INVESTMENT_MANAGEMENT]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.INVESTMENT_MANAGEMENT
    ],
  [DeloitteIndustryApi.MEDIA_AND_ENTERTAINMENT]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.MEDIA_AND_ENTERTAINMENT
    ],
  [DeloitteIndustryApi.REAL_ESTATE]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.REAL_ESTATE],
  [DeloitteIndustryApi.RETAIL_WHOLESALE_AND_DISTRIBUTION]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.RETAIL_WHOLESALE_AND_DISTRIBUTION
    ],
  [DeloitteIndustryApi.STATE_LOCAL_AND_HIGHER_EDUCATION]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.STATE_LOCAL_AND_HIGHER_EDUCATION
    ],
  [DeloitteIndustryApi.TRANSPORTATION_HOSPITALITY_AND_SERVICES]:
    DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
      DeloitteIndustryApi.TRANSPORTATION_HOSPITALITY_AND_SERVICES
    ],
};

export const DELOITTE_OFFERING_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteOfferingApi]: string;
} = {
  [DeloitteOfferingApi.CBO_CROSS_CONSULTING_GROUP]: 'Cross Consulting Group',
  [DeloitteOfferingApi.CBO_OPERATIONS_TRANSFORMATION]:
    'Operations Transformation',
  [DeloitteOfferingApi.CBO_SYSTEMS_ENGINEERING]: 'Systems Engineering',
  [DeloitteOfferingApi.CBO_CLOUD_ENGINEERING]: 'Cloud Engineering',
  [DeloitteOfferingApi.CBO_CORE_INDUSTRY_SOLUTIONS]: 'Core Industry Solutions',
  [DeloitteOfferingApi.CBO_HEALTH_TECHNOLOGY]: 'Health Technology',
  [DeloitteOfferingApi.CBO_OTHER]: 'Other',
  [DeloitteOfferingApi.CNM_CUSTOMER_STRATEGY_AND_APPLIED_DESIGN]:
    'Customer Strategy & Applied Design',
  [DeloitteOfferingApi.CNM_ADVERTISING_MARKETING_AND_COMMERCE]:
    'Advertising, Marketing, & Commerce',
  [DeloitteOfferingApi.CNM_DIGITAL_CUSTOMER]: 'Digital Customer',
  [DeloitteOfferingApi.CNM_HUMAN_SERVICES_TRANSFORMATION]:
    'Human Services Transformation',
  [DeloitteOfferingApi.CNM_CROSS_CONSULTING_GROUP]: 'Cross Consulting Group',
  [DeloitteOfferingApi.CNM_ASSET_GROUP]: 'Asset Group',
  [DeloitteOfferingApi.CNM_OTHER]: 'Other',
  [DeloitteOfferingApi.EO_CROSS_CONSULTING_GROUP]: 'Cross Consulting Group',
  [DeloitteOfferingApi.EO_FINANCE_AND_ENTERPRISE_PERFORMANCE]:
    'Finance & Enterprise Performance',
  [DeloitteOfferingApi.EO_SUPPLY_CHAIN_AND_NETWORK_OPERATIONS]:
    'Supply Chain & Network Operations',
  [DeloitteOfferingApi.EO_TECHNOLOGY_SERVICES_OPTIMIZATION]:
    'Technology Services Optimization',
  [DeloitteOfferingApi.EO_SAP]: 'SAP',
  [DeloitteOfferingApi.EO_ORACLE]: 'Oracle',
  [DeloitteOfferingApi.EO_ERP_SAAS]: 'Emerging ERP Solutions',
  [DeloitteOfferingApi.EO_ASSET_GROUP]: 'Asset Group',
  [DeloitteOfferingApi.EO_OTHER]: 'Other',
  [DeloitteOfferingApi.HC_CROSS_CONSULTING_GROUP]: 'Cross Consulting Group',
  [DeloitteOfferingApi.HC_HR_TRANSFORMATION]: 'HR Transformation',
  [DeloitteOfferingApi.HC_ORGANIZATION_TRANSFORMATION]:
    'Organization Transformation',
  [DeloitteOfferingApi.HC_WORKFORCE_TRANSFORMATION]: 'Workforce Transformation',
  [DeloitteOfferingApi.HC_HC_AS_A_SERVICE]: 'HC as a Service',
  [DeloitteOfferingApi.HC_ASSET_GROUP]: 'Asset Group',
  [DeloitteOfferingApi.HC_OTHER]: 'Other',
  [DeloitteOfferingApi.MNA_MERGERS_AND_ACQUISITIONS]:
    'MAR Strategy & Diligence',
  [DeloitteOfferingApi.MNA_INTEGRATION_AND_DIVESTURE]:
    'MAR Integration & Divesture ',
  [DeloitteOfferingApi.MNA_OTHER]: 'Other',
  [DeloitteOfferingApi.MNA_CCG]: 'CCG',
  [DeloitteOfferingApi.SNA_CROSS_CONSULTING_GROUP]: 'Cross Consulting Group',
  [DeloitteOfferingApi.SNA_STRATEGY]: 'Strategy',
  [DeloitteOfferingApi.SNA_ANALYTICS_AND_COGNITIVE]: 'Analytics & Cognitive',
  [DeloitteOfferingApi.SNA_HYBRID_SOLUTIONS_AND_INCUBATION]:
    'Hybrid Solutions & Incubation',
  [DeloitteOfferingApi.SNA_ASSET_GROUP]: 'Asset Group',
  [DeloitteOfferingApi.SNA_OTHER]: 'Other',
  [DeloitteOfferingApi.NC_NATIONAL_CONSULTING]: 'National Consulting',
  [DeloitteOfferingApi.NC_ADJUSTMENTS_OR_OTHER]: 'Adjustments/Other',
  [DeloitteOfferingApi.NC_ALLIANCES]: 'Alliances',
  [DeloitteOfferingApi.NC_C_SUITE]: 'C Suite',
  [DeloitteOfferingApi.NC_CLIENT_AND_INDUSTRY]: 'Client & Industry',
  [DeloitteOfferingApi.NC_CLIENT_EXCELLENCE]: 'Client Excellence',
  [DeloitteOfferingApi.NC_CLOUD]: 'Cloud',
  [DeloitteOfferingApi.NC_CORPORATE_DEVELOPMENT]: 'Corporate Development',
  [DeloitteOfferingApi.NC_DELIVERY_EXCELLENCE]: 'Delivery Excellence',
  [DeloitteOfferingApi.NC_DTOC]: 'DTOC',
  [DeloitteOfferingApi.NC_INTERNATIONAL]: 'International',
  [DeloitteOfferingApi.NC_N_O_GLOBAL_CONSULTING_OFFICE]:
    'N.O Global Consulting Office',
  [DeloitteOfferingApi.NC_OFFERING_PORTFOLIO]: 'Offering Portfolio',
  [DeloitteOfferingApi.NC_OPERATION_AND_FINANCE]: 'Operation & Finance',
  [DeloitteOfferingApi.NC_OTHER_USI]: 'Other USI',
  [DeloitteOfferingApi.NC_PARTNER_MATTERS]: 'Partner Matters',
  [DeloitteOfferingApi.NC_SALES_AND_PURSUIT_EXCELLENCE]:
    'Sales & Pursuit Excellence',
  [DeloitteOfferingApi.NC_STRATEGY]: 'Strategy',
  [DeloitteOfferingApi.NC_TALENT]: 'Talent',
  [DeloitteOfferingApi.NC_TECH_AND_INNOVATION]: 'Tech & Innovation',
  [DeloitteOfferingApi.IS_GPS_BUSINESS_SYSTEMS]: 'GPS Business Systems',
  [DeloitteOfferingApi.IS_GPS_COMPLIANCE]: 'GPS Compliance',
  [DeloitteOfferingApi.IS_GPS_CONTRACTS]: 'GPS Contracts',
  [DeloitteOfferingApi.IS_GPS_FINANCE]: 'GPS Finance',
  [DeloitteOfferingApi.IS_GPS_SECURITY]: 'GPS Security',
  [DeloitteOfferingApi.P_ORGANIC]: 'Organic',
  [DeloitteOfferingApi.P_SNET]: 'SNET',
  [DeloitteOfferingApi.IS_GPS_BUSINESS_SERVICES]: 'GPS Business Services',
  [DeloitteOfferingApi.IS_GPS_OPS_MANAGEMENT]: 'GPS Ops Management',
  [DeloitteOfferingApi.IS_GPS_TALENT]: 'GPS Talent',
  [DeloitteOfferingApi.GPSEA_GPS_FINANCE]: 'GPS Finance',
  [DeloitteOfferingApi.GPSEA_GPS_CONTRACTS]: 'GPS Contracts',
  [DeloitteOfferingApi.GPSEA_GPS_CLIENT_EXCELLENCE]: 'GPS Client Excellence',
  [DeloitteOfferingApi.GPSEA_GPS_TALENT]: 'GPS Talent',
  [DeloitteOfferingApi.GPSEA_GPS_COMPLIANCE]: 'GPS Compliance',
  [DeloitteOfferingApi.GPSEA_GPS_OPERATIONS]: 'GPS Operations',
  [DeloitteOfferingApi.GPSEA_GPS_GENERAL_COUNSEL]: 'GPS General Counsel',
  [DeloitteOfferingApi.GPSEA_GPS_EA_MANAGEMENT]: 'GPS EA Management',
};

export const DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteOfferingPortfolioApi]: string;
} = {
  [DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS]:
    'Core Business Operations',
  [DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING]: 'Customer & Marketing',
  [DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS]:
    'Enterprise Performance',
  [DeloitteOfferingPortfolioApi.HUMAN_CAPITAL]: 'Human Capital',
  [DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS]:
    'M&A and Restructuring',
  [DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS]: 'Strategy & Analytics',
  [DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING]: 'National Consulting',
  [DeloitteOfferingPortfolioApi.INTERNAL_SERVICES]: 'Internal Services',
  [DeloitteOfferingPortfolioApi.PLATFORMS]: 'DC Platforms',
  [DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS]: 'GPS Enabling Areas',
};

export const DELOITTE_OFFERING_FULL_DISPLAY_NAME_MAP: {
  readonly [k in DeloitteOfferingApi]: string;
} = {
  [DeloitteOfferingApi.CBO_CROSS_CONSULTING_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CBO_CROSS_CONSULTING_GROUP
    ]
  }`,
  [DeloitteOfferingApi.CBO_OPERATIONS_TRANSFORMATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CBO_OPERATIONS_TRANSFORMATION
    ]
  }`,
  [DeloitteOfferingApi.CBO_SYSTEMS_ENGINEERING]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CBO_SYSTEMS_ENGINEERING
    ]
  }`,
  [DeloitteOfferingApi.CBO_CLOUD_ENGINEERING]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CBO_CLOUD_ENGINEERING
    ]
  }`,
  [DeloitteOfferingApi.CBO_CORE_INDUSTRY_SOLUTIONS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CBO_CORE_INDUSTRY_SOLUTIONS
    ]
  }`,
  [DeloitteOfferingApi.CBO_HEALTH_TECHNOLOGY]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CBO_HEALTH_TECHNOLOGY
    ]
  }`,
  [DeloitteOfferingApi.CBO_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.CBO_OTHER]}`,
  [DeloitteOfferingApi.CNM_CUSTOMER_STRATEGY_AND_APPLIED_DESIGN]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CNM_CUSTOMER_STRATEGY_AND_APPLIED_DESIGN
    ]
  }`,
  [DeloitteOfferingApi.CNM_ADVERTISING_MARKETING_AND_COMMERCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CNM_ADVERTISING_MARKETING_AND_COMMERCE
    ]
  }`,
  [DeloitteOfferingApi.CNM_DIGITAL_CUSTOMER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.CNM_DIGITAL_CUSTOMER]
  }`,
  [DeloitteOfferingApi.CNM_HUMAN_SERVICES_TRANSFORMATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CNM_HUMAN_SERVICES_TRANSFORMATION
    ]
  }`,
  [DeloitteOfferingApi.CNM_CROSS_CONSULTING_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.CNM_CROSS_CONSULTING_GROUP
    ]
  }`,
  [DeloitteOfferingApi.CNM_ASSET_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.CNM_ASSET_GROUP]
  }`,
  [DeloitteOfferingApi.CNM_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.CNM_OTHER]}`,
  [DeloitteOfferingApi.EO_CROSS_CONSULTING_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.EO_CROSS_CONSULTING_GROUP
    ]
  }`,
  [DeloitteOfferingApi.EO_FINANCE_AND_ENTERPRISE_PERFORMANCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.EO_FINANCE_AND_ENTERPRISE_PERFORMANCE
    ]
  }`,
  [DeloitteOfferingApi.EO_SUPPLY_CHAIN_AND_NETWORK_OPERATIONS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.EO_SUPPLY_CHAIN_AND_NETWORK_OPERATIONS
    ]
  }`,
  [DeloitteOfferingApi.EO_TECHNOLOGY_SERVICES_OPTIMIZATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.EO_TECHNOLOGY_SERVICES_OPTIMIZATION
    ]
  }`,
  [DeloitteOfferingApi.EO_SAP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_SAP]}`,
  [DeloitteOfferingApi.EO_ORACLE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_ORACLE]}`,
  [DeloitteOfferingApi.EO_ERP_SAAS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_ERP_SAAS]}`,
  [DeloitteOfferingApi.EO_ASSET_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_ASSET_GROUP]}`,
  [DeloitteOfferingApi.EO_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_OTHER]}`,
  [DeloitteOfferingApi.HC_CROSS_CONSULTING_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.HC_CROSS_CONSULTING_GROUP
    ]
  }`,
  [DeloitteOfferingApi.HC_HR_TRANSFORMATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.HC_HR_TRANSFORMATION]
  }`,
  [DeloitteOfferingApi.HC_ORGANIZATION_TRANSFORMATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.HC_ORGANIZATION_TRANSFORMATION
    ]
  }`,
  [DeloitteOfferingApi.HC_WORKFORCE_TRANSFORMATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.HC_WORKFORCE_TRANSFORMATION
    ]
  }`,
  [DeloitteOfferingApi.HC_HC_AS_A_SERVICE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.HC_HC_AS_A_SERVICE]
  }`,
  [DeloitteOfferingApi.HC_ASSET_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.HC_ASSET_GROUP]}`,
  [DeloitteOfferingApi.HC_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.HC_OTHER]}`,
  [DeloitteOfferingApi.MNA_MERGERS_AND_ACQUISITIONS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.MNA_MERGERS_AND_ACQUISITIONS
    ]
  }`,
  [DeloitteOfferingApi.MNA_INTEGRATION_AND_DIVESTURE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.MNA_INTEGRATION_AND_DIVESTURE
    ]
  }`,
  [DeloitteOfferingApi.MNA_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.MNA_OTHER]}`,
  [DeloitteOfferingApi.MNA_CCG]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.MNA_CCG]}`,
  [DeloitteOfferingApi.SNA_CROSS_CONSULTING_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.SNA_CROSS_CONSULTING_GROUP
    ]
  }`,
  [DeloitteOfferingApi.SNA_STRATEGY]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.SNA_STRATEGY]}`,
  [DeloitteOfferingApi.SNA_ANALYTICS_AND_COGNITIVE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.SNA_ANALYTICS_AND_COGNITIVE
    ]
  }`,
  [DeloitteOfferingApi.SNA_HYBRID_SOLUTIONS_AND_INCUBATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.SNA_HYBRID_SOLUTIONS_AND_INCUBATION
    ]
  }`,
  [DeloitteOfferingApi.SNA_ASSET_GROUP]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.SNA_ASSET_GROUP]
  }`,
  [DeloitteOfferingApi.SNA_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.SNA_OTHER]}`,
  [DeloitteOfferingApi.NC_NATIONAL_CONSULTING]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_NATIONAL_CONSULTING
    ]
  }`,
  [DeloitteOfferingApi.NC_ADJUSTMENTS_OR_OTHER]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_ADJUSTMENTS_OR_OTHER
    ]
  }`,
  [DeloitteOfferingApi.NC_ALLIANCES]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_ALLIANCES]}`,
  [DeloitteOfferingApi.NC_C_SUITE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_C_SUITE]}`,
  [DeloitteOfferingApi.NC_CLIENT_AND_INDUSTRY]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_CLIENT_AND_INDUSTRY
    ]
  }`,
  [DeloitteOfferingApi.NC_CLIENT_EXCELLENCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_CLIENT_EXCELLENCE]
  }`,
  [DeloitteOfferingApi.NC_CLOUD]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_CLOUD]}`,
  [DeloitteOfferingApi.NC_CORPORATE_DEVELOPMENT]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_CORPORATE_DEVELOPMENT
    ]
  }`,
  [DeloitteOfferingApi.NC_DELIVERY_EXCELLENCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_DELIVERY_EXCELLENCE
    ]
  }`,
  [DeloitteOfferingApi.NC_DTOC]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_DTOC]}`,
  [DeloitteOfferingApi.NC_INTERNATIONAL]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_INTERNATIONAL]
  }`,
  [DeloitteOfferingApi.NC_N_O_GLOBAL_CONSULTING_OFFICE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_N_O_GLOBAL_CONSULTING_OFFICE
    ]
  }`,
  [DeloitteOfferingApi.NC_OFFERING_PORTFOLIO]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_OFFERING_PORTFOLIO
    ]
  }`,
  [DeloitteOfferingApi.NC_OPERATION_AND_FINANCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_OPERATION_AND_FINANCE
    ]
  }`,
  [DeloitteOfferingApi.NC_OTHER_USI]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_OTHER_USI]}`,
  [DeloitteOfferingApi.NC_PARTNER_MATTERS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_PARTNER_MATTERS]
  }`,
  [DeloitteOfferingApi.NC_SALES_AND_PURSUIT_EXCELLENCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_SALES_AND_PURSUIT_EXCELLENCE
    ]
  }`,
  [DeloitteOfferingApi.NC_STRATEGY]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_STRATEGY]}`,
  [DeloitteOfferingApi.NC_TALENT]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_TALENT]}`,
  [DeloitteOfferingApi.NC_TECH_AND_INNOVATION]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.NC_TECH_AND_INNOVATION
    ]
  }`,
  [DeloitteOfferingApi.IS_GPS_BUSINESS_SYSTEMS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.IS_GPS_BUSINESS_SYSTEMS
    ]
  }`,
  [DeloitteOfferingApi.IS_GPS_COMPLIANCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.IS_GPS_COMPLIANCE]
  }`,
  [DeloitteOfferingApi.IS_GPS_CONTRACTS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.IS_GPS_CONTRACTS]
  }`,
  [DeloitteOfferingApi.IS_GPS_FINANCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.IS_GPS_FINANCE]}`,
  [DeloitteOfferingApi.IS_GPS_SECURITY]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.IS_GPS_SECURITY]
  }`,
  [DeloitteOfferingApi.IS_GPS_BUSINESS_SERVICES]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.IS_GPS_BUSINESS_SERVICES
    ]
  }`,
  [DeloitteOfferingApi.IS_GPS_OPS_MANAGEMENT]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.IS_GPS_OPS_MANAGEMENT
    ]
  }`,
  [DeloitteOfferingApi.IS_GPS_TALENT]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.INTERNAL_SERVICES
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.IS_GPS_TALENT]}`,
  [DeloitteOfferingApi.P_ORGANIC]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.PLATFORMS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.P_ORGANIC]}`,
  [DeloitteOfferingApi.P_SNET]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.PLATFORMS
    ]
  }, ${DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.P_SNET]}`,
  [DeloitteOfferingApi.GPSEA_GPS_FINANCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.GPSEA_GPS_FINANCE]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_CONTRACTS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.GPSEA_GPS_CONTRACTS]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_CLIENT_EXCELLENCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.GPSEA_GPS_CLIENT_EXCELLENCE
    ]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_TALENT]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.GPSEA_GPS_TALENT]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_COMPLIANCE]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.GPSEA_GPS_COMPLIANCE]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_OPERATIONS]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.GPSEA_GPS_OPERATIONS]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_GENERAL_COUNSEL]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.GPSEA_GPS_GENERAL_COUNSEL
    ]
  }`,
  [DeloitteOfferingApi.GPSEA_GPS_EA_MANAGEMENT]: `${
    DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
      DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
    ]
  }, ${
    DELOITTE_OFFERING_DISPLAY_NAME_MAP[
      DeloitteOfferingApi.GPSEA_GPS_EA_MANAGEMENT
    ]
  }`,
};

export const PROJECT_TYPE_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP[
        DeloitteProjectTypeApi.CLIENT_BILLABLE
      ],
    value: DeloitteProjectTypeApi.CLIENT_BILLABLE,
  },
  {
    displayText:
      DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP[
        DeloitteProjectTypeApi.FIRM_INITIATIVE
      ],
    value: DeloitteProjectTypeApi.FIRM_INITIATIVE,
  },
  {
    displayText:
      DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP[DeloitteProjectTypeApi.PRD],
    value: DeloitteProjectTypeApi.PRD,
  },
  {
    displayText:
      DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP[
        DeloitteProjectTypeApi.SKILLS_BASED_VOLUNTEERING
      ],
    value: DeloitteProjectTypeApi.SKILLS_BASED_VOLUNTEERING,
  },
  {
    displayText:
      DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP[
        DeloitteProjectTypeApi.OTHER_INVESTMENT
      ],
    value: DeloitteProjectTypeApi.OTHER_INVESTMENT,
  },
  {
    displayText:
      DELOITTE_PROJECT_TYPE_DISPLAY_NAME_MAP[
        DeloitteProjectTypeApi.INTERNAL_SERVICES
      ],
    value: DeloitteProjectTypeApi.INTERNAL_SERVICES,
  },
];

export const UTILIZATION_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_UTILIZATION_DISPLAY_NAME_MAP[DeloitteUtilizationApi.UTILIZATION],
    value: DeloitteUtilizationApi.UTILIZATION,
  },
  {
    displayText:
      DELOITTE_UTILIZATION_DISPLAY_NAME_MAP[
        DeloitteUtilizationApi.ADJUSTED_UTILIZATION
      ],
    value: DeloitteUtilizationApi.ADJUSTED_UTILIZATION,
  },
  {
    displayText:
      DELOITTE_UTILIZATION_DISPLAY_NAME_MAP[
        DeloitteUtilizationApi.NO_UTILIZATION
      ],
    value: DeloitteUtilizationApi.NO_UTILIZATION,
  },
];

export const BUSINESS_LINE_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP[
        DeloitteBusinessLineApi.CONSULTING
      ],
    value: DeloitteBusinessLineApi.CONSULTING,
  },
  {
    displayText:
      DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP[
        DeloitteBusinessLineApi.AUDIT_AND_ASSURANCE
      ],
    value: DeloitteBusinessLineApi.AUDIT_AND_ASSURANCE,
  },
  {
    displayText:
      DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP[DeloitteBusinessLineApi.TAX],
    value: DeloitteBusinessLineApi.TAX,
  },
  {
    displayText:
      DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP[
        DeloitteBusinessLineApi.RISK_AND_FINANCIAL_ADVISORY
      ],
    value: DeloitteBusinessLineApi.RISK_AND_FINANCIAL_ADVISORY,
  },
  {
    displayText:
      DELOITTE_BUSINESS_LINE_DISPLAY_NAME_MAP[
        DeloitteBusinessLineApi.INTERNAL_SERVICES
      ],
    value: DeloitteBusinessLineApi.INTERNAL_SERVICES,
  },
];

export const PRACTICE_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.COMMERCIAL_CORE],
    value: DeloittePracticeApi.COMMERCIAL_CORE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[
        DeloittePracticeApi.COMMERCIAL_USDC_ONSITE
      ],
    value: DeloittePracticeApi.COMMERCIAL_USDC_ONSITE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[
        DeloittePracticeApi.COMMERCIAL_USDC_INCENTER
      ],
    value: DeloittePracticeApi.COMMERCIAL_USDC_INCENTER,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.GPS_CORE],
    value: DeloittePracticeApi.GPS_CORE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[
        DeloittePracticeApi.GPS_OPERATIONAL_EXCELLENCE
      ],
    value: DeloittePracticeApi.GPS_OPERATIONAL_EXCELLENCE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.GPS_USDC_ONSITE],
    value: DeloittePracticeApi.GPS_USDC_ONSITE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.GPS_USDC_INCENTER],
    value: DeloittePracticeApi.GPS_USDC_INCENTER,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.USI_OFFSHORE],
    value: DeloittePracticeApi.USI_OFFSHORE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.USI_ONSITE],
    value: DeloittePracticeApi.USI_ONSITE,
  },
];

export const LIMIT_PRACTICE_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.COMMERCIAL_CORE],
    value: DeloittePracticeApi.COMMERCIAL_CORE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[
        DeloittePracticeApi.COMMERCIAL_USDC_ONSITE
      ],
    value: DeloittePracticeApi.COMMERCIAL_USDC_ONSITE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[
        DeloittePracticeApi.COMMERCIAL_USDC_INCENTER
      ],
    value: DeloittePracticeApi.COMMERCIAL_USDC_INCENTER,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.GPS_CORE],
    value: DeloittePracticeApi.GPS_CORE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.GPS_USDC_ONSITE],
    value: DeloittePracticeApi.GPS_USDC_ONSITE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.GPS_USDC_INCENTER],
    value: DeloittePracticeApi.GPS_USDC_INCENTER,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.USI_OFFSHORE],
    value: DeloittePracticeApi.USI_OFFSHORE,
  },
  {
    displayText:
      DELOITTE_PRACTICE_DISPLAY_NAME_MAP[DeloittePracticeApi.USI_ONSITE],
    value: DeloittePracticeApi.USI_ONSITE,
  },
];

export const INDUSTRY_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.AUTOMOTIVE],
    value: DeloitteIndustryApi.AUTOMOTIVE,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS
      ],
    value: DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CIVIL_GOVERNMENT],
    value: DeloitteIndustryApi.CIVIL_GOVERNMENT,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CONSUMER_PRODUCTS],
    value: DeloitteIndustryApi.CONSUMER_PRODUCTS,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_C],
    value: DeloitteIndustryApi.CROSS_SECTOR_C,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_CI],
    value: DeloitteIndustryApi.CROSS_SECTOR_CI,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_ERI],
    value: DeloitteIndustryApi.CROSS_SECTOR_ERI,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_FS],
    value: DeloitteIndustryApi.CROSS_SECTOR_FS,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_GPS],
    value: DeloitteIndustryApi.CROSS_SECTOR_GPS,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_LSHC],
    value: DeloitteIndustryApi.CROSS_SECTOR_LSHC,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.CROSS_SECTOR_TMT],
    value: DeloitteIndustryApi.CROSS_SECTOR_TMT,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.DEFENSE_SECURITY_AND_JUSTICE
      ],
    value: DeloitteIndustryApi.DEFENSE_SECURITY_AND_JUSTICE,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.FEDERAL_HEALTH],
    value: DeloitteIndustryApi.FEDERAL_HEALTH,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.HEALTH_CARE],
    value: DeloitteIndustryApi.HEALTH_CARE,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION
      ],
    value: DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.INSURANCE],
    value: DeloitteIndustryApi.INSURANCE,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.INVESTMENT_MANAGEMENT
      ],
    value: DeloitteIndustryApi.INVESTMENT_MANAGEMENT,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.MEDIA_AND_ENTERTAINMENT
      ],
    value: DeloitteIndustryApi.MEDIA_AND_ENTERTAINMENT,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS
      ],
    value: DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.POWER_AND_UTILITIES
      ],
    value: DeloitteIndustryApi.POWER_AND_UTILITIES,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.REAL_ESTATE],
    value: DeloitteIndustryApi.REAL_ESTATE,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.RETAIL_WHOLESALE_AND_DISTRIBUTION
      ],
    value: DeloitteIndustryApi.RETAIL_WHOLESALE_AND_DISTRIBUTION,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.STATE_LOCAL_AND_HIGHER_EDUCATION
      ],
    value: DeloitteIndustryApi.STATE_LOCAL_AND_HIGHER_EDUCATION,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.TECHNOLOGY],
    value: DeloitteIndustryApi.TECHNOLOGY,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT
      ],
    value: DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT,
  },
  {
    displayText:
      DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
        DeloitteIndustryApi.TRANSPORTATION_HOSPITALITY_AND_SERVICES
      ],
    value: DeloitteIndustryApi.TRANSPORTATION_HOSPITALITY_AND_SERVICES,
  },
];

export const INDUSTRY_GROUP_OPTIONS: ReadonlyArray<
  SelectGroups | SelectItem
> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    groupName:
      DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
        DeloitteIndustryGroupApi.CONSUMER
      ],
    options: [
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.CROSS_SECTOR_C
          ],
        value: DeloitteIndustryApi.CROSS_SECTOR_C,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi
              .AUTOMOTIVE_TRANSPORTATION_HOSPITALITY_AND_SERVICES
          ],
        value:
          DeloitteIndustryApi.AUTOMOTIVE_TRANSPORTATION_HOSPITALITY_AND_SERVICES,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.RETAIL_AND_CONSUMER_PRODUCTS
          ],
        value: DeloitteIndustryApi.RETAIL_AND_CONSUMER_PRODUCTS,
      },
    ],
  },
  {
    groupName:
      DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
        DeloitteIndustryGroupApi.TECHNOLOGY_MEDIA_AND_TELECOM
      ],
    options: [
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.CROSS_SECTOR_TMT
          ],
        value: DeloitteIndustryApi.CROSS_SECTOR_TMT,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.TECHNOLOGY],
        value: DeloitteIndustryApi.TECHNOLOGY,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT
          ],
        value: DeloitteIndustryApi.TELECOM_MEDIA_AND_ENTERTAINMENT,
      },
    ],
  },
  {
    groupName:
      DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
        DeloitteIndustryGroupApi.ENERGY_RESOURCES_AND_INDUSTRIALS
      ],
    options: [
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.CROSS_SECTOR_ERI
          ],
        value: DeloitteIndustryApi.CROSS_SECTOR_ERI,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION
          ],
        value: DeloitteIndustryApi.INDUSTRIAL_PRODUCTS_AND_CONSTRUCTION,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS
          ],
        value: DeloitteIndustryApi.OIL_GAS_AND_CHEMICALS,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.POWER_AND_UTILITIES
          ],
        value: DeloitteIndustryApi.POWER_AND_UTILITIES,
      },
    ],
  },
  {
    groupName:
      DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
        DeloitteIndustryGroupApi.FINANCIAL_SERVICES
      ],
    options: [
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.CROSS_SECTOR_FS
          ],
        value: DeloitteIndustryApi.CROSS_SECTOR_FS,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS
          ],
        value: DeloitteIndustryApi.BANKING_AND_CAPITAL_MARKETS,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.INSURANCE],
        value: DeloitteIndustryApi.INSURANCE,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.INVESTMENT_MANAGEMENT_AND_REAL_ESTATE
          ],
        value: DeloitteIndustryApi.INVESTMENT_MANAGEMENT_AND_REAL_ESTATE,
      },
    ],
  },
  {
    groupName:
      DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
        DeloitteIndustryGroupApi.GOVERNMENT_AND_PUBLIC_SECTOR
      ],
    options: [
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.CROSS_SECTOR_GPS
          ],
        value: DeloitteIndustryApi.CROSS_SECTOR_GPS,
      },
    ],
  },
  {
    groupName:
      DELOITTE_INDUSTRY_GROUP_DISPLAY_NAME_MAP[
        DeloitteIndustryGroupApi.LIFE_SCIENCES_AND_HEALTH_CARE
      ],
    options: [
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[
            DeloitteIndustryApi.CROSS_SECTOR_LSHC
          ],
        value: DeloitteIndustryApi.CROSS_SECTOR_LSHC,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.HEALTH_CARE],
        value: DeloitteIndustryApi.HEALTH_CARE,
      },
      {
        displayText:
          DELOITTE_INDUSTRY_DISPLAY_NAME_MAP[DeloitteIndustryApi.LIFE_SCIENCES],
        value: DeloitteIndustryApi.LIFE_SCIENCES,
      },
    ],
  },
];

export const OFFERING_OPTIONS: ReadonlyArray<SelectGroups | SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CBO_CLOUD_ENGINEERING
          ],
        value: DeloitteOfferingApi.CBO_CLOUD_ENGINEERING,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CBO_CORE_INDUSTRY_SOLUTIONS
          ],
        value: DeloitteOfferingApi.CBO_CORE_INDUSTRY_SOLUTIONS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CBO_CROSS_CONSULTING_GROUP
          ],
        value: DeloitteOfferingApi.CBO_CROSS_CONSULTING_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CBO_HEALTH_TECHNOLOGY
          ],
        value: DeloitteOfferingApi.CBO_HEALTH_TECHNOLOGY,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CBO_OPERATIONS_TRANSFORMATION
          ],
        value: DeloitteOfferingApi.CBO_OPERATIONS_TRANSFORMATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CBO_SYSTEMS_ENGINEERING
          ],
        value: DeloitteOfferingApi.CBO_SYSTEMS_ENGINEERING,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.CBO_OTHER],
        value: DeloitteOfferingApi.CBO_OTHER,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CNM_ASSET_GROUP
          ],
        value: DeloitteOfferingApi.CNM_ASSET_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CNM_ADVERTISING_MARKETING_AND_COMMERCE
          ],
        value: DeloitteOfferingApi.CNM_ADVERTISING_MARKETING_AND_COMMERCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CNM_CROSS_CONSULTING_GROUP
          ],
        value: DeloitteOfferingApi.CNM_CROSS_CONSULTING_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CNM_CUSTOMER_STRATEGY_AND_APPLIED_DESIGN
          ],
        value: DeloitteOfferingApi.CNM_CUSTOMER_STRATEGY_AND_APPLIED_DESIGN,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CNM_DIGITAL_CUSTOMER
          ],
        value: DeloitteOfferingApi.CNM_DIGITAL_CUSTOMER,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.CNM_HUMAN_SERVICES_TRANSFORMATION
          ],
        value: DeloitteOfferingApi.CNM_HUMAN_SERVICES_TRANSFORMATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.CNM_OTHER],
        value: DeloitteOfferingApi.CNM_OTHER,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.EO_ASSET_GROUP
          ],
        value: DeloitteOfferingApi.EO_ASSET_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.EO_CROSS_CONSULTING_GROUP
          ],
        value: DeloitteOfferingApi.EO_CROSS_CONSULTING_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_ERP_SAAS],
        value: DeloitteOfferingApi.EO_ERP_SAAS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.EO_FINANCE_AND_ENTERPRISE_PERFORMANCE
          ],
        value: DeloitteOfferingApi.EO_FINANCE_AND_ENTERPRISE_PERFORMANCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_ORACLE],
        value: DeloitteOfferingApi.EO_ORACLE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_SAP],
        value: DeloitteOfferingApi.EO_SAP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.EO_SUPPLY_CHAIN_AND_NETWORK_OPERATIONS
          ],
        value: DeloitteOfferingApi.EO_SUPPLY_CHAIN_AND_NETWORK_OPERATIONS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.EO_TECHNOLOGY_SERVICES_OPTIMIZATION
          ],
        value: DeloitteOfferingApi.EO_TECHNOLOGY_SERVICES_OPTIMIZATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.EO_OTHER],
        value: DeloitteOfferingApi.EO_OTHER,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_FINANCE
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_FINANCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_CONTRACTS
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_CONTRACTS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_CLIENT_EXCELLENCE
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_CLIENT_EXCELLENCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_TALENT
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_TALENT,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_COMPLIANCE
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_COMPLIANCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_OPERATIONS
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_OPERATIONS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_GENERAL_COUNSEL
          ],
        value: DeloitteOfferingApi.GPSEA_GPS_GENERAL_COUNSEL,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.GPSEA_GPS_EA_MANAGEMENT
          ],
        value: DeloitteOfferingApi.EO_TECHNOLOGY_SERVICES_OPTIMIZATION,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.HC_ASSET_GROUP
          ],
        value: DeloitteOfferingApi.HC_ASSET_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.HC_CROSS_CONSULTING_GROUP
          ],
        value: DeloitteOfferingApi.HC_CROSS_CONSULTING_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.HC_HC_AS_A_SERVICE
          ],
        value: DeloitteOfferingApi.HC_HC_AS_A_SERVICE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.HC_HR_TRANSFORMATION
          ],
        value: DeloitteOfferingApi.HC_HR_TRANSFORMATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.HC_ORGANIZATION_TRANSFORMATION
          ],
        value: DeloitteOfferingApi.HC_ORGANIZATION_TRANSFORMATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.HC_WORKFORCE_TRANSFORMATION
          ],
        value: DeloitteOfferingApi.HC_WORKFORCE_TRANSFORMATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.HC_OTHER],
        value: DeloitteOfferingApi.HC_OTHER,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.MNA_CCG],
        value: DeloitteOfferingApi.MNA_CCG,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.MNA_MERGERS_AND_ACQUISITIONS
          ],
        value: DeloitteOfferingApi.MNA_MERGERS_AND_ACQUISITIONS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.MNA_INTEGRATION_AND_DIVESTURE
          ],
        value: DeloitteOfferingApi.MNA_INTEGRATION_AND_DIVESTURE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.MNA_OTHER],
        value: DeloitteOfferingApi.MNA_OTHER,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_ADJUSTMENTS_OR_OTHER
          ],
        value: DeloitteOfferingApi.NC_ADJUSTMENTS_OR_OTHER,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_ALLIANCES],
        value: DeloitteOfferingApi.NC_ALLIANCES,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_C_SUITE],
        value: DeloitteOfferingApi.NC_C_SUITE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_CLIENT_AND_INDUSTRY
          ],
        value: DeloitteOfferingApi.NC_CLIENT_AND_INDUSTRY,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_CLIENT_EXCELLENCE
          ],
        value: DeloitteOfferingApi.NC_CLIENT_EXCELLENCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_CLOUD],
        value: DeloitteOfferingApi.NC_CLOUD,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_CORPORATE_DEVELOPMENT
          ],
        value: DeloitteOfferingApi.NC_CORPORATE_DEVELOPMENT,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_DELIVERY_EXCELLENCE
          ],
        value: DeloitteOfferingApi.NC_DELIVERY_EXCELLENCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_DTOC],
        value: DeloitteOfferingApi.NC_DTOC,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_INTERNATIONAL
          ],
        value: DeloitteOfferingApi.NC_INTERNATIONAL,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_N_O_GLOBAL_CONSULTING_OFFICE
          ],
        value: DeloitteOfferingApi.NC_N_O_GLOBAL_CONSULTING_OFFICE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_NATIONAL_CONSULTING
          ],
        value: DeloitteOfferingApi.NC_NATIONAL_CONSULTING,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_OFFERING_PORTFOLIO
          ],
        value: DeloitteOfferingApi.NC_OFFERING_PORTFOLIO,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_OPERATION_AND_FINANCE
          ],
        value: DeloitteOfferingApi.NC_OPERATION_AND_FINANCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_OTHER_USI],
        value: DeloitteOfferingApi.NC_OTHER_USI,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_PARTNER_MATTERS
          ],
        value: DeloitteOfferingApi.NC_PARTNER_MATTERS,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_SALES_AND_PURSUIT_EXCELLENCE
          ],
        value: DeloitteOfferingApi.NC_SALES_AND_PURSUIT_EXCELLENCE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_STRATEGY],
        value: DeloitteOfferingApi.NC_STRATEGY,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.NC_TALENT],
        value: DeloitteOfferingApi.NC_TALENT,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.NC_TECH_AND_INNOVATION
          ],
        value: DeloitteOfferingApi.NC_TECH_AND_INNOVATION,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.PLATFORMS
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.P_ORGANIC],
        value: DeloitteOfferingApi.P_ORGANIC,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.P_SNET],
        value: DeloitteOfferingApi.P_SNET,
      },
    ],
  },
  {
    groupName:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
      ],
    options: [
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.SNA_ANALYTICS_AND_COGNITIVE
          ],
        value: DeloitteOfferingApi.SNA_ANALYTICS_AND_COGNITIVE,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.SNA_ASSET_GROUP
          ],
        value: DeloitteOfferingApi.SNA_ASSET_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.SNA_CROSS_CONSULTING_GROUP
          ],
        value: DeloitteOfferingApi.SNA_CROSS_CONSULTING_GROUP,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[
            DeloitteOfferingApi.SNA_HYBRID_SOLUTIONS_AND_INCUBATION
          ],
        value: DeloitteOfferingApi.SNA_HYBRID_SOLUTIONS_AND_INCUBATION,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.SNA_STRATEGY],
        value: DeloitteOfferingApi.SNA_STRATEGY,
      },
      {
        displayText:
          DELOITTE_OFFERING_DISPLAY_NAME_MAP[DeloitteOfferingApi.SNA_OTHER],
        value: DeloitteOfferingApi.SNA_OTHER,
      },
    ],
  },
];

export const OFFERING_PORTFOLIO_OPTIONS: ReadonlyArray<SelectItem> = [
  {
    displayText: '',
    value: '',
    disabled: true,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS
      ],
    value: DeloitteOfferingPortfolioApi.CORE_BUSINESS_OPERATIONS,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING
      ],
    value: DeloitteOfferingPortfolioApi.CUSTOMER_AND_MARKETING,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.HUMAN_CAPITAL
      ],
    value: DeloitteOfferingPortfolioApi.HUMAN_CAPITAL,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.PLATFORMS
      ],
    value: DeloitteOfferingPortfolioApi.PLATFORMS,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS
      ],
    value: DeloitteOfferingPortfolioApi.GPS_ENABLING_AREAS,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS
      ],
    value: DeloitteOfferingPortfolioApi.ENTERPRISE_OPERATIONS,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS
      ],
    value: DeloitteOfferingPortfolioApi.MERGERS_AND_ACQUISITIONS,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING
      ],
    value: DeloitteOfferingPortfolioApi.NATIONAL_CONSULTING,
  },
  {
    displayText:
      DELOITTE_OFFERING_PORTFOLIO_DISPLAY_NAME_MAP[
        DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS
      ],
    value: DeloitteOfferingPortfolioApi.STRATEGY_AND_ANALYTICS,
  },
];

export enum DeloitteProjectPostField {
  OWNERSHIP_TYPE = 'ownershipType',
  OWNERSHIP_USER = 'ownershipUser',
  TITLE = 'title',
  DESCRIPTION = 'description',
  SKILLS = 'skills',
  AUDIENCE = 'audience',
  START_DATE = 'start_date',
  COMPLETION_DATE = 'completion_date',
  BILLABLE_HOURS = 'billable_hours',
  LOCATION = 'location',
  AGREE_TO_TERMS_AND_CONDITIONS = 'agree_to_terms_and_conditions',
  // Used for checkboxes to add additional fields to the project
  HAS_RESTRICTIONS = 'has_restrictions',
  IS_LOCAL_PROJECT = 'is_local_project',
  IS_CLEARANCE_REQUIRED = 'is_clearance_required',
  ARE_CERTIFICATIONS_LIMITED = 'are_certifications_limited',
  ARE_PRACTICES_LIMITED = 'are_practices_limited',
  ARE_OFFERING_PORTFOLIOS_LIMITED = 'are_offering_portfolios_limited',
  // Project custom fields, maps 1-to-1 to custom field name in DB
  BILLING_CODE = 'wbs_code',
  PROJECT_TYPE = 'project_type',
  UTILIZATION = 'utilization',
  BUSINESS_LINE = 'business_line',
  PRACTICE = 'practice',
  INDUSTRY_SECTOR = 'industry_sector',
  INDUSTRY_GROUP = 'industry_group',
  MARKET_OFFERING = 'market_offering',
  OFFERING_PORTFOLIO = 'offering_portfolio',
  CLEARANCE = 'clearance',
  IS_SUBJECT_TO_ITAR = 'itar',
  LIMIT_CERTIFICATIONS = 'limit_certifications',
  LIMIT_PRACTICES = 'limit_practices',
  LIMIT_OFFERING_PORTFOLIOS = 'limit_offering_portfolio',
  LIMIT_GIG_WORKER_LEVEL = 'limit_gig_worker_level',
}

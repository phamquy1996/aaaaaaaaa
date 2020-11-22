import {
  DeloitteIndustryOfferingApi,
  DeloitteProjectDetailsApi,
} from 'api-typings/projects/deloitte';
import {
  DeloitteIndustryOffering,
  DeloitteProjectDetails,
} from './deloitte.model';

// TODO: T213935 - This is deprecated and will be removed.
export function transformDeloitteProjectDetails(
  deloitteDetails: DeloitteProjectDetailsApi,
): DeloitteProjectDetails {
  return {
    billingCode: deloitteDetails.billing_code,
    industryOffering: transformDeloitteIndustryOffering(
      deloitteDetails.industry_offering,
    ),
    clearance: deloitteDetails.clearance,
    itar: deloitteDetails.itar === '1',
  };
}

export function transformDeloitteIndustryOffering(
  industryOffering: DeloitteIndustryOfferingApi,
): DeloitteIndustryOffering {
  return {
    projectType: industryOffering.project_type,
    practice: industryOffering.practice,
    industry: industryOffering.industry,
    offering: industryOffering.offering,
  };
}

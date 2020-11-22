import { generateId } from '@freelancer/datastore/testing';
import { PoolApi, TimeUnitApi } from 'api-typings/common/common';
import {
  DeloitteIndustryApi,
  DeloitteOfferingApi,
  DeloittePracticeApi,
  DeloitteProjectTypeApi,
} from 'api-typings/projects/deloitte';
import { OnBehalfProjectStatusApi } from 'api-typings/projects/projects';
import { addDays } from 'date-fns';
import { CustomFieldValue } from '../custom-field-info-configurations/custom-field-info-configurations.model';
import { phpSkill } from '../skills/skills.seed';
import { OnBehalfProject } from './on-behalf-projects.model';

export interface GenerateOnBehalfProjectOptions {
  readonly userId: number;
  readonly nominatedUserEmail: string;
  readonly nominatedUserId?: number;
  readonly id?: number;
  readonly title?: string;
  readonly status?: OnBehalfProjectStatusApi;
  readonly poolIds?: ReadonlyArray<PoolApi>;
  readonly currencyId?: number;
  readonly hourlyProjectInfo?: {
    readonly commitment: {
      readonly hours: number;
      readonly interval: TimeUnitApi;
    };
  };
  // TODO: T213935 - This is deprecated and will be removed.
  readonly deloitteDetails?: {
    readonly billingCode: string;
    readonly industryOffering: {
      readonly projectType: DeloitteProjectTypeApi;
      readonly practice: DeloittePracticeApi;
      readonly industry: DeloitteIndustryApi;
      readonly offering: DeloitteOfferingApi;
    };
    readonly clearance?: string;
    readonly itar?: boolean;
  };
  readonly customFieldValues?: ReadonlyArray<CustomFieldValue>;
}

export function generateOnBehalfProject({
  userId,
  nominatedUserEmail,
  nominatedUserId,
  id = generateId(),
  title = 'On Behalf Project',
  status = OnBehalfProjectStatusApi.PENDING,
  currencyId = 1,
  poolIds = [],
  hourlyProjectInfo,
  deloitteDetails,
  customFieldValues,
}: GenerateOnBehalfProjectOptions): OnBehalfProject {
  return {
    id,
    userId,
    nominatedUserEmail,
    nominatedUserId,
    title,
    description: 'This is the default description for the On behalf project.',
    currencyId,
    budget: {
      minimum: 1,
      maximum: 1,
    },
    skills: [phpSkill()],
    budgetType: 'hourly',
    upgrades: {
      assisted: false,
      NDA: false,
      nonpublic: true,
      sealed: true,
      featured: false,
      urgent: false,
      fulltime: false,
      ipContract: false,
      listed: false,
      projectManagement: false,
      qualified: false,
      extend: false,
    },
    fileIds: [],
    timeframe: {
      startDate: Date.now(),
      endDate: addDays(Date.now(), 3).getTime(),
    },
    poolIds,
    hourlyProjectInfo,
    status,
    deloitteDetails,
    projectId:
      status === OnBehalfProjectStatusApi.POSTED ? generateId() : undefined,
    customFieldValues,
  };
}

export function deloitteOnBehalfProject(
  customFieldValues: ReadonlyArray<CustomFieldValue> = [],
): Pick<
  GenerateOnBehalfProjectOptions,
  | 'poolIds'
  | 'currencyId'
  | 'hourlyProjectInfo'
  | 'deloitteDetails'
  | 'customFieldValues'
> {
  return {
    poolIds: [PoolApi.DELOITTE_DC],
    currencyId: 40, // TKN
    hourlyProjectInfo: {
      commitment: { hours: 123, interval: TimeUnitApi.WEEK },
    },
    customFieldValues,
  };
}

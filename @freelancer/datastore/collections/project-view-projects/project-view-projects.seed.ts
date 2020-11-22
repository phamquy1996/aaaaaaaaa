import { DatastoreInterface } from '@freelancer/datastore/core';
import { average } from '@freelancer/datastore/testing';
import {
  ProjectStatusApi,
  ProjectSubStatusApi,
  ProjectTypeApi,
} from 'api-typings/projects/projects';
import { Bid } from '../bids/bids.model';
import { CurrencyCode } from '../currencies/currencies.seed';
import {
  ProjectBudget,
  ProjectCollaborations,
} from '../projects/projects.model';
import { generateProjectObject } from '../projects/projects.seed';
import { Skill } from '../skills/skills.model';
import {
  photographySkill,
  phpSkill,
  websiteDesignSkill,
} from '../skills/skills.seed';
import { ProjectViewProject } from './project-view-projects.model';
import { ProjectViewProjectsCollection } from './project-view-projects.types';

export interface GenerateProjectViewProjectOptions {
  readonly ownerId: number;
  readonly projectId?: number;
  readonly projectType?: ProjectTypeApi;
  readonly currencyCode?: CurrencyCode;
  readonly status?: ProjectStatusApi;
  readonly subStatus?: ProjectSubStatusApi;
  readonly selectedBids?: ReadonlyArray<Bid>;
  readonly skills?: ReadonlyArray<Skill>;
  readonly budget?: ProjectBudget;
  readonly local?: boolean;
  readonly projectCollaborations?: ReadonlyArray<ProjectCollaborations>;
  readonly activate?: boolean;
  readonly billingCode?: string;
  readonly enterpriseIds?: ReadonlyArray<number>;
}

export function generateProjectViewProjectObject(
  options: GenerateProjectViewProjectOptions,
): ProjectViewProject {
  return {
    ...generateProjectObject(options),
    ...generateProjectViewProjectDetails(options),
  };
}

function generateProjectViewProjectDetails({
  skills = [phpSkill()],
}: GenerateProjectViewProjectOptions) {
  return {
    skills,
    attachments: [],
    canPostReview: {},
    description:
      'I need someone to make me a website for my business. It should be awesome and wiz bang.',
    location: {
      country: {
        id: '',
        code: '',
        name: '',
      },
    },
    qualifications: [],
    ndaDetails: {
      signatures: [],
    },
  };
}

// ----- Mixins -----
export function websiteDesignProject(): Pick<
  GenerateProjectViewProjectOptions,
  'skills'
> {
  return {
    skills: [phpSkill(), websiteDesignSkill()],
  };
}

// TODO: Local projects have additional fields, add them in
export function localProject({
  skills = [photographySkill()],
}: {
  readonly skills?: ReadonlyArray<Skill>;
} = {}): Pick<GenerateProjectViewProjectOptions, 'local' | 'skills'> {
  if (!skills.some(job => job.local)) {
    throw new Error('A local project must have at least one local skill');
  }

  return {
    local: true,
    skills,
  };
}

// ----- Update -----

interface UpdateProjectViewBidAverageProjectOptions {
  readonly projectId: number;
  readonly bids: ReadonlyArray<Bid>;
}

export async function updateProjectViewProjectBidStats(
  datastore: DatastoreInterface,
  { projectId, bids }: UpdateProjectViewBidAverageProjectOptions,
) {
  return datastore
    .document<ProjectViewProjectsCollection>('projectViewProjects', projectId)
    .update({
      bidStats: {
        bidCount: bids.length,
        bidAvg: average(bids.map(bid => bid.amount)),
      },
    });
}

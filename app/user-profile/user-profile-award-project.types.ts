import { Currency } from '@freelancer/datastore/collections';
import { CommitmentApi } from 'api-typings/projects/projects';

export enum AwardProjectHireMeState {
  LOADING = 1,
  HIRE_ME = 2,
  AWARD_PROJECT = 3,
  NONE = 4,
}

export interface AwardProjectModel {
  readonly bidDesc?: string;
  readonly bidId: number;
  readonly freelancerDisplayName: string;
  readonly freelancerId: number;
  readonly projectId: number;
  readonly projectLink: string;
  readonly projectName: string;
  readonly duration: number;
  readonly bidAmount: number;
  readonly currency: Currency;
  readonly hourly: boolean;
  readonly commitment?: CommitmentApi;
}

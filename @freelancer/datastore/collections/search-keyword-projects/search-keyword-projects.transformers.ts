import { toNumber } from '@freelancer/utils';
import { FrontendProjectStatusApi } from 'api-typings/common/common';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { ProjectBudget } from '../projects/projects.model';
import { SearchKeywordProjectAjax } from './search-keyword-projects.backend-model';
import { SearchKeywordProject } from './search-keyword-projects.model';

export function transformSearchKeywordProject(
  project: SearchKeywordProjectAjax,
): SearchKeywordProject {
  return {
    budget: {
      maximum: project.max_budget,
      minimum: project.min_budget,
      currency: toNumber(project.currency.id),
    } as ProjectBudget,
    commitment: toNumber(project.commitment),
    currency: transformCurrencyAjax(project.currency),
    description: project.description,
    frontendProjectStatus: project.status as FrontendProjectStatusApi,
    id: toNumber(project.id),
    skillList: project.jobList,
    skillListArray: project.jobListArray,
    title: project.name,
    type:
      project.budget_period === 'Hourly:'
        ? ProjectTypeApi.HOURLY
        : ProjectTypeApi.FIXED,
  };
}

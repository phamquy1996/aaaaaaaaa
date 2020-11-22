import { PostJobPageFormStateEntryAjax } from './post-job-page-form-state.backend-model';
import { PostJobPageFormState } from './post-job-page-form-state.model';

export function transformPostJobPageFormState(
  state: PostJobPageFormStateEntryAjax,
): PostJobPageFormState {
  return {
    communitySelection: state.communitySelection,
    contestDuration: state.contestDuration || null,
    contestDurationType: state.contestDurationType || null,
    contestPrize: state.contestPrize || null,
    contestType: state.contestType || null,
    currencyId: state.currencyId || null,
    description: state.description,
    id: state.userId,
    isLocal: state.isLocal || null,
    jobType: state.jobType || null,
    projectBudgetRange: state.projectBudgetRange || null,
    projectBudgetType: state.projectBudgetType || null,
    projectType: state.projectType || null,
    skills: state.skills || null,
    submitDate: state.submitDate * 1000,
    templateSelection: state.templateSelection,
    title: state.title || '',
    userId: state.userId,
    hasBillingCode: state.hasBillingCode,
    billingCode: state.billingCode,
  };
}

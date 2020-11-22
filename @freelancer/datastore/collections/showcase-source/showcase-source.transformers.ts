import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { ShowcaseSourceAjax } from './showcase-source.backend-model';
import { ShowcaseSource } from './showcase-source.model';

export function transformShowcaseSource(
  showcaseSource: ShowcaseSourceAjax,
): ShowcaseSource {
  return {
    /*
     * Since this queries from different databases, there is no unified ID but these are unique
     * for combinations of type and parentSourceId eg: contest-1234, project-1234
     */
    id: `${showcaseSource.type}-${showcaseSource.parent_source_id}`,
    parentSourceId: showcaseSource.parent_source_id,
    sourceId: showcaseSource.source_id,
    type: showcaseSource.type,
    title: showcaseSource.title,
    description: showcaseSource.description,
    employerId: showcaseSource.employer_id,
    timestamp: showcaseSource.timestamp * 1000,
    budget: showcaseSource.budget,
    currency: showcaseSource.currency
      ? transformCurrencyAjax(showcaseSource.currency)
      : undefined,
    freelancerId: showcaseSource.freelancer_id,
    publishable: showcaseSource.publishable,
  };
}

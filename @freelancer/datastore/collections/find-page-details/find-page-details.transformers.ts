import { FindPageDetailsAjax } from './find-page-details.backend-model';
import { FindPageDetails } from './find-page-details.model';

export function transformFindPageDetails(
  response: FindPageDetailsAjax,
): FindPageDetails {
  return {
    id: response.original_url,
    seoUrl: response.canonical_url,
    header: response.header,
    subheader: response.subheader,
    subheaderDescription: response.subheaderDescription,
    footer: response.footer,
    metaWorker: response.metaWorker,
    categoryId: response.category_id,
  };
}

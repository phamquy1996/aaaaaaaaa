import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RecursivePartial,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { GlobalTagApi } from 'api-typings/common/common';
import { Tag } from '../tags/tags.model';
import {
  ShowcaseFilePostRawPayload,
  ShowcaseItemPostRawPayload,
  ShowcaseItemUpdateActionRawPayload,
} from './showcase.backend-model';
import { Showcase, ShowcaseFile, ShowcaseItem } from './showcase.model';
import { ShowcaseCollection } from './showcase.types';

export function showcaseBackend(): Backend<ShowcaseCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `users/0.1/showcases/`,
      params: {
        showcases: ids,
        users: getQueryParamValue(query, 'userId'),
        status: getQueryParamValue(query, 'status'),
        tags: getQueryParamValue(query, 'tagIds')[0],
        source_type: getQueryParamValue(query, 'sourceType')[0],
      },
    }),
    push: (_, showcase) => ({
      endpoint: `users/0.1/showcases/`,
      payload: {
        title: showcase.title,
        description: showcase.description,
        source: {
          source_type: showcase.sourceType,
          source_parent_id: showcase.sourceParentId,
        },
        budget: showcase.budget,
        currency: showcase.currency,
        status: showcase.status,
        showcase_items: showcase.showcaseItems.map(item =>
          createShowcaseItemPayload(item),
        ),
        tags: createTagsPayload(showcase),
        sourceUrl: showcase.sourceUrl,
        jobs: showcase.skills,
        custom_skills: showcase.customSkills,
      },
    }),
    set: undefined,
    update: (_, showcase, originalShowcase) => ({
      endpoint: `users/0.1/showcases/${originalShowcase.id}`,
      method: 'PUT',
      payload: {
        id: originalShowcase.id,
        title: showcase.title,
        description: showcase.description,
        user_id: showcase.userId,
        source: {
          source_type: showcase.sourceType,
          source_parent_id: showcase.sourceParentId,
        },
        budget: showcase.budget,
        currency: showcase.currency,
        hireme_count: showcase.hiremeCount,
        time_submitted: showcase.timeSubmitted,
        showcase_items: showcase.showcaseItems
          ? showcase.showcaseItems
              .filter(isDefined)
              .map(item =>
                createShowcaseItemUploadActionRawPayload(showcase, item),
              )
          : [],
        solution: showcase.solution,
        problem_statement: showcase.problemStatement,
        special_characteristic: showcase.specialCharacteristic,
        freelancer_experience: showcase.freelancerExperience,
        custom_skills: showcase.customSkills,
      },
    }),
    remove: (_, showcaseId, showcaseObject) => ({
      endpoint: `users/0.1/showcases/${showcaseId}`,
      method: 'DELETE',
      payload: {},
    }),
  };
}
function createShowcaseItemPayload(
  model: ShowcaseItem,
): ShowcaseItemPostRawPayload {
  return {
    item_file: createShowcaseItemFilePayload(model.itemFile),
    description: model.description,
    file_order: model.fileOrder,
    is_cover_item: model.isCoverItem,
  };
}
function createShowcaseItemFilePayload(
  model: ShowcaseFile,
): ShowcaseFilePostRawPayload {
  return {
    filename: model.filename,
    fileservice_file_id: model.fileserviceFileId,
  };
}
function createTagPayload(model: Tag): GlobalTagApi {
  return {
    id: model.id,
    is_category: model.isCategory,
    name: model.name,
    parent_id: model.parentId,
    seo_name: model.seoName,
    display_name: model.displayName,
    families: model.families,
  };
}
function createShowcaseItemUploadActionRawPayload(
  showcaseDelta: RecursivePartial<Showcase>,
  itemDelta: RecursivePartial<ShowcaseItem>,
): ShowcaseItemUpdateActionRawPayload {
  return {
    id: itemDelta.id,
    showcase_id: itemDelta.showcaseId,
    description: itemDelta.description,
    status: showcaseDelta.status,
    jobs: showcaseDelta.skills,
    url: showcaseDelta.sourceUrl,
    seo_url: showcaseDelta.showcaseUrl,
    tags: createTagsPayload(showcaseDelta as Showcase),
    quality_score: showcaseDelta.qualityScore,
    likes: showcaseDelta.likes,
    time_submitted: showcaseDelta.timeSubmitted,
    file_order: itemDelta.fileOrder,
    item_file: itemDelta.itemFile
      ? {
          filename: itemDelta.itemFile.filename,
          fileservice_file_id: itemDelta.itemFile.fileserviceFileId,
        }
      : undefined,
    is_cover_item: itemDelta.isCoverItem,
  };
}
export function createTagsPayload(
  showcase: Pick<Showcase, 'tags' | 'customTags'>,
): ReadonlyArray<GlobalTagApi> {
  const selectedTags: ReadonlyArray<GlobalTagApi> = showcase.tags.map(tag =>
    createTagPayload(tag),
  );

  const freeformTags: ReadonlyArray<GlobalTagApi> = showcase.customTags.map(
    customTag => ({
      name: customTag.name ? customTag.name.toLowerCase() : '',
      displayName: customTag.displayName,
      families: customTag.families
        ? customTag.families.map(family => ({
            id: 0,
            name: family && family.name ? family.name : '',
            question: '',
          }))
        : undefined,
    }),
  );

  return [...selectedTags, ...freeformTags];
}

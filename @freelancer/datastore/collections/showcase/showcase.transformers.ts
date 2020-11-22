import { RecursivePartial } from '@freelancer/datastore/core';
import { isImageFile } from '@freelancer/ui/helpers';
import { isDefined, toNumber } from '@freelancer/utils';
import {
  ShowcaseApi,
  ShowcaseFileApi,
  ShowcaseFileThumbnailApi,
  ShowcaseItemApi,
} from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { Tag } from '../tags/tags.model';
import { transformTag } from '../tags/tags.transformers';
import {
  Showcase,
  ShowcaseFile,
  ShowcaseFileThumbnail,
  ShowcaseItem,
} from './showcase.model';

export function transformShowcase(showcase: ShowcaseApi): Showcase {
  // TODO: T77293: Fix Showcase thrift models to remove the optional parameter.
  if (!showcase.id) {
    throw ReferenceError(`Showcase does not have id`);
  }
  if (!showcase.title) {
    throw ReferenceError(`Showcase does not have title`);
  }
  if (showcase.description === undefined) {
    throw ReferenceError(`Showcase does not have a description`);
  }
  if (!showcase.source) {
    throw ReferenceError(`Showcase does not have a source`);
  }
  if (showcase.budget === undefined) {
    throw ReferenceError(`Showcase does not have a budget`);
  }
  if (!showcase.currency) {
    throw ReferenceError(`Showcase does not have a currency`);
  }
  if (!showcase.user_id) {
    throw ReferenceError(`Showcase does not have a user_id`);
  }
  if (!showcase.showcase_items) {
    throw ReferenceError(`Showcase does not have showcase items`);
  }
  if (showcase.hireme_count === undefined) {
    throw ReferenceError(`Showcase does not have a hireme count`);
  }
  if (!showcase.source.source_type) {
    throw ReferenceError(`Showcase source has no source type`);
  }
  if (showcase.source.parent_source_id === undefined) {
    throw ReferenceError(`Showcase source has no parent source id`);
  }

  const coverItem =
    showcase.showcase_items.find(item => item.is_cover_item || false) ||
    showcase.showcase_items[0];

  if (!coverItem.status) {
    throw ReferenceError(`Showcase does not have a user_id`);
  }
  if (!coverItem.tags) {
    throw ReferenceError(`Showcase does not have tags`);
  }
  if (coverItem.url === undefined) {
    throw ReferenceError(`Showcase does not have a URL`);
  }
  if (coverItem.seo_url === undefined) {
    throw ReferenceError(`Showcase does not have an SEO URL`);
  }
  if (coverItem.likes === undefined) {
    throw ReferenceError(`Showcase does not have likes`);
  }
  if (coverItem.quality_score === undefined) {
    throw ReferenceError(`Showcase does not have quality score`);
  }
  if (!coverItem.jobs) {
    throw ReferenceError(`Showcase does not have jobs`);
  }
  if (!coverItem.time_submitted) {
    throw ReferenceError(`Showcase does not have a timestamp submission`);
  }
  if (!coverItem.item_file) {
    throw ReferenceError(`Showcase does not have an item file`);
  }

  const selectedTags: ReadonlyArray<Tag> = coverItem.tags
    .filter(tag => tag.id)
    .map(tag => transformTag(tag));
  const customTags: ReadonlyArray<RecursivePartial<Tag>> = coverItem.tags
    .filter(tag => !tag.id)
    .map(tag => ({ name: tag.name }))
    .filter(isDefined);
  const selectedSkills = coverItem.jobs.map(skill => transformSkill(skill));
  const customSkills = showcase.custom_skills || [];

  const showcaseItems = showcase.showcase_items
    .map(item => transformShowcaseItem(item))
    .sort(sortShowcaseItemByFileOrder);

  return {
    id: toNumber(showcase.id),
    title: showcase.title,
    description: showcase.description,
    sourceParentId: showcase.source.parent_source_id,
    sourceType: showcase.source.source_type,
    budget: showcase.budget,
    currency: transformCurrency(showcase.currency),
    userId: showcase.user_id,
    status: coverItem.status,
    showcaseItems,
    tags: selectedTags,
    tagIds: selectedTags.map(tag => tag.id),
    sourceUrl: coverItem.url,
    showcaseUrl: coverItem.seo_url,
    likes: coverItem.likes,
    qualityScore: coverItem.quality_score,
    hiremeCount: showcase.hireme_count,
    skills: selectedSkills,
    timeSubmitted: coverItem.time_submitted * 1000,
    lastUpdated: (showcase.last_updated ?? coverItem.time_submitted) * 1000,
    customSkills,
    customTags,
    coverItem: transformShowcaseItem(coverItem),
    solution: showcase.solution,
    problemStatement: showcase.problem_statement,
    specialCharacteristic: showcase.special_characteristic,
    freelancerExperience: showcase.freelancer_experience,
    portfolioItemPageSeoUrl: getPortfolioItemPageUrl(
      showcase.id,
      showcase.title,
    ),
  };
}

/*
 * FIXME: This should not be in the datastore, it should ideally be generated
 * from the backend, or at least pulled in as a library.
 */

/**
 * Returns a URL-friendly slug from any given string.
 * For example, "My favorites" returns "my-favorites"
 *
 * The logic is taken from the public gist here:
 * https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
 */
export function getSlugFromName(name: string) {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function getPortfolioItemPageUrl(id: number, title: string) {
  return `${id}-${getSlugFromName(title)}`;
}

export function transformShowcaseItem(
  showcaseItem: ShowcaseItemApi,
): ShowcaseItem {
  if (!showcaseItem.item_file) {
    throw ReferenceError(`Showcase item has no item file`);
  }
  if (!showcaseItem.id) {
    throw ReferenceError(`Showcase item has no id`);
  }

  return {
    id: showcaseItem.id,
    description: showcaseItem.description,
    itemFile: transformShowcaseFile(showcaseItem.item_file),
    showcaseId: showcaseItem.id,
    coverThumbnailUrl: getThumbnailUrl(showcaseItem.item_file),
    fileOrder: showcaseItem.file_order,
    isCoverItem: showcaseItem.is_cover_item || false,
  };
}

export function transformShowcaseFile(
  showcaseFile: ShowcaseFileApi,
): ShowcaseFile {
  if (!showcaseFile.filename) {
    throw ReferenceError(`Showcase file has no filename`);
  }
  if (!showcaseFile.fileservice_file_id) {
    throw ReferenceError(`Showcase file has no fileservice file ID`);
  }
  if (!showcaseFile.thumbnails) {
    throw ReferenceError(`Showcase file has no thumbnails`);
  }
  if (!showcaseFile.cdn_url) {
    throw ReferenceError(`Showcase file has no URL`);
  }

  return {
    filename: showcaseFile.filename,
    fileserviceFileId: showcaseFile.fileservice_file_id,
    thumbnails: transformShowcaseFileThumbnails(showcaseFile.thumbnails),
    url: showcaseFile.cdn_url,
  };
}

export function transformShowcaseFileThumbnails(thumbnail: {
  readonly [k: string]: ShowcaseFileThumbnailApi | undefined;
}): { readonly [key: string]: ShowcaseFileThumbnail } {
  return Object.entries(thumbnail).reduce(
    (transformedObject, [key, rawThumbnail]) =>
      rawThumbnail
        ? {
            ...transformedObject,
            [key]: transformThumbnail(rawThumbnail),
          }
        : transformedObject,
    {},
  );
}

function sortShowcaseItemByFileOrder(
  showcaseItem1: ShowcaseItem,
  showcaseItem2: ShowcaseItem,
) {
  if (
    showcaseItem1 &&
    showcaseItem2 &&
    showcaseItem1.fileOrder !== undefined &&
    showcaseItem2.fileOrder !== undefined &&
    showcaseItem1.fileOrder !== showcaseItem2.fileOrder
  ) {
    return showcaseItem1.fileOrder - showcaseItem2.fileOrder;
  }
  return showcaseItem1.id - showcaseItem2.id;
}

function transformThumbnail(
  thumbnail: ShowcaseFileThumbnailApi,
): ShowcaseFileThumbnail {
  return {
    filename: thumbnail.filename ? thumbnail.filename : '',
    fileserviceFileId: thumbnail.fileservice_file_id
      ? thumbnail.fileservice_file_id
      : 0,
    width: thumbnail.width,
    height: thumbnail.height,
    cdnUrl: thumbnail.cdn_url,
  };
}

function getThumbnailUrl(showcaseFile: ShowcaseFileApi): string | undefined {
  if (showcaseFile.thumbnails && showcaseFile.thumbnails.showcase) {
    const thumbnail: ShowcaseFileThumbnailApi =
      showcaseFile.thumbnails.blog_category || showcaseFile.thumbnails.showcase;
    return thumbnail.cdn_url;
  }
  return showcaseFile.filename && isImageFile(showcaseFile.filename)
    ? showcaseFile.cdn_url
    : undefined;
}

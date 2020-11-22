import {
  generateId,
  getNovelLine,
  getTitleText,
} from '@freelancer/datastore/testing';
import { HeadingColor } from '@freelancer/ui/heading';
import { phpSkill } from '../skills/skills.seed';
import {
  CategoryPageArticle,
  CategoryPageBanner,
  CategoryPageContent,
} from './category-page-content.model';

const ARTICLE_COUNT = 4;
const PORTFOLIO_COUNT = 8;

export interface GenerateCategoryPageContentOptions {
  readonly id?: number;
  readonly name: string;
  readonly seoUrl: string;
  readonly order?: number;
  readonly isDeleted?: boolean;
  readonly isPrivate?: boolean;
  readonly showcaseIds?: ReadonlyArray<number>;
  readonly freelancerIds?: ReadonlyArray<number>;
  readonly skillIds?: ReadonlyArray<number>;
  readonly heroBanner?: CategoryPageBanner;
  readonly heroBannerId?: number;
  readonly articleBanner?: CategoryPageBanner;
  readonly articles?: ReadonlyArray<CategoryPageArticle>;
}

/**
 * Returns a Category object for the Category Page.
 */
export function generateCategoryPageContent({
  id = generateId(),
  name,
  seoUrl,
  showcaseIds,
  skillIds,
  heroBanner = defaultBanner,
  articles,
  articleBanner = defaultBanner,
}: GenerateCategoryPageContentOptions): CategoryPageContent {
  const transformedShowcaseIds =
    showcaseIds !== undefined
      ? showcaseIds
      : [...new Array(PORTFOLIO_COUNT)].fill(generateId());

  const transformedArticles =
    articles !== undefined
      ? articles
      : [...new Array(ARTICLE_COUNT)].map((_, i) =>
          generateCategoryPageArticle({
            title: getTitleText(i),
            lead: getNovelLine('prideAndPrejudice', i),
          }),
        );

  const correctSkillIds = skillIds !== undefined ? skillIds : [generateId()];

  return {
    id,
    name,
    seoUrl,
    order: 0, // Unused in app code
    isDeleted: false, // Unused
    isPrivate: false, // Unused
    portfolioItemIds: transformedShowcaseIds,
    articles: transformedArticles,
    freelancerIds: [1], // Unused
    skillIds: correctSkillIds,
    heroBanner,
    bannerId: 1, // Unused
    articleBannerUrl: articleBanner,
  };
}

export function generateCategoryPageArticle({
  id = generateId(),
  title = getTitleText(0),
  canonicalUrl = '/articles/default-canonical-url',
  lead = getNovelLine('prideAndPrejudice', 0),
  readTime = 10,
  mobileThumbnail = defaultImageUrl,
  tabletThumbnail = defaultImageUrl,
  desktopThumbnail = defaultImageUrl,
} = {}): CategoryPageArticle {
  return {
    id,
    title,
    canonicalUrl,
    lead,
    readTime,
    mobileThumbnail,
    tabletThumbnail,
    desktopThumbnail,
  };
}

// Mixins
export function phpCategoryPage(): Pick<
  GenerateCategoryPageContentOptions,
  'name' | 'seoUrl' | 'skillIds'
> {
  return {
    name: 'php',
    seoUrl: 'php',
    skillIds: [phpSkill().id],
  };
}

// Default values
const defaultImageUrl = `assets/category-page/desktop-banner.jpg`;
const defaultBanner: CategoryPageBanner = {
  mobile: defaultImageUrl,
  tablet: defaultImageUrl,
  desktop: defaultImageUrl,
  cost: 100,
  description: 'This is the default category page banner',
  fontColor: HeadingColor.PRIMARY_PINK,
};

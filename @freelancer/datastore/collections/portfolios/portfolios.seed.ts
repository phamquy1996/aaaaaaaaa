import {
  generateId,
  getRandomText,
  getTitleText,
} from '@freelancer/datastore/testing';
import { ContentTypeApi } from 'api-typings/users/users';
import { phpSkill } from '../skills/skills.seed';
import {
  PortfolioFile,
  PortfolioFileThumbnail,
  PortfolioItem,
  PortolioArticleFile,
} from './portfolios.model';
import { transformPortfolioSeoTitle } from './portfolios.transformers';

export interface GeneratePortfoliosOptions {
  readonly userId: number;
  readonly numItems: number;
}

export function generatePortfolioObjects({
  userId,
  numItems = 5,
}: GeneratePortfoliosOptions): ReadonlyArray<PortfolioItem> {
  return Array(numItems)
    .fill(undefined)
    .map((_, i) => {
      const title = getTitleText(i);
      return {
        id: generateId(),
        userId,
        contentType: ContentTypeApi.PICTURE,
        description: getRandomText(),
        featured: false,
        files: [],
        articles: [],
        skillIds: [phpSkill().id],
        categories: [],
        title,
        seoTitle: transformPortfolioSeoTitle(userId, title),
        lastModifyDate: Date.now(),
      };
    });
}

export interface GeneratePortfolioOptions {
  readonly userId: number;
  readonly contentType?: ContentTypeApi;
  readonly description?: string;
  readonly featured?: boolean;
  readonly files?: ReadonlyArray<PortfolioFile>;
  readonly articles?: ReadonlyArray<PortolioArticleFile>;
  readonly skillIds?: ReadonlyArray<number>;
  readonly categories?: ReadonlyArray<number>;
  readonly title?: string;
  readonly seoTitle?: string;
  readonly lastModifyDate?: number;
}

export function generatePortfolioObject({
  userId,
  contentType = ContentTypeApi.PICTURE,
  description = 'This is an example of my work.',
  featured = false,
  files = [generatePortfolioFile()],
  articles = [],
  skillIds = [phpSkill().id],
  categories = [],
  title = 'A portfolio item',
  seoTitle = transformPortfolioSeoTitle(userId, title),
  lastModifyDate = Date.now(),
}: GeneratePortfolioOptions): PortfolioItem {
  return {
    id: generateId(),
    userId,
    contentType,
    description,
    featured,
    files,
    articles,
    skillIds,
    categories,
    title,
    seoTitle,
    lastModifyDate,
  };
}

export interface GeneratePortfolioFileOptions {
  readonly cdnUrl?: string;
  readonly description?: string;
  readonly filename?: string;
  readonly thumbnails?: ReadonlyArray<PortfolioFileThumbnail>;
}

export function generatePortfolioFile({
  cdnUrl = generatePortfolioFileUrl(0),
  description = 'Portfolio file 0',
  filename = 'portfolio-item-0.jpg',
  thumbnails,
}: GeneratePortfolioFileOptions = {}): PortfolioFile {
  const fileId = generateId();
  return {
    id: generateId(),
    cdnUrl,
    description,
    fileId,
    filename,
    thumbnails: thumbnails ?? [
      generatePortfolioFileThumbnail({ portfolioFileId: fileId }),
    ],
  };
}

export interface GeneratePortfolioFileThumbnailOptions {
  readonly portfolioFileId: number;
  readonly cdnUrl?: string;
  readonly height?: number;
  readonly width?: number;
}

function generatePortfolioFileThumbnail({
  portfolioFileId,
  cdnUrl = generatePortfolioFileUrl(0),
  width = 380,
  height = 285,
}: GeneratePortfolioFileThumbnailOptions): PortfolioFileThumbnail {
  return {
    portfolioFileId,
    cdnUrl,
    fileId: generateId(),
    filename: 'portfolio-item-thumb-0.jpg',
    height,
    width,
  };
}

export function generatePortfolioFileUrl(id: number, size = 100) {
  return `assets/portfolio/thumb-${id + 1}.jpg`;
}

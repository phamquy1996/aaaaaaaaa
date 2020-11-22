import {
  ContentTypeApi,
  PortfolioArticleSampleApi,
  PortfolioFileApi,
  PortfolioFileThumbnailApi,
  UserPortfolioItemApi,
} from 'api-typings/users/users';
import {
  PortfolioFile,
  PortfolioFileThumbnail,
  PortfolioItem,
  PortolioArticleFile,
} from './portfolios.model';

export function transformPortfolioItem(
  portfolioItem: UserPortfolioItemApi,
): PortfolioItem {
  if (!portfolioItem.last_modify_date) {
    throw Error('Portfolio item does not have a last modify date.');
  }
  return {
    contentType: portfolioItem.content_type
      ? portfolioItem.content_type
      : ContentTypeApi.OTHER,
    description: portfolioItem.description ? portfolioItem.description : '',
    featured: portfolioItem.featured ? portfolioItem.featured : false,
    files: portfolioItem.files
      ? portfolioItem.files.map(transformPortfolioFile)
      : [],
    articles: portfolioItem.articles
      ? portfolioItem.articles.map(transformPortfolioArticle)
      : [],
    id: portfolioItem.id,
    skillIds: portfolioItem.jobs ? portfolioItem.jobs : [],
    title: portfolioItem.title ? portfolioItem.title : '',
    userId: portfolioItem.user_id,
    categories: portfolioItem.categories ? portfolioItem.categories : [],
    seoTitle: transformPortfolioSeoTitle(portfolioItem.id, portfolioItem.title),
    lastModifyDate: portfolioItem.last_modify_date * 1000,
  };
}

export function transformPortfolioSeoTitle(id: number, title?: string): string {
  // If no title is given, only use the portfolio id as this is all the regex
  // looks for. The title is only used for seo purposes.
  if (!title) {
    return `${id}`;
  }

  // Taken from PortfolioHandler.php:146
  const safeTitle = title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');

  return `${safeTitle}-${id}`;
}

export function transformPortfolioFile(
  portfolioFile: PortfolioFileApi,
): PortfolioFile {
  return {
    cdnUrl: portfolioFile.cdn_url,
    description: portfolioFile.description ? portfolioFile.description : '',
    fileId: portfolioFile.file_id,
    filename: portfolioFile.filename,
    id: portfolioFile.id,
    thumbnails: portfolioFile.thumbnails
      ? portfolioFile.thumbnails.map(transformPortfolioFileThumbnail)
      : [],
  };
}

export function transformPortfolioFileThumbnail(
  thumbnail: PortfolioFileThumbnailApi,
): PortfolioFileThumbnail {
  return {
    cdnUrl: thumbnail.cdn_url,
    fileId: thumbnail.file_id,
    filename: thumbnail.filename,
    height: thumbnail.height,
    portfolioFileId: thumbnail.portfolio_file_id,
    width: thumbnail.width,
  };
}

export function transformPortfolioArticle(
  portfolioArticle: PortfolioArticleSampleApi,
): PortolioArticleFile {
  if (!portfolioArticle.id) {
    throw new Error('Portfolio article item has missing fields!');
  }
  return {
    id: portfolioArticle.id,
    title: portfolioArticle.title ? portfolioArticle.title : '',
    text: portfolioArticle.text ? portfolioArticle.text : '',
  };
}

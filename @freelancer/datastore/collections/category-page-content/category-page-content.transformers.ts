import {
  CategoryArticleAjax,
  CategoryArticleThumbnailAjax,
  CategoryPageContentAjax,
} from './category-page-content.backend-model';
import {
  CategoryPageBanner,
  CategoryPageContent,
  ContentHubArticleThumbnail,
} from './category-page-content.model';

export function transformCategoryPageContent(
  response: CategoryPageContentAjax,
): CategoryPageContent {
  const articles = response.articles.map(article => ({
    id: article.id,
    title: article.title,
    lead: article.lead,
    mobileThumbnail: getMobileThumbnail(article),
    tabletThumbnail: getTabletThumbnail(article),
    desktopThumbnail: getTabletThumbnail(article),
    canonicalUrl: article.canonical_url,
    readTime: article.read_time,
  }));

  const categoryPageHeroBanner: CategoryPageBanner = {
    mobile: response.hero_banner_urls.mobile_banner_url,
    tablet: response.hero_banner_urls.tablet_banner_url,
    desktop: response.hero_banner_urls.desktop_banner_url,
    fontColor: response.hero_banner_urls.font_color,
    description: response.hero_banner_urls.description,
    cost: response.hero_banner_urls.cost,
  };

  const articleBannerUrl: CategoryPageBanner = {
    mobile: response.article_banner_urls.mobile_banner_url,
    tablet: response.article_banner_urls.tablet_banner_url,
    desktop: response.article_banner_urls.desktop_banner_url,
  };

  return {
    id: response.id,
    name: response.name,
    seoUrl: response.seo_url,
    bannerId: response.discover_category_banner_id,
    heroBanner: categoryPageHeroBanner,
    order: response.order,
    portfolioItemIds: response.portfolio_item_ids,
    articles,
    freelancerIds: response.freelancer_ids,
    skillIds: response.skill_ids,
    isPrivate: response.is_private,
    isDeleted: response.deleted,
    articleBannerUrl,
  };
}

function getMobileThumbnail(article: CategoryArticleAjax): string {
  const thumbnails = transformContentHubThumbnails(
    article.cover_image_thumbnails,
  );
  if (thumbnails !== undefined) {
    const thumbnail =
      thumbnails.blog_category ||
      thumbnails.blog_homepage ||
      thumbnails.blog_cover;
    if (thumbnail) {
      return thumbnail.cdnUrl;
    }
  }
  return article.cover_image;
}

function getTabletThumbnail(article: CategoryArticleAjax): string {
  const thumbnails = transformContentHubThumbnails(
    article.cover_image_thumbnails,
  );
  if (thumbnails !== undefined) {
    const thumbnail = thumbnails.blog_homepage || thumbnails.blog_cover;
    if (thumbnail) {
      return thumbnail.cdnUrl;
    }
  }
  return article.cover_image;
}

function transformContentHubThumbnails(
  thumbnails?: {
    readonly [k in string]: CategoryArticleThumbnailAjax | undefined;
  },
): { readonly [key: string]: ContentHubArticleThumbnail } | undefined {
  if (thumbnails === undefined || Object.keys(thumbnails).length === 0) {
    return undefined;
  }

  return Object.entries(thumbnails).reduce(
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

function transformThumbnail(
  thumbnail: CategoryArticleThumbnailAjax,
): ContentHubArticleThumbnail {
  return {
    fileName: thumbnail.filename,
    fileId: thumbnail.file_id,
    cdnUrl: thumbnail.cdn_url,
    width: thumbnail.width,
    height: thumbnail.height,
  };
}

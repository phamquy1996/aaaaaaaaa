import {
  HirePageDetailsAjax,
  SeoSemArticleAjax,
  SimilarSkillsAjax,
} from './hire-page-details.backend-model';
import {
  HirePageDetails,
  SeoSemArticle,
  SimilarSkills,
} from './hire-page-details.model';

export function transformHirePageDetails(
  response: HirePageDetailsAjax,
): HirePageDetails {
  return {
    id: response.original_url,
    seoUrl: response.canonical_url,
    name: response.name,
    header: response.header,
    subheader: response.subheader ? response.subheader : undefined,
    seoTextHeader: response.seo_text_header
      ? response.seo_text_header
      : undefined,
    seoText: response.seo_text ? response.seo_text : [],
    skillDescription: response.skill_description
      ? response.skill_description
      : [],
    serviceDescription: response.service_description
      ? response.service_description
      : [],
    footer: response.footer ? response.footer : undefined,
    metaTitle: response.meta_title,
    metaDescription: response.meta_description,
    excludeAll: response.exclude_all,
    articles:
      response.articles && response.articles.length > 0
        ? transformSeoSemArticles(response.articles)
        : [],
    similarSkills:
      response.similar_skills && response.similar_skills.length > 0
        ? transformSimilarSkills(response.similar_skills)
        : [],
    categoryId: response.category_id,
  };
}

export function transformSeoSemArticles(
  articles: ReadonlyArray<SeoSemArticleAjax>,
): ReadonlyArray<SeoSemArticle> {
  return articles.map(article => ({
    id: article.id,
    title: article.title,
    description: article.description,
    url: article.full_url,
    readTime: article.read_time,
    coverPhoto: article.cover_photo,
  }));
}

export function transformSimilarSkills(
  similarSkills: ReadonlyArray<SimilarSkillsAjax>,
): ReadonlyArray<SimilarSkills> {
  return similarSkills.map(similarSkill => ({
    name: similarSkill.name,
    seoUrl: similarSkill.seo_url,
  }));
}

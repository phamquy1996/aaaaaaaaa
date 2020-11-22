import { ArticleApi } from 'api-typings/users/users';
import { Article } from './articles.model';

export function transformArticles(article: ArticleApi): Article {
  let categoryName: string;
  let categorySeoName: string;
  if (
    article.main_category &&
    article.main_category.name &&
    article.main_category.seo_name
  ) {
    categoryName = article.main_category.name;
    categorySeoName = article.main_category.seo_name;
  } else {
    throw new Error('Category name or seo name is not provided.');
  }
  return {
    id: article.id,
    userId: article.user_id,
    title: article.title,
    description: article.description,
    content: article.content,
    seoUrl: article.seo_url,
    createTime: article.time_created * 1000,
    updateTime: article.time_updated * 1000,
    type: article.article_type,
    state: article.state,
    mainCategory: {
      name: categoryName,
      seoName: categorySeoName,
    },
    language: article.language,
    globalTagCategoryId: article.global_tag_category_id,
    metaTitle: article.meta_title,
  };
}

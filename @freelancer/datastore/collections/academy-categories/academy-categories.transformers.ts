import { AcademyCategoryAjax } from './academy-categories.backend-model';
import { AcademyCategory } from './academy-categories.model';

export function transformAcademyCategory(
  courseCategory: AcademyCategoryAjax,
): AcademyCategory {
  return {
    id: courseCategory.id,
    code: courseCategory.code,
    name: courseCategory.display,
  };
}

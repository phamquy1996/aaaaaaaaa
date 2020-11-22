import { AcademyCourseAjax } from './academy-courses.backend-model';
import { AcademyCourse } from './academy-courses.model';

export function transformCourse(course: AcademyCourseAjax): AcademyCourse {
  return {
    id: course.id,
    instructorId: course.instructor_id,
    categoryId: course.category_id,
    priceTierId: course.price_tier_id,
    title: course.title,
    description: course.description,
    abstract: course.abstract,
    coverImage: course.cover_image,
    timeCreated: course.time_created * 1000,
    timeUpdated: course.time_updated ? course.time_updated * 1000 : undefined,
    enabled: course.enabled,
    studentCount: course.student_count,
    isDraft: course.is_draft,
    isClosed: course.is_closed,
    isDeleted: course.is_deleted,
    skillIds: course.skill_ids,
  };
}

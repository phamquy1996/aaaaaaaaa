import { AcademyLessonAjax } from './academy-lessons.backend-model';
import { AcademyLesson } from './academy-lessons.model';

export function transformLessons(lesson: AcademyLessonAjax): AcademyLesson {
  return {
    id: lesson.id,
    moduleId: lesson.module_id,
    title: lesson.title,
    order: lesson.order,
    typeId: lesson.type_id,
    content: lesson.content,
    duration: lesson.duration,
    timeCreated: lesson.time_created * 1000,
    timeUpdated: lesson.time_updated ? lesson.time_updated * 1000 : undefined,
    enabled: lesson.enabled,
    isEncodingDone: lesson.is_deleted,
    isDeleted: lesson.is_deleted,
  };
}

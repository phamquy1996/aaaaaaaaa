import { AcademyModuleAjax } from './academy-modules.backend-model';
import { AcademyModule } from './academy-modules.model';

export function transformModule(module: AcademyModuleAjax): AcademyModule {
  return {
    id: module.id,
    courseId: module.course_id,
    title: module.title,
    order: module.order,
    timeCreated: module.time_created * 1000,
    timeUpdated: module.time_updated ? module.time_updated * 1000 : undefined,
    enabled: module.enabled,
    isDeleted: module.is_deleted,
  };
}

import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import {
  AcademyCoursePutActions,
  AcademyCourseUpdateActionRawPayload,
} from './academy-courses.backend-model';
import { AcademyCoursesCollection } from './academy-courses.types';

function ensurePayloadIsUndefined(
  payload: AcademyCourseUpdateActionRawPayload | undefined,
) {
  if (payload) {
    throw new Error(`Cannot update two fields at once`);
  }
}

export function coursesBackend(): Backend<AcademyCoursesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'academy/getCourses.php',
      isGaf: true,
      params: {
        ids,
        instructorId: getQueryParamValue(query, 'instructorId')[0],
        categoryId: getQueryParamValue(query, 'categoryId')[0],
        isDraft: getQueryParamValue(query, 'isDraft').map(n => (n ? 1 : 0))[0],
        isClosed: getQueryParamValue(query, 'isClosed').map(n =>
          n ? 1 : 0,
        )[0],
        skillIds: 1, // boolean flag
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, course, originalCourse) => {
      let payload: AcademyCourseUpdateActionRawPayload | undefined;

      if (course.isDraft !== undefined) {
        payload = {
          id: toNumber(originalCourse.id),
          action: originalCourse.isDraft
            ? AcademyCoursePutActions.PUBLISH
            : AcademyCoursePutActions.UNPUBLISH,
        };
      }

      if (course.isClosed === true) {
        ensurePayloadIsUndefined(payload);

        payload = {
          id: toNumber(originalCourse.id),
          action: AcademyCoursePutActions.CLOSE,
        };
      }

      if (course.isDeleted === true) {
        ensurePayloadIsUndefined(payload);

        payload = {
          id: toNumber(originalCourse.id),
          action: AcademyCoursePutActions.DELETE,
        };
      }

      if (!payload) {
        payload = {
          id: toNumber(originalCourse.id),
          action: AcademyCoursePutActions.UPDATE,
          category_id: course.categoryId,
          price_tier_id: course.priceTierId,
          title: course.title,
          description: course.description,
          abstract: course.abstract,
          cover_image: course.coverImage,
          skill_ids: course.skillIds,
        };
      }

      return {
        endpoint: 'academy/updateCourse.php',
        payload,
        isGaf: true,
        method: 'PUT',
        asFormData: true,
      };
    },
    remove: undefined,
  };
}

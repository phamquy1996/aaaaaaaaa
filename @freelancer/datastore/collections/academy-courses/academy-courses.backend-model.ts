import { RecursivePartial } from '@freelancer/datastore/core';

export interface AcademyCourseAjax {
  readonly id: number;
  readonly instructor_id: number;
  readonly category_id: number;
  readonly price_tier_id: number;
  readonly title: string;
  readonly description?: string;
  readonly abstract?: string;
  readonly cover_image?: string;
  readonly time_created: number;
  readonly time_updated?: number;
  readonly enabled: boolean;
  readonly student_count: number;
  readonly is_draft: boolean;
  readonly is_closed: boolean;
  readonly is_deleted: boolean;
  readonly skill_ids?: ReadonlyArray<number>;
}

export type AcademyCoursesGetResultAjax = ReadonlyArray<AcademyCourseAjax>;

export interface AcademyCoursePostRawPayload {
  readonly category_id: number;
  readonly price_tier_id: number;
  readonly title: string;
  readonly description: string;
  readonly abstract: string;
  readonly cover_image: string;
  readonly skill_ids: ReadonlyArray<number>;
}

export enum AcademyCoursePutActions {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  CLOSE = 'close',
  DELETE = 'delete',
  UPDATE = 'update',
}

export type AcademyCourseUpdateActionRawPayload = {
  readonly action: AcademyCoursePutActions;
  readonly id: number;
} & RecursivePartial<AcademyCoursePostRawPayload>;

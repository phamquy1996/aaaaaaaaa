export enum JobClassifierCategory {
  LIKELY_PROJECT = 'likely_project',
  UNKNOWN = 'unknown',
  LIKELY_CONTEST = 'likely_contest',
}

export interface JobClassifierGetResult {
  readonly id: string;
  readonly jobs: ReadonlyArray<number>;
  readonly category: JobClassifierCategory;
}

export interface JobClassifierGetResultAjax {
  readonly [index: string]: JobClassifierGetResult;
}

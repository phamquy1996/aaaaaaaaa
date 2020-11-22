/**
 * Extra project fee information, used by the Award Modal.
 */
export interface ProjectFeeInfo {
  readonly id: number;
  readonly minByRate: number;
  readonly rate: number;
  readonly round: number;
  readonly tranType: string;
  readonly discount?: ProjectFeeInfoDiscount;
}

export enum ProjectFeeInfoDiscount {
  EASTER = 'easter_2018',
  BLACK_FRIDAY = 'black_friday_2017',
}

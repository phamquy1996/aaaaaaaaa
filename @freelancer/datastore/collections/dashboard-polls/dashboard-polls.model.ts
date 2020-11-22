import { PollAnswerPayload } from './dashboard-polls.backend-model';

/**
 * A poll displayed on the dashboard (https://www.freelancer.com/dashboard).
 */
export interface DashboardPoll {
  readonly id: string;
  readonly question: string;
  readonly pollAnswerType?: PollAnswerType;
  readonly options: ReadonlyArray<PollOption>;
  readonly answered: boolean;
  readonly hide?: boolean;
  readonly answer?: ReadonlyArray<PollAnswerPayload>;
}

export interface PollOption {
  readonly id: number;
  readonly pollId: string;
  readonly answer: string;
  readonly isOtherField: boolean;
  readonly orderId: string;
}

export enum PollAnswerType {
  RADIO = 'radio',
  INPUT = 'input',
  TEXT_AREA = 'text_area',
  CHECKBOX = 'checkbox',
}

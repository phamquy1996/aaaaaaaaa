export interface DashboardPollsResultAjax {
  readonly polls: ReadonlyArray<DashboardPollsBackendModel>;
}

export interface DashboardPollsBackendModel {
  readonly poll_id: string;
  readonly userdata_poll?: string;
  readonly question: string;
  readonly poll_type: PollTypeResponse;
  readonly answer_type: PollAnswerTypeResponse;
  readonly hide?: string;
  readonly answered?: string;
  readonly property_name?: string;
  readonly property_type?: string;
  readonly options: ReadonlyArray<PollOptionResponse>;
  readonly skipped?: number;
}

export interface PollOptionResponse {
  readonly id: string;
  readonly poll_id: string;
  readonly answer: string;
  readonly other: string;
  readonly order_id: string;
}

export enum PollTypeResponse {
  PLAIN = 'plain',
  SINGLE = 'single',
  TEXT = 'text',
}

export enum PollAnswerTypeResponse {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
}

export interface DashboardPollsUpdatePayload {
  readonly id: string;
  readonly hide?: boolean;
  readonly answers?: ReadonlyArray<PollAnswerPayload>;
  readonly answered?: boolean;
}

export interface PollAnswerPayload {
  readonly id: number;
  readonly extra?: string;
}

import { MessageBoardApi } from 'api-typings/contests/contests';

export enum ContestCommentUpdateAction {
  UNDELETE = 'undelete',
  EDIT = 'edit',
}

export interface ContestCommentsPostRawPayload {
  readonly board: MessageBoardApi;
  readonly comment: string;
  readonly contest_id?: number;
  readonly entry_id?: number;
  readonly parent_id?: number;
  readonly y_coordinate?: number;
  readonly x_coordinate?: number;
  readonly file_id?: number;
}

export interface ContestCommentUpdateRawPayload {
  readonly action: ContestCommentUpdateAction;
}

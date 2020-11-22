import { ThreadApi } from 'api-typings/messages/messages_types';

export enum CommentFeedUpdateActionType {
  READ = 'read',
}

export interface CommentFeedsPostRawPayload {
  readonly context_id: number;
  readonly context_type: string;
  readonly comment: string;
  readonly source?: string;
}

export interface CommentFeedUpdatePayload {
  readonly action: CommentFeedUpdateActionType;
  readonly comment_feeds: ReadonlyArray<number>;
}

export type CommentFeedsPostApiResponse = ThreadApi;

import { ContestCommentContextTypeApi } from 'api-typings/contests/contests';
/**
 * A contest comment used on the Contest View Page.
 * Depending on the context type, a comment can either be a contests' comment, an entry's comment, or an entry's annotation.
 */
export type ContestComment = ParentContestComment | ReplyContestComment;

interface BaseContestComment {
  readonly id: number;
  readonly contextType: ContestCommentContextTypeApi;
  readonly contextId: number;
  readonly comment: string;
  readonly isPrivate?: boolean;
  readonly fromUserId: number;
  readonly timestamp: number;
  readonly dateLastComment: number;
  readonly extraForPost?: {
    readonly contestId: number;
    readonly entryId?: number;
  };
  readonly isDeleted: boolean;
}

export interface ParentContestComment extends BaseContestComment {
  readonly type: ContestCommentType.PARENT;
  readonly parentId: undefined; // only for replies, but need this here to be able to use parentId in DS query
  readonly repliesCount: number;
  readonly annotationDetails?: {
    readonly annotationId: number;
    readonly coordinates: { readonly x: number; readonly y: number };
    readonly fileId: number;
  };
}

export interface ReplyContestComment extends BaseContestComment {
  readonly type: ContestCommentType.REPLY;
  readonly parentId: number;
  readonly toUserId: number;
}

export enum ContestCommentType {
  PARENT = 'parent',
  REPLY = 'reply',
}

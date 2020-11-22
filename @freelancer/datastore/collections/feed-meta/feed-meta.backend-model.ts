export enum FeedMetaUpdateActionType {
  READ = 'read',
}

export interface FeedMetaUpdatePayload {
  readonly action: FeedMetaUpdateActionType;
}

import { ProjectUpgradeOptionsApi } from 'api-typings/projects/projects';

export type ProjectUpdateActionRawPayload =
  | {
      readonly action: Exclude<ProjectAction, ProjectAction.UPGRADE>;
    }
  | {
      readonly action: ProjectAction.UPGRADE;
      readonly 'upgrades[]': ReadonlyArray<ProjectUpgradeOptionsApi>;
    }
  | {
      readonly action: ProjectAction.UPDATE;
      readonly billing_code: string;
    };

export enum ProjectAction {
  SIGN_NDA = 'sign_nda',
  UPGRADE = 'upgrade',
  UPDATE = 'update',
  SET_LOCATION = 'set_location',
  CLOSE = 'close',
  ADD_ATTACHMENT = 'add_attachment',
  END = 'end',
  END_BIDDING = 'end_bidding',
}

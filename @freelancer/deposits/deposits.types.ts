import {
  ThreeDSChallengeFlowContext,
  ThreeDSIdentifyFlowContext,
  ThreeDSRedirectFlowContext,
} from './deposits.model';

export type ThreeDSContext =
  | ThreeDSRedirectFlowContext
  | ThreeDSIdentifyFlowContext
  | ThreeDSChallengeFlowContext;

/**
 * 3DS messages types posted from popup window
 */
export enum ThreeDSMessageType {
  TRIGGER = 'breakTo3ds',
  RETURN = 'returnFrom3DS',
}

/**
 * States to indicate the current 3DS flow
 */
export enum ThreeDSState {
  REDIRECT = 'redirect',
  IDENTIFY = 'identify',
  CHALLENGE = 'challenge',
}

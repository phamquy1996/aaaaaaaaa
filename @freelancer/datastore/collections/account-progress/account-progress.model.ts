export enum AccountProgressKeyPrefix {
  BOTH = 'b',
  EMPLOYER = 'e',
  FREELANCER = 'f',
}

export enum AccountProgressKey {
  EMAIL_VERIFIED = '_veri',
  ADD_ADDRESS = '_a',
  ADD_PHONE_NUMBER = '_p',
  ADD_FULL_NAME = '_fn',
  RECEIVE_POSITIVE_FEEDBACK = '_rpf',
  RECEIVE_POSITIVE_FEEDBACK_WORKING = '_rpfw',
  RECEIVE_POSITIVE_FEEDBACK_POSTING = '_rpfp',
  RECEIVE_THREE_POSITIVE_FEEDBACK = '_g3pf',
  EMPLOYER_ORIENTATION_EXAM = '_fe',
  INVITE_FIVE_FRIENDS = '_i5f',
  PAYMENT_VERIFIED = '_vpm',
  ASK_FRIENDS_SIGNUP = '_al2s',
  RECEIVE_COMMISSION = '_rc',
  ADD_SKILLS = '_s',
  ADD_AVERAGE_HOURLY_RATE = '_ahr',
  PASS_ENGLISH_EXAM = '_el1',
  PASS_FOUR_EXAMS = '_p2oe',
  ADD_LOCATION = '_loc',
  ADD_PROFILE_SUMMARY = '_sum_hl',
  COMPLETE_RESUME = '_cv',
  ADD_PORTFOLIO = '_portfolio',
  COMPLETE_FREELANCER_PROFILE = '_cp',
  PASS_ORIENTATION_EXAM = '_toe',
  GIVE_FACEBOOK_LIKE = '_lf',
  ADD_PROFILE_PICTURE = '_pp',
  PROFILE_COMPLETED = 'completed',
}

/**
 * Represents how much progress a user has made towards completing their
 * account details (verification, profile information, etc.).
 * Primarily used on the dashboard My Profile widget.
 */
export interface AccountProgress {
  readonly id: AccountProgressKey;
  readonly prefix: AccountProgressKeyPrefix;
  readonly verificationCode?: string;
  readonly currentProgress: number;
  readonly progressGain: number;
  readonly profileCompleted: boolean;
}

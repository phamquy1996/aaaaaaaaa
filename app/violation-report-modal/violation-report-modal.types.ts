import {
  ViolationReportAdditionalReasonApi,
  ViolationReportContextTypeApi,
  ViolationReportReasonApi,
} from 'api-typings/users/users';

export enum ViolationReportReasonText {
  COPIED_WORK_FROM_USER = 'They copied my work',
  COPIED_WORK_FROM_SOMEONE_ELSE = 'They copied work from another source',
  WORK_DOES_NOT_MATCH_REQUIREMENTS = 'Work does not match requirements',
  EXPLICIT_OR_INAPPROPRIATE_CONTENT = 'Submitted explicit or inappropriate content',
  LOW_QUALITY_WORK = 'Low-quality work',
  PUBLIC_DISPLAY_OF_COMMUNICATION_DETAILS = 'They are publicly displaying their contact information',
  INAPPROPRIATE_LANGUAGE = 'They have been using inappropriate language',
  DOES_NOT_MATCH_PROJECT_DESCRIPTION = 'Bidder did not read project description',
  DOES_NOT_PROVIDE_ENOUGH_INFORMATION = 'Unclear or does not provide enough information',
  CONTAINS_CONTACT_INFORMATION = 'Contains contact information',
  ADVERTISING_ANOTHER_WEBSITE = 'Advertising another website',
  FAKE_PROJECT_POSTED = 'Fake project posted',
  OBSCENITIES_OR_HARASSING_BEHAVIOUR = 'Obscenities or harassing behaviour',
  NON_FULLTIME_PROJECT = 'Non-full time project posted requiring abnormal bidding',
  OTHER = 'Other',
}

export enum ReportStep {
  REASON = 1,
  DESCRIPTION = 2,
  SUCCESS = 3,
}

export interface ViolationReportDetails {
  readonly violatorUserId: number;
  readonly contextId: number;
  readonly contextType: ViolationReportContextTypeApi;
}

type ViolationReasonMapping = {
  readonly [key in ViolationReportReasonText]: {
    readonly reason: ViolationReportReasonApi;
    readonly additionalReason: ViolationReportAdditionalReasonApi;
  };
};

export const VIOLATION_REASON_TEXT_MAPPING: ViolationReasonMapping = {
  [ViolationReportReasonText.OTHER]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.PUBLIC_DISPLAY_OF_COMMUNICATION_DETAILS]: {
    reason: ViolationReportReasonApi.CONTACTS,
    additionalReason:
      ViolationReportAdditionalReasonApi.PUBLIC_DISPLAY_OF_COMMUNICATION_DETAILS,
  },
  [ViolationReportReasonText.EXPLICIT_OR_INAPPROPRIATE_CONTENT]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason:
      ViolationReportAdditionalReasonApi.EXPLICIT_OR_INAPPROPRIATE_CONTENT,
  },
  [ViolationReportReasonText.COPIED_WORK_FROM_USER]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason: ViolationReportAdditionalReasonApi.COPIED_WORK_FROM_USER,
  },
  [ViolationReportReasonText.COPIED_WORK_FROM_SOMEONE_ELSE]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason:
      ViolationReportAdditionalReasonApi.COPIED_WORK_FROM_SOMEONE_ELSE,
  },
  [ViolationReportReasonText.WORK_DOES_NOT_MATCH_REQUIREMENTS]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason:
      ViolationReportAdditionalReasonApi.WORK_DOES_NOT_MATCH_REQUIREMENTS,
  },
  [ViolationReportReasonText.LOW_QUALITY_WORK]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason: ViolationReportAdditionalReasonApi.LOW_QUALITY_WORK,
  },
  [ViolationReportReasonText.INAPPROPRIATE_LANGUAGE]: {
    reason: ViolationReportReasonApi.OTHER,
    additionalReason: ViolationReportAdditionalReasonApi.INAPPROPRIATE_LANGUAGE,
  },
  [ViolationReportReasonText.DOES_NOT_MATCH_PROJECT_DESCRIPTION]: {
    reason: ViolationReportReasonApi.FAKE,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.DOES_NOT_PROVIDE_ENOUGH_INFORMATION]: {
    reason: ViolationReportReasonApi.FAKE,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.CONTAINS_CONTACT_INFORMATION]: {
    reason: ViolationReportReasonApi.CONTACTS,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.ADVERTISING_ANOTHER_WEBSITE]: {
    reason: ViolationReportReasonApi.ADVERTISING,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.FAKE_PROJECT_POSTED]: {
    reason: ViolationReportReasonApi.FAKE,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.OBSCENITIES_OR_HARASSING_BEHAVIOUR]: {
    reason: ViolationReportReasonApi.HARASSMENT,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
  [ViolationReportReasonText.NON_FULLTIME_PROJECT]: {
    reason: ViolationReportReasonApi.NONFEATURED,
    additionalReason: ViolationReportAdditionalReasonApi.OTHER,
  },
};

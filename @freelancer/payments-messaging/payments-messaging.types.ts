import { PictureImage } from '@freelancer/ui/picture';

export enum PaymentsErrorType {
  ERROR = 'error', // Payments errors
  ERROR_AUTH = 'error_auth', // Auth issues
  ERROR_INIT = 'error_init', // Error on page load
  ERROR_UNKNOWN = 'error_unknown', // Unhandled exceptioins
  ERROR_DATASTORE = 'error_datastore', // Datastore errors
}

export enum PaymentsEventType {
  INITIALIZED = 'initialized', // site is ready to go
  CLOSE_OVERLAY = 'close_overlay', // event to close an overlay
}

export enum PaymentsResultStatus {
  SUCCESS = 'success',
  PENDING = 'pending', // Pending Paymentss
  INTERRUPTED = 'interrupted', // Payments action cancelled
  REDIRECT = 'redirect', // From modal - redirecting to Payments page
}

export enum PaymentMethod {
  PM_CC_RECURRING = 'cc_recurring',
  PM_PAYPAL_RECURRING = 'paypal_recurring',
  PM_CC_FIRST_TIME = 'cc_first_time',
  PM_PAYPAL_FIRST_TIME = 'paypal_first_time',
}

export interface PaymentsProcessError {
  errorType:
    | PaymentsErrorType.ERROR
    | PaymentsErrorType.ERROR_AUTH
    | PaymentsErrorType.ERROR_INIT
    | PaymentsErrorType.ERROR_UNKNOWN;
  cta?: string;
  ctaLink?: string;
  // TODO: errorCode & errorMessage should be related, probs one is enough
  errorCode?: string;
  errorMessage?: string;
  eventId?: string;
  paymentMethod?: string; // For displaying a better error msg.
}

export interface PaymentsDatastoreError {
  errorType: PaymentsErrorType.ERROR_DATASTORE;
  errorCode: string;
  retry(): void;
}

export type PaymentsError = PaymentsProcessError | PaymentsDatastoreError;

// These boys are used for internal event communication
// where we don't care about message, just about the type of event
export interface PaymentsEvent {
  eventType: PaymentsEventType;
}

// Use this type after user attempted a Payments and it didn't return an error
export interface PaymentsResult {
  paymentsStatus: PaymentsResultStatus;
  cta?: string;
  ctaLink?: string;
  paymentsMessage?: string;
}

export enum OverlayTypes {
  BACKEND_ERROR,
  CC_3DS,
  CC_CAPTCHA,
  DEPOSIT_SUCCESS,
  EXTERNAL_POPUP,
  VERIFICATION_SUCCESS,
}

// This one is emitted when we want to display an overlay.
export interface PaymentsOverlay {
  brand?: PictureImage;
  ctaAction: Function;
  onClose?: Function;
  overlayType: OverlayTypes;
}

// messages to be transmitted over PaymentsOverlay subject pipe
export enum PaymentsOverlayAction {
  CLOSE,
}

export type PaymentsMessage =
  | PaymentsOverlay
  | PaymentsResult
  | PaymentsEvent
  | PaymentsError;

export function isPaymentsEvent(
  paymentsResult: PaymentsMessage,
): paymentsResult is PaymentsEvent {
  return (paymentsResult as PaymentsEvent).eventType !== undefined;
}

export function isPaymentsResult(
  paymentsResult: PaymentsMessage,
): paymentsResult is PaymentsResult {
  return (paymentsResult as PaymentsResult).paymentsStatus !== undefined;
}

export function isPaymentsOverlay(
  paymentsResult: PaymentsMessage,
): paymentsResult is PaymentsOverlay {
  return (paymentsResult as PaymentsOverlay).overlayType !== undefined;
}

export function isPaymentsError(
  paymentsResult: PaymentsMessage,
): paymentsResult is PaymentsError {
  return (paymentsResult as PaymentsError).errorType !== undefined;
}

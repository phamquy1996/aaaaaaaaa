/**
 * Possible error codes from Sign in with Apple
 * https://developer.apple.com/documentation/authenticationservices/asauthorizationerror/code
 */
export enum AppleSignInError {
  UNKNOWN = 'apple_unknown',
  CANCELED = 'apple_canceled',
  INVALID = 'apple_invalid',
  NOT_HANDLED = 'apple_not_handled',
  FAILED = 'apple_failed',
}

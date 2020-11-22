export interface FacebookConfig {
  appId?: string;
}

// define custom types to bridge the difference
// between the Capacitor plugin and Facebook SDK
export interface FacebookLoginResponse {
  status: string;
  authResponse?: FacebookAuthResponse;
}

export interface FacebookAuthResponse {
  accessToken: string;
  signedRequest?: string;
  userID: string;
}

export enum FacebookSignInError {
  UNKNOWN = 'facebook_unknown',
  EXPIRED = 'facebook_expired',
  NOT_AUTHORIZED = 'facebook_not_authorized',
  CANCELED = 'facebook_canceled',
}

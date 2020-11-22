export enum UserEmailRequestStatusAjax {
  CANCELED = 'canceled',
  PENDING = 'pending',
  VERIFIED = 'verified',
}

export interface UserEmailRequestAjax {
  readonly id: number;
  readonly email: string;
  readonly ip_address: string;
  readonly status: UserEmailRequestStatusAjax;
}

export interface UserEmailRequestGetResultAjax {
  readonly email_requests: ReadonlyArray<UserEmailRequestAjax>;
  readonly allow_passwordless_change: boolean;
}

export type UserEmailRequestPostResultAjax = UserEmailRequestAjax;

export interface UserEmailRequestDeleteResultAjax {
  readonly id: number;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { RoleApi } from 'api-typings/common/common';
import { LoginOrSignup } from './login-signup-modal.model';

@Component({
  selector: 'app-login-signup-modal',
  template: `
    <app-login
      *ngIf="form === LoginOrSignup.LOGIN"
      flTrackingSection="FreelancerLoginModal"
      [isModal]="true"
      [subHeader]="loginSubHeader"
      (switchToSignup)="switchPage(LoginOrSignup.SIGNUP)"
      (success)="handleSuccess($event)"
    ></app-login>
    <app-signup
      *ngIf="form === LoginOrSignup.SIGNUP"
      flTrackingSection="FreelancerSignupModal"
      [forceAccountType]="forceAccountType"
      [isModal]="true"
      [partnerDomain]="partnerDomain"
      (switchToLogin)="switchPage(LoginOrSignup.LOGIN)"
      (success)="handleSuccess($event)"
    ></app-signup>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginSignupModalComponent {
  LoginOrSignup = LoginOrSignup;

  @Input() forceAccountType?: RoleApi;
  @Input() form: LoginOrSignup = LoginOrSignup.LOGIN;
  @Input() loginSubHeader?: string;
  @Input() partnerDomain = 'Freelancer';

  constructor(private modalRef: ModalRef<LoginSignupModalComponent>) {}

  switchPage(form: LoginOrSignup) {
    this.form = form;
  }

  handleSuccess(user: number) {
    this.modalRef.close(user);
  }
}

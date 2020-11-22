import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalRef } from '@freelancer/ui';

type LoginOrSignup = 'login' | 'signup';
export type ModalSource = 'pjp' | 'zero-commission';

@Component({
  selector: 'app-arrow-login-signup-modal',
  template: `
    <app-arrow-login
      *ngIf="form === 'login'"
      [isModal]="true"
      (switchToSignup)="switchPage('signup')"
      (success)="handleSuccess($event)"
    ></app-arrow-login>
    <app-arrow-signup
      *ngIf="form === 'signup'"
      [enableLoginSignupSwitch]="enableLoginSignupSwitch"
      [isModal]="true"
      [modalSource]="modalSource"
      (switchToLogin)="switchPage('login')"
      (success)="handleSuccess($event)"
    ></app-arrow-signup>
  `,
  styleUrls: ['./arrow-login-signup-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowLoginSignupModalComponent {
  @Input() modalSource?: ModalSource;
  @Input() form: LoginOrSignup = 'login';
  @Input() enableLoginSignupSwitch = true;

  constructor(private modalRef: ModalRef<ArrowLoginSignupModalComponent>) {}

  switchPage(form: LoginOrSignup) {
    this.form = form;
  }

  handleSuccess(user: number) {
    this.modalRef.close(user);
  }
}

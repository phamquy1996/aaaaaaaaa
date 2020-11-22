import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ResponseData } from '@freelancer/datastore';
import { LogoSize } from '@freelancer/ui/logo';
import { pattern, required, validEmailRegex } from '@freelancer/ui/validators';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ResetPasswordInterface } from './reset-password.interface';

enum ResetPasswordStep {
  FORM = 0,
  SUCCESS,
}

@Component({
  selector: 'app-reset-password',
  template: `
    <app-reset-password-form
      *ngIf="currentStep === ResetPasswordStep.FORM"
      [logoSize]="logoSize"
      [domain]="domain"
      [formGroup]="formGroup"
      [freelancerBranding]="freelancerBranding"
      [response]="resetPasswordPromise && (resetPasswordPromise | async)"
      (back)="exitResetPasswordFlow()"
      (complete)="handleResetPassword()"
    ></app-reset-password-form>

    <app-reset-password-success
      *ngIf="currentStep === ResetPasswordStep.SUCCESS"
      [logoSize]="logoSize"
      [domain]="domain"
      [email]="formGroup.get('email')?.value"
      [freelancerBranding]="freelancerBranding"
      (back)="handleNextStep(ResetPasswordStep.FORM)"
      (complete)="exitResetPasswordFlow()"
    ></app-reset-password-success>
  `,
})
export class ResetPasswordComponent {
  ResetPasswordStep = ResetPasswordStep;

  @Input() freelancerBranding = false;
  @Input() logoSize = LogoSize.MID;
  @Input() domain?: string;
  @Input() resetService: ResetPasswordInterface;
  @Output() back = new EventEmitter();
  @Input() set email(value: string | null) {
    if (value !== null && validEmailRegex.exec(value)) {
      this.formGroup.setValue({ email: value });
    }
  }

  currentStep = ResetPasswordStep.FORM;
  resetPasswordPromise: Promise<
    ResponseData<undefined, ErrorCodeApi | 'UNKNOWN_ERROR'>
  >;

  formGroup = this.formBuilder.group({
    email: [
      null,
      [
        required($localize`Please enter your email address.`),
        pattern(
          validEmailRegex,
          $localize`Please enter a valid email address.`,
        ),
      ],
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  handleNextStep(nextStep: ResetPasswordStep) {
    this.currentStep = nextStep;
    this.changeDetectorRef.markForCheck();
  }

  handleResetPassword() {
    if (this.resetService) {
      this.resetPasswordPromise = this.resetService
        .resetPassword(this.formGroup.value.email)
        .then(response => {
          if (response.status === 'success') {
            this.handleNextStep(ResetPasswordStep.SUCCESS);
          }
          return response;
        });
    }
  }

  exitResetPasswordFlow() {
    this.back.emit();
  }
}

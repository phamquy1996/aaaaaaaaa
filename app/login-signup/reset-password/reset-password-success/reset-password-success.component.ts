import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-reset-password-success',
  template: `
    <app-form-logo
      [showBackButton]="true"
      [backTrackingLabel]="'ResetPasswordSuccess-BackLink'"
      [size]="logoSize"
      [forceFreelancerBranding]="freelancerBranding"
      [flMarginBottom]="Margin.MID"
      (back)="back.emit()"
    ></app-form-logo>
    <fl-bit class="Content">
      <fl-heading
        class="Content-heading"
        i18n="Reset password form heading"
        [flMarginBottom]="Margin.SMALL"
        [headingType]="HeadingType.H1"
        [size]="TextSize.MID"
      >
        Password Sent
      </fl-heading>
      <fl-text
        class="Content-subHeading"
        i18n="Reset password instructions"
        [flMarginBottom]="Margin.MID"
        [textAlign]="TextAlign.CENTER"
      >
        An email has been sent to
        <fl-text [weight]="FontWeight.BOLD" [fontType]="FontType.SPAN">{{
          email
        }}</fl-text
        >. If this email address is registered<fl-text
          *ngIf="domain"
          [fontType]="FontType.SPAN"
        >
          to {{ domain }}</fl-text
        >, you'll receive instructions on how to set a new password.
      </fl-text>
      <fl-bit
        class="Content-retryResetPasswordLink"
        [flMarginBottom]="Margin.LARGE"
      >
        <fl-link
          flTrackingLabel="ResetPasswordSuccess-Retry"
          i18n="Link to reset password form"
          (click)="onBack()"
        >
          Didn't get an email?
        </fl-link>
      </fl-bit>
      <app-login-signup-button
        i18n="Link to enter new password"
        [stepLabel]="'ResetPasswordSuccess'"
        [freelancerBranding]="freelancerBranding"
        (click)="onComplete()"
      >
        Enter new password
      </app-login-signup-button>
    </fl-bit>
  `,
  styleUrls: ['./reset-password-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordSuccessComponent {
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  LogoSize = LogoSize;
  Margin = Margin;
  TextAlign = TextAlign;

  @Input() logoSize = LogoSize.MID;
  @Input() freelancerBranding = false;
  @Input() domain?: string;
  @Input() email: string;
  @Output() back = new EventEmitter();
  @Output() complete = new EventEmitter();

  onBack() {
    this.back.emit();
  }

  onComplete() {
    this.complete.emit();
  }
}

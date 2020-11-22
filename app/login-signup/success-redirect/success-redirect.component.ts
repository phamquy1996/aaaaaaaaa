import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { TextAlign, TextSize } from '@freelancer/ui/text';

export enum SuccessAction {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

@Component({
  selector: 'app-success-redirect',
  template: `
    <app-form-logo
      [size]="logoSize"
      [flMarginBottom]="Margin.MID"
    ></app-form-logo>
    <fl-bit class="Success-message">
      <fl-heading
        [headingType]="HeadingType.H1"
        [ngSwitch]="action"
        [size]="TextSize.LARGE"
        [flMarginBottom]="Margin.SMALL"
      >
        <ng-container
          *ngSwitchCase="SuccessAction.LOGIN"
          i18n="Login success step heading"
        >
          Login Success!
        </ng-container>
        <ng-container
          *ngSwitchCase="SuccessAction.SIGNUP"
          i18n="Signup success step heading"
        >
          Signup Success!
        </ng-container>
      </fl-heading>
      <fl-text
        i18n="Redirection notice subheading"
        [size]="TextSize.SMALL"
        [flMarginBottom]="Margin.LARGE"
        [textAlign]="TextAlign.CENTER"
      >
        Please wait while we redirect you...
      </fl-text>
      <fl-spinner
        flTrackingLabel="SuccessRedirect-Spinner"
        [size]="SpinnerSize.LARGE"
      ></fl-spinner>
    </fl-bit>
  `,
  styleUrls: ['./success-redirect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessRedirectComponent {
  TextSize = TextSize;
  HeadingType = HeadingType;
  LogoSize = LogoSize;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  SuccessAction = SuccessAction;
  TextAlign = TextAlign;

  @Input() logoSize = LogoSize.MID;
  @Input() action: SuccessAction;
}

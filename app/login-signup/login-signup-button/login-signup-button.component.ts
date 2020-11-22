import { Component, Input } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';

@Component({
  selector: 'app-login-signup-button',
  template: `
    <fl-button
      [ngClass]="{
        LoginSignupButton: !freelancerBranding,
        FreelancerLoginSignupButton: freelancerBranding
      }"
      [submit]="true"
      [busy]="busy"
      [color]="ButtonColor.CUSTOM"
      [display]="'block'"
      [disabled]="disabled"
      [flTrackingLabel]="
        stepLabel ? stepLabel + '-LoginSignupButton' : 'LoginSignupButton'
      "
      [size]="ButtonSize.LARGE"
    >
      <ng-content></ng-content>
    </fl-button>
  `,
  styleUrls: ['./login-signup-button.component.scss'],
})
export class LoginSignupButtonComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  Margin = Margin;
  TextAlign = TextAlign;

  @Input() freelancerBranding = false;
  @Input() busy = false;
  @Input() disabled = false;
  @Input() stepLabel = '';
}

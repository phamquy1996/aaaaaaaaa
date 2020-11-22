import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';

@Component({
  selector: 'app-apple-button',
  template: `
    <fl-button
      class="AppleButton"
      [busy]="busy"
      [color]="ButtonColor.CUSTOM"
      [disabled]="disabled"
      [flTrackingLabel]="stepLabel ? stepLabel + '-AppleButton' : 'AppleButton'"
      [size]="ButtonSize.LARGE"
    >
      <fl-bit class="AppleButton-wrapper">
        <fl-picture
          *ngIf="!busy"
          alt="Apple logo"
          i18n-alt="Apple logo alt"
          [display]="PictureDisplay.BLOCK"
          [flMarginRight]="Margin.XXSMALL"
          [src]="'/apple/apple-logo-white-medium.svg'"
        ></fl-picture>
        <ng-content></ng-content>
      </fl-bit>
    </fl-button>
  `,
  styleUrls: ['./apple-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppleButtonComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  Margin = Margin;
  PictureDisplay = PictureDisplay;

  @HostBinding('class.IsBusy')
  @Input()
  busy = false;

  @HostBinding('class.IsDisabled')
  @Input()
  disabled = false;

  @Input() stepLabel = '';
}

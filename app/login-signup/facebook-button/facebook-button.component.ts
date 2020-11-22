import { Component, HostBinding, Input } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-facebook-button',
  template: `
    <fl-button
      class="FacebookButton"
      [busy]="busy"
      [color]="ButtonColor.CUSTOM"
      [display]="'flex'"
      [disabled]="disabled"
      [flTrackingLabel]="
        stepLabel ? stepLabel + '-FacebookButton' : 'FacebookButton'
      "
      [size]="ButtonSize.LARGE"
    >
      <fl-bit class="FacebookButton-wrapper">
        <fl-picture
          class="FacebookButton-icon"
          alt="Facebook icon"
          i18n-alt="Facebook icon alt"
          [src]="'/facebook/facebook-icon-white-2019.png'"
          [flMarginRight]="Margin.XSMALL"
          [objectFit]="PictureObjectFit.CONTAIN"
        ></fl-picture>
        <ng-content></ng-content>
      </fl-bit>
    </fl-button>
  `,
  styleUrls: ['./facebook-button.component.scss'],
})
export class FacebookButtonComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  Margin = Margin;
  PictureObjectFit = PictureObjectFit;

  @HostBinding('class.Busy')
  @Input()
  busy = false;
  @HostBinding('class.Disabled')
  @Input()
  disabled = false;
  @Input() stepLabel = '';
}

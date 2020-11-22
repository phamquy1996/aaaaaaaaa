import { Component, EventEmitter, Output } from '@angular/core';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';

@Component({
  selector: 'app-error-alert',
  template: `
    <fl-bit>
      <fl-bit class="CloseButton">
        <fl-button
          flTrackingLabel="closeErrorAlert"
          (click)="closeErrorAlert()"
        >
          <fl-icon
            [color]="IconColor.MID"
            [size]="IconSize.SMALL"
            [hoverColor]="HoverColor.PRIMARY"
            name="ui-close"
            i18n-label="Chatbox error alert icon label"
            label="Hide"
          ></fl-icon>
        </fl-button>
      </fl-bit>
      <fl-bit class="ErrorString">
        <ng-content></ng-content>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./error-alert.component.scss'],
})
export class ErrorAlertComponent {
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;

  @Output() close = new EventEmitter();

  closeErrorAlert() {
    this.close.emit();
  }
}

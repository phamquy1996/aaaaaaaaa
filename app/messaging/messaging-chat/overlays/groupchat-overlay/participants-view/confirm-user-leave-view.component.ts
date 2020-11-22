import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ButtonColor } from '@freelancer/ui/button';

@Component({
  selector: 'app-confirm-user-leave-view',
  template: `
    <app-overlay-content i18n="Chatbox groupchat leave body">
      Are you sure you want to leave this chat?
    </app-overlay-content>

    <app-overlay-controls>
      <app-overlay-controls-item>
        <fl-button
          [color]="ButtonColor.DEFAULT"
          display="block"
          flTrackingLabel="UserLeaveBackButton"
          (click)="handleBackButton()"
          i18n="Chatbox groupchat control button"
        >
          Back
        </fl-button>
      </app-overlay-controls-item>
      <app-overlay-controls-item>
        <fl-button
          [color]="ButtonColor.DANGER"
          display="block"
          (click)="handleConfirmButton()"
          flTrackingLabel="UserLeaveConfirmButton"
          i18n="Chatbox groupchat control button"
        >
          Leave
        </fl-button>
      </app-overlay-controls-item>
    </app-overlay-controls>
  `,
  styleUrls: ['./confirm-user-leave-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmUserLeaveViewComponent {
  ButtonColor = ButtonColor;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  handleBackButton() {
    this.cancel.emit();
  }

  handleConfirmButton() {
    this.confirm.emit();
  }
}

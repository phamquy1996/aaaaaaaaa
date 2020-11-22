import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';

@Component({
  selector: 'app-confirm-user-removal-view',
  template: `
    <app-overlay-content i18n="Chatbox groupchat removal body">
      Are you sure you want to remove {{ user.displayName }} from this chat?
    </app-overlay-content>

    <app-overlay-controls>
      <app-overlay-controls-item>
        <fl-button
          [color]="ButtonColor.DEFAULT"
          display="block"
          flTrackingLabel="UserRemovalBackButton"
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
          flTrackingLabel="UserRemovalConfirmButton"
          i18n="Chatbox groupchat control button"
        >
          Remove
        </fl-button>
      </app-overlay-controls-item>
    </app-overlay-controls>
  `,
  styleUrls: ['./confirm-user-removal-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmUserRemovalViewComponent {
  ButtonColor = ButtonColor;

  @Input() user: User;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  handleBackButton() {
    this.cancel.emit();
  }

  handleConfirmButton() {
    this.confirm.emit();
  }
}

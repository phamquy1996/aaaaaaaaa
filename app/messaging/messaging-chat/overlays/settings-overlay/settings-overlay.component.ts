import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Thread } from '@freelancer/datastore/collections';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';

@Component({
  selector: 'app-settings-overlay',
  template: `
    <app-overlay-header i18n="Chatbox settings overlay header">
      Settings
    </app-overlay-header>
    <app-overlay-content>
      <app-settings-overlay-content
        [thread]="thread"
        (archiveChatToggle)="handleArchiveToggle()"
        (muteChatToggle)="handleMuteToggle()"
        (blockChatToggle)="handleBlockToggle()"
      ></app-settings-overlay-content>
    </app-overlay-content>
    <ng-container *ngIf="showControls">
      <app-overlay-controls>
        <app-overlay-controls-item>
          <fl-button
            [color]="ButtonColor.DEFAULT"
            display="block"
            flTrackingLabel="CloseSettings"
            (click)="handleCloseView()"
            i18n="Chatbox settings control button"
          >
            Back
          </fl-button>
        </app-overlay-controls-item>
      </app-overlay-controls>
    </ng-container>
  `,
  styleUrls: ['./settings-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsOverlayComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() thread: Thread;
  @Input() showControls = true;

  @Output() hideSettingsOverlay = new EventEmitter();
  @Output() archiveChatToggle = new EventEmitter<boolean>();
  @Output() muteChatToggle = new EventEmitter<boolean>();
  @Output() blockChatToggle = new EventEmitter<boolean>();

  handleCloseView() {
    this.hideSettingsOverlay.emit();
  }

  handleArchiveToggle() {
    this.archiveChatToggle.emit(true);
  }

  handleMuteToggle() {
    this.muteChatToggle.emit(true);
  }

  handleBlockToggle() {
    this.blockChatToggle.emit(true);
  }
}

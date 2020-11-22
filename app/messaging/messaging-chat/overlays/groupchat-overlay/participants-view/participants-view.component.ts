import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  OnlineOfflineUserStatus,
  Team,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-participants-view',
  template: `
    <app-overlay-header i18n="Chatbox groupchat participants header">
      People in Chat
    </app-overlay-header>
    <app-overlay-content>
      <app-participants-view-content
        [participants]="participants"
        [onlineOfflineStatuses$]="onlineOfflineStatuses$"
        [currentUser]="currentUser"
        [isRecruiter]="isRecruiter"
        [isThreadOwner]="isThreadOwner"
        [candidatesExist]="candidatesExist"
        [thread]="thread"
        [team]="team"
        (userRemoval)="handleRemove($event)"
      ></app-participants-view-content>
    </app-overlay-content>
    <app-overlay-controls>
      <app-overlay-controls-item>
        <fl-button
          [color]="ButtonColor.DEFAULT"
          display="block"
          flTrackingLabel="CloseParticipantsView"
          (click)="handleCloseView()"
          i18n="Chatbox groupchat control button"
        >
          Back
        </fl-button>
      </app-overlay-controls-item>
      <app-overlay-controls-item *ngIf="showAddPeopleOption">
        <fl-button
          [color]="ButtonColor.SECONDARY"
          display="block"
          (click)="handleShowManagementView()"
          flTrackingLabel="AddPeopleToGroupChat"
          i18n="Chatbox groupchat control button"
        >
          Add People
        </fl-button>
      </app-overlay-controls-item>
    </app-overlay-controls>
  `,
  styleUrls: ['./participants-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsViewComponent {
  ButtonColor = ButtonColor;
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;

  @Input() participants: ReadonlyArray<User>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() isThreadOwner: boolean;
  @Input() candidatesExist: boolean;
  @Input() isRecruiter: boolean;
  @Input() currentUser: User;
  @Input() thread: Thread;
  @Input() team: Team;
  @Input() showAddPeopleOption: boolean;
  @Output() showManagementView = new EventEmitter<void>();
  @Output() closeView = new EventEmitter<void>();
  @Output() userRemoval = new EventEmitter<User>();

  handleCloseView() {
    this.closeView.emit();
  }

  handleShowManagementView() {
    this.showManagementView.emit();
  }

  handleRemove(user: User) {
    this.userRemoval.emit(user);
  }
}

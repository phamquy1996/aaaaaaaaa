import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  Contact,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import * as Rx from 'rxjs';

type ViewState = 'participant' | 'management' | 'userRemoval' | 'userLeave';

@Component({
  selector: 'app-groupchat-overlay',
  template: `
    <ng-container [ngSwitch]="currentViewState">
      <app-participants-view
        *ngSwitchCase="'participant'"
        [participants]="participants"
        [onlineOfflineStatuses$]="onlineOfflineStatuses$"
        [currentUser]="currentUser"
        [isThreadOwner]="isThreadOwner"
        [isRecruiter]="isRecruiter"
        [candidatesExist]="candidatesExist"
        [thread]="thread"
        [team]="team"
        (showManagementView)="setViewState('management')"
        (closeView)="handleCloseGroupchatOverlay()"
        (userRemoval)="handleUserRemovalTrigger($event)"
        [showAddPeopleOption]="showAddPeopleOption"
      ></app-participants-view>
      <app-confirm-user-removal-view
        *ngSwitchCase="'userRemoval'"
        [user]="userToRemove"
        (confirm)="handleUserRemovalConfirm()"
        (cancel)="handleUserRemovalCancel()"
      ></app-confirm-user-removal-view>
      <app-confirm-user-leave-view
        *ngSwitchCase="'userLeave'"
        (confirm)="handleUserRemovalConfirm()"
        (cancel)="handleUserRemovalCancel()"
      ></app-confirm-user-leave-view>
      <app-management-view
        *ngSwitchCase="'management'"
        [candidateBidders]="candidateBidders"
        [candidateContacts]="candidateContacts"
        [candidateCollaborators]="candidateCollaborators"
        [onlineOfflineStatuses$]="onlineOfflineStatuses$"
        [isRecruiter]="isRecruiter"
        [thread]="thread"
        [team]="team"
        (addUsers)="handleManagementAddUsers($event)"
        (closeView)="setViewState('participant')"
      ></app-management-view>
    </ng-container>
  `,
  styleUrls: ['./groupchat-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupchatOverlayComponent {
  @Input() participants: ReadonlyArray<User>;
  @Input() currentUser: User;
  @Input() isThreadOwner: boolean;
  @Input() isRecruiter: boolean;
  @Input() candidatesExist: boolean;
  @Input() candidateBidders: ReadonlyArray<User>;
  @Input() candidateContacts: ReadonlyArray<Contact>;
  @Input() candidateCollaborators: ReadonlyArray<User>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() thread: Thread;
  @Input() team: Team;
  @Input() showAddPeopleOption: boolean;

  @Output() hideGroupchatOverlay = new EventEmitter();
  @Output()
  modifyMembers = new EventEmitter<{
    action: 'add' | 'remove';
    userIds: ReadonlyArray<number>;
  }>();

  currentViewState: ViewState = 'participant';
  userToRemove?: User;
  setViewState(viewState: ViewState) {
    this.currentViewState = viewState;
  }

  handleCloseGroupchatOverlay() {
    this.hideGroupchatOverlay.emit();
  }

  handleManagementAddUsers(userIds: ReadonlyArray<number>) {
    this.modifyMembers.emit({
      action: 'add',
      userIds,
    });

    this.hideGroupchatOverlay.emit();
  }

  handleUserRemovalTrigger(user: User) {
    this.userToRemove = user;
    // If the user to remove is the self user, show the leave view instead.
    if (user.id === this.currentUser.id) {
      this.currentViewState = 'userLeave';
    } else {
      this.currentViewState = 'userRemoval';
    }
  }

  handleUserRemovalConfirm() {
    if (this.userToRemove) {
      this.modifyMembers.emit({
        action: 'remove',
        userIds: [this.userToRemove.id],
      });
    }

    this.userToRemove = undefined;
    this.currentViewState = 'participant';
  }

  handleUserRemovalCancel() {
    this.userToRemove = undefined;
    this.currentViewState = 'participant';
  }
}

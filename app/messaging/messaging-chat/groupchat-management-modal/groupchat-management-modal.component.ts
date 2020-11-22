import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  Contact,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-management-modal',
  template: `
    <app-management-view
      class="ModalBody"
      flTrackingSection="chatbox"
      [candidateBidders]="bidders$ | async"
      [candidateContacts]="contacts$ | async"
      [candidateCollaborators]="collaborators$ | async"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      [isRecruiter]="isRecruiter$ | async"
      [thread]="thread$ | async"
      [team]="team$ | async"
      (addUsers)="handleAddUsers($event)"
      (closeView)="handleClose()"
    >
    </app-management-view>
  `,
  styleUrls: ['./groupchat-management-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupchatManagementModalComponent {
  @Input() bidders$: Rx.Observable<ReadonlyArray<User>>;
  @Input() contacts$: Rx.Observable<ReadonlyArray<Contact>>;
  @Input() collaborators$: Rx.Observable<ReadonlyArray<User>>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() isRecruiter$: Rx.Observable<boolean>;
  @Input() thread$: Rx.Observable<Thread>;
  @Input() team$: Rx.Observable<Team>;

  constructor(private modalRef: ModalRef<GroupchatManagementModalComponent>) {}

  handleAddUsers(userIds: ReadonlyArray<number>) {
    this.modalRef.close(userIds);
  }

  handleClose() {
    this.modalRef.close(null);
  }
}

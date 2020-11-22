import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { asObject } from '@freelancer/datastore';
import {
  Message,
  OnlineOfflineUserStatus,
  OnlineOfflineUserStatusValue,
  User,
} from '@freelancer/datastore/collections';
import { Tracking } from '@freelancer/tracking';
import { ModalService } from '@freelancer/ui';
import { ModalSize } from '@freelancer/ui/modal';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  MessageAttachment,
  MessagingAttachmentModalComponent,
} from '../messaging-attachment-modal/messaging-attachment-modal.component';
import {
  UsersMap,
  UsersOnlineStatus,
} from '../messaging-message-list/messaging-message-list.component';

export enum ThreadLoadingState {
  LOAD_THREAD,
  LOAD_MORE_MESSAGES,
}

@Component({
  selector: 'app-messaging-thread-view',
  template: `
    <ng-container
      *ngIf="
        (loading$ | async) &&
          (loadingState$ | async) === ThreadLoadingState.LOAD_THREAD;
        else loadedState
      "
    >
      <fl-bit class="ThreadView-loading">
        <fl-spinner flTrackingLabel="MessageListLoading"></fl-spinner>
      </fl-bit>
    </ng-container>
    <ng-template #loadedState>
      <app-messaging-message-list
        [loading]="loading$ | async"
        [messages]="messages$ | async"
        [showLoadMore]="canLoadMoreMessages$ | async"
        [usersIsOnlineMap]="chatMembersIsOnlineMap$ | async"
        [usersMap]="chatMembersMap$ | async"
        (loadMoreMessage)="loadMoreMessage.emit()"
        (viewAttachment)="viewAttachment($event)"
      ></app-messaging-message-list>
      <app-messaging-typing-indicator></app-messaging-typing-indicator>
    </ng-template>
    <fl-hr></fl-hr>
    <app-messaging-typing-box></app-messaging-typing-box>
  `,
  styleUrls: ['./messaging-thread-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadViewComponent implements OnInit {
  ThreadLoadingState = ThreadLoadingState;

  @Input() allChatMembers$: Rx.Observable<ReadonlyArray<User>>;
  @Input() canLoadMoreMessages$: Rx.Observable<boolean>;
  @Input() loading$: Rx.Observable<boolean>;
  @Input() loadingState$: Rx.Observable<ThreadLoadingState>;
  @Input() membersActivityStatus$: Rx.Observable<
    ReadonlyArray<OnlineOfflineUserStatus>
  >;
  @Input() messages$: Rx.Observable<ReadonlyArray<Message>>;
  @Output() loadMoreMessage = new EventEmitter<void>();

  chatMembersMap$: Rx.Observable<UsersMap>;
  chatMembersIsOnlineMap$: Rx.Observable<UsersOnlineStatus>;

  constructor(private modalService: ModalService, private tracking: Tracking) {}

  ngOnInit() {
    this.chatMembersMap$ = this.allChatMembers$.pipe(asObject(), startWith({}));

    this.chatMembersIsOnlineMap$ = this.membersActivityStatus$.pipe(
      map(membersStatus => {
        const isOnlineMap: UsersOnlineStatus = {};
        membersStatus.forEach(
          m =>
            (isOnlineMap[m.id] =
              m.status === OnlineOfflineUserStatusValue.ONLINE),
        );
        return isOnlineMap;
      }),
      startWith({}),
    );
  }

  viewAttachment(attachment: MessageAttachment) {
    const messageAttachmentModal = this.modalService.open(
      MessagingAttachmentModalComponent,
      {
        inputs: { attachment },
        edgeToEdge: true,
        size: ModalSize.XLARGE,
      },
    );

    messageAttachmentModal
      .afterClosed()
      .toPromise()
      .then(() => {
        this.tracking.track('user_action', {
          section: 'messaging_image_viewer',
          subsection: 'header',
          label: 'close_image_viewer',
        });
      });
  }
}

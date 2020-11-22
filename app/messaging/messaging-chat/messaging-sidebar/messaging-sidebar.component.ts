import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  MessageAttachment,
  MessageAttachmentsCollection,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextBoxState } from '../context-box/state-manager';

@Component({
  selector: 'app-messaging-sidebar',
  template: `
    <perfect-scrollbar class="MessagingSidebar-scrollbar" [config]="{}">
      <fl-bit
        class="MessagingSidebar-subsection"
        *ngIf="contextBoxState?.button && !chatOptionsMode"
        [flHideTablet]="true"
        [flHideMobile]="true"
      >
        <fl-text
          [weight]="FontWeight.BOLD"
          [size]="TextSize.SMALL"
          [flMarginBottom]="Margin.XXSMALL"
          i18n="Inbox sidebar section header"
        >
          Actions
        </fl-text>
        <app-context-box
          class="MessagingSidebar-contextBox"
          [extended]="true"
          [chatBoxMode]="false"
          [state]="contextBoxState"
        ></app-context-box>
        <fl-bit [flMarginBottom]="Margin.XSMALL"></fl-bit>
      </fl-bit>
      <fl-bit
        class="MessagingSidebar-subsection"
        *ngIf="
          contextBoxState &&
          contextBoxState.name !== 'hireme' &&
          !chatOptionsMode
        "
        [flHideTablet]="true"
        [flHideMobile]="true"
      >
        <fl-text [weight]="FontWeight.BOLD" [size]="TextSize.SMALL">
          <ng-container
            *ngIf="thread.context.type === 'project'"
            i18n="Inbox sidebar section header"
          >
            Project Details
          </ng-container>
          <ng-container
            *ngIf="thread.context.type === 'contest'"
            i18n="Inbox sidebar section header"
          >
            Contest Details
          </ng-container>
        </fl-text>
        <fl-list
          [type]="ListItemType.NON_BORDERED"
          [padding]="ListItemPadding.XXSMALL"
        >
          <fl-list-item>
            <fl-link
              class="MessagingSidebar-detailLink"
              flTrackingLabel="Inbox.ProjectLink"
              [link]="contextBoxState.linkUrl"
              [queryParams]="contextBoxState.linkQueryParams"
            >
              <fl-icon
                [flMarginRight]="Margin.XXXSMALL"
                [name]="'ui-link'"
                [size]="IconSize.SMALL"
              ></fl-icon>
              {{ contextBoxState.linkText }}
            </fl-link>
          </fl-list-item>
          <fl-list-item>
            <fl-icon
              [flMarginRight]="Margin.XXXSMALL"
              [name]="'ui-hourglass'"
              [size]="IconSize.SMALL"
            ></fl-icon>
            <fl-text
              [fontType]="FontType.SPAN"
              [size]="TextSize.XSMALL"
              i18n="Inbox sidebar submit date label"
            >
              Posted
            </fl-text>
            <fl-relative-time
              [date]="contextBoxState.timeSubmitted"
              [size]="TextSize.XSMALL"
              [color]="FontColor.DARK"
            ></fl-relative-time>
          </fl-list-item>
        </fl-list>
      </fl-bit>
      <fl-bit class="MessagingSidebar-subsection">
        <fl-text
          [weight]="FontWeight.BOLD"
          [size]="TextSize.SMALL"
          [flMarginBottom]="Margin.XXSMALL"
          i18n="Chatbox groupchat participants header"
        >
          People in Chat
        </fl-text>
        <perfect-scrollbar
          [config]="{}"
          class="MessagingSidebar-threadMembersScrollSection"
        >
          <app-participants-view-content
            [participants]="members"
            [onlineOfflineStatuses$]="onlineOfflineStatuses$"
            [currentUser]="currentUser"
            [isRecruiter]="isRecruiter"
            [isThreadOwner]="isThreadOwner"
            [candidatesExist]="candidatesExist"
            [thread]="thread"
            [team]="team"
            (userRemoval)="handleUserRemoved($event)"
          ></app-participants-view-content>
        </perfect-scrollbar>
        <fl-link
          class="MessagingSidebar-actionLink"
          *ngIf="showAddPeopleOption"
          flTrackingLabel="AddUsersToChat"
          [flMarginBottom]="Margin.XSMALL"
          i18n="Chatbox groupchat control button"
          (click)="onAddPeopleClick()"
        >
          Add people
        </fl-link>
      </fl-bit>
      <fl-bit class="MessagingSidebar-subsection">
        <fl-text
          [weight]="FontWeight.BOLD"
          [size]="TextSize.SMALL"
          [flMarginBottom]="Margin.XXSMALL"
          i18n="Chatbox settings overlay header"
        >
          Settings
        </fl-text>
        <app-settings-overlay-content
          [thread]="thread"
          [chatBoxMode]="false"
          (archiveChatToggle)="onArchiveChatToggle()"
          (muteChatToggle)="onMuteChatToggle()"
          (blockChatToggle)="onBlockChatToggle()"
        ></app-settings-overlay-content>
      </fl-bit>
      <fl-bit
        class="MessagingSidebar-subsection MessagingSidebar-attachmentsPanel"
        *ngIf="!thread.isFake && (hasAttachments$ | async)"
      >
        <fl-text
          [size]="TextSize.SMALL"
          [weight]="FontWeight.BOLD"
          [flMarginBottom]="Margin.XXSMALL"
          i18n="Inbox sidebar section header"
        >
          Thread attachments
        </fl-text>
        <app-sidebar-attachments
          [attachments]="attachmentsCollection.valueChanges() | async"
          [useThumbnailService]="useThumbnailService"
        ></app-sidebar-attachments>
        <fl-link
          class="MessagingSidebar-attachmentsLoad"
          i18n="Messaging load more button"
          *ngIf="canLoadMore$ | async"
          flTrackingLabel="LoadMoreAttachments"
          [flMarginBottom]="Margin.XSMALL"
          (click)="handleLoadAttachments()"
        >
          Load more...
        </fl-link>
      </fl-bit>
    </perfect-scrollbar>
  `,
  styleUrls: ['./messaging-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingSidebarComponent implements OnInit, OnDestroy, OnChanges {
  Margin = Margin;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  IconSize = IconSize;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;

  @Input() candidatesExist: boolean;
  @Input() contextBoxState: ContextBoxState;
  @Input() currentUser: User;
  @Input() isRecruiter: boolean;
  @Input() isThreadOwner: boolean;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() showAddPeopleOption: boolean;

  @Input() threadId$: Rx.Observable<number>;
  @Input() thread: Thread;
  @Input() members: ReadonlyArray<User>;
  @Input() team: Team;
  @Input() chatOptionsMode = false;

  @Output() archiveChatToggle = new EventEmitter();
  @Output() blockChatToggle = new EventEmitter();
  @Output() muteChatToggle = new EventEmitter();
  @Output() userAdd = new EventEmitter();
  @Output() userRemove = new EventEmitter<User>();

  attachmentsCollection: DatastoreCollection<MessageAttachmentsCollection>;
  currentLimit = 50;
  private attachmentsLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.currentLimit,
  );
  canLoadMore$: Rx.Observable<boolean>;
  hasAttachments$: Rx.Observable<boolean>;
  resetSubscription?: Rx.Subscription;
  // TODO: remove once we release thumbnail support to all users (T88919)
  useThumbnailService: boolean;

  constructor(private datastore: Datastore, private abtestService: ABTest) {}

  ngOnInit() {
    this.resetSubscription = this.threadId$.subscribe(() => {
      this.currentLimit = 50;
      this.attachmentsLimitSubject$.next(this.currentLimit);
    });
    this.attachmentsCollection = this.datastore.collection<
      MessageAttachmentsCollection
    >('messageAttachments', query =>
      query
        .where('threadId', '==', this.threadId$)
        .limit(this.attachmentsLimitSubject$),
    );
    this.canLoadMore$ = this.attachmentsCollection
      .valueChanges()
      .pipe(map(attachments => attachments.length >= this.currentLimit));
    this.hasAttachments$ = this.attachmentsCollection
      .valueChanges()
      .pipe(map(attachments => !!attachments.length));
  }

  ngOnDestroy() {
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  // TODO: remove once we release thumbnail support to all users (T88919)
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentUser && changes.currentUser.currentValue) {
      this.useThumbnailService =
        this.abtestService.isWhitelistUser() ||
        this.abtestService.shouldEnrol(
          'T90189-image-thumbnail-service',
          changes.currentUser.currentValue.id,
          0.01,
        );
    }
  }

  handleLoadAttachments() {
    this.currentLimit += 50;
    this.attachmentsLimitSubject$.next(this.currentLimit);
  }

  identifyAttachment(index: number, attachment: MessageAttachment) {
    return attachment.id;
  }

  onArchiveChatToggle() {
    this.archiveChatToggle.emit();
  }

  onBlockChatToggle() {
    this.blockChatToggle.emit();
  }

  onMuteChatToggle() {
    this.muteChatToggle.emit();
  }

  onAddPeopleClick() {
    this.userAdd.emit();
  }

  handleUserRemoved(user: User) {
    this.userRemove.emit(user);
  }
}

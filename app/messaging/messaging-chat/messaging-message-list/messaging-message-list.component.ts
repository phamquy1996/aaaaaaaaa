import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Message, User } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MessageAttachment } from '../messaging-attachment-modal/messaging-attachment-modal.component';

export interface UsersMap {
  [id: number]: User;
}

export interface UsersOnlineStatus {
  [id: number]: boolean;
}

@Component({
  selector: 'app-messaging-message-list',
  template: `
    <perfect-scrollbar>
      <fl-bit class="MessageList">
        <fl-bit
          *ngIf="showLoadMore || loading"
          class="MessageList-loadMore"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-link
            *ngIf="!loading; else loadingMessages"
            i18n="Load more with ellipsis text"
            flTrackingLabel="LoadMoreMessages"
            (click)="loadMoreMessage.emit()"
          >
            Load More...
          </fl-link>
          <ng-template #loadingMessages>
            <fl-spinner
              flTrackingLabel="MoreMessagesLoading"
              [size]="SpinnerSize.SMALL"
            ></fl-spinner>
          </ng-template>
        </fl-bit>
        <fl-bit
          *ngFor="
            let message of messages;
            let i = index;
            let last = last;
            trackBy: identifyMessage
          "
          [flMarginBottom]="last ? Margin.NONE : Margin.XXSMALL"
        >
          <app-messaging-message-item
            class="MessageList-item"
            [message]="message"
            [previousMessage]="i !== 0 ? messages[i - 1] : undefined"
            [user]="usersMap[message.fromUser]"
            [userIsOnline]="usersIsOnlineMap[message.fromUser]"
            (viewAttachment)="viewAttachment.emit($event)"
          ></app-messaging-message-item>
        </fl-bit>
      </fl-bit>
    </perfect-scrollbar>
  `,
  styleUrls: ['./messaging-message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingMessageListComponent implements AfterViewInit {
  Margin = Margin;
  SpinnerSize = SpinnerSize;

  @Input() loading = false;
  @Input() showLoadMore = false;
  @Input() messages: ReadonlyArray<Message>;
  @Input() usersIsOnlineMap: UsersOnlineStatus;
  @Input() usersMap: UsersMap;
  @Output() loadMoreMessage = new EventEmitter<void>();
  @Output() viewAttachment = new EventEmitter<MessageAttachment>();

  @ViewChild(PerfectScrollbarComponent, { static: true })
  psbComponent: PerfectScrollbarComponent;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.psbComponent.directiveRef) {
      this.psbComponent.directiveRef.scrollToBottom();
    }
  }

  identifyMessage(index: number, message: Message): number {
    return message.id;
  }
}

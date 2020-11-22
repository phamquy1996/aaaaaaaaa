import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RequestStatus } from '@freelancer/datastore';
import { User, UsersCollection } from '@freelancer/datastore/collections';
import { Chat } from '@freelancer/messaging-chat';
import { IconColor } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import {
  ContextTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';

@Component({
  selector: 'app-messaging-thread-recruiter-search',
  template: `
    <fl-text
      *ngIf="!searching; else result"
      i18n="Recruiter user search instruction"
      [flMarginBottom]="Margin.XXSMALL"
      [size]="TextSize.XXSMALL"
    >
      Press Enter on the search bar to search for users by username.
    </fl-text>
    <ng-template #result>
      <fl-text
        i18n="Direct chat text"
        [flMarginBottom]="Margin.XXSMALL"
        [weight]="FontWeight.BOLD"
      >
        Direct Chat
      </fl-text>
      <ng-container *ngIf="status.ready">
        <fl-list
          *ngIf="users.length > 0; else emptyResult"
          flTrackingSection="MessagingRecruiterSearchResult"
          [flMarginBottom]="Margin.XXSMALL"
          [clickable]="true"
          [padding]="ListItemPadding.XXXSMALL"
          [type]="ListItemType.NON_BORDERED"
        >
          <fl-list-item
            *ngFor="let user of users"
            flTrackingLabel="MessagingRecruiterSearchItem"
            (click)="handleSearchUserSelected(user)"
          >
            <fl-bit class="RecruiterUserSearchResult-item">
              <fl-user-avatar
                [flMarginRight]="Margin.XXSMALL"
                [size]="AvatarSize.XSMALL"
                [users]="[user]"
              ></fl-user-avatar>
              <fl-username
                [displayName]="user.displayName"
                [username]="user.username"
              ></fl-username>
            </fl-bit>
          </fl-list-item>
        </fl-list>
        <ng-template #emptyResult>
          <fl-text i18n="No user found text" [flMarginBottom]="Margin.XXSMALL">
            No user found.
          </fl-text>
        </ng-template>
      </ng-container>
      <ng-container *ngIf="!status.ready && !status.error">
        <fl-bit
          class="RecruiterUserSearchResult-item"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-user-avatar
            [flMarginRight]="Margin.XXSMALL"
            [size]="AvatarSize.XSMALL"
            [users]="[null]"
          ></fl-user-avatar>
          <fl-loading-text
            class="RecruiterUserSearchResult-loading"
            [rows]="1"
            [padded]="false"
          ></fl-loading-text>
        </fl-bit>
      </ng-container>
      <ng-container *ngIf="status.error">
        <fl-bit
          class="RecruiterUserSearchResult-item"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <fl-icon
            [flMarginRight]="Margin.XXSMALL"
            [name]="'ui-warning-alt-v2'"
            [color]="IconColor.ERROR"
          ></fl-icon>
          <fl-text i18n="An error occured text" [color]="FontColor.ERROR">
            Something went wrong while searching for this user. Please try
            again.
          </fl-text>
        </fl-bit>
      </ng-container>
    </ng-template>
    <fl-hr></fl-hr>
  `,
  styleUrls: ['./messaging-thread-recruiter-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadRecruiterSearchComponent {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconColor = IconColor;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;
  TextSize = TextSize;

  @Input() searching: boolean;
  @Input() status: RequestStatus<UsersCollection>;
  @Input() users: ReadonlyArray<User>;
  @Output() startChat = new EventEmitter<Chat>();

  handleSearchUserSelected(user: User) {
    this.startChat.emit({
      userIds: [user.id],
      threadType: ThreadTypeApi.ADMIN_PREFERRED_CHAT,
      origin: 'ng-contact-list-user-search',
      context: {
        type: ContextTypeApi.SUPPORT_CHAT,
        id: user.id,
      },
    });
  }
}

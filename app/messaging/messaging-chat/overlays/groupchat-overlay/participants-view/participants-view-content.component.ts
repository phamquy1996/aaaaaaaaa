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
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import {
  ContextTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-participants-view-content',
  template: `
    <fl-bit
      class="ParticipantItem"
      *ngFor="let user of participants"
      [flMarginBottom]="Margin.SMALL"
    >
      <fl-user-avatar
        [users]="[user]"
        [isOnline]="user | isOnline: (onlineOfflineStatuses$ | async)"
        [flMarginRight]="Margin.XXXSMALL"
      ></fl-user-avatar>
      <fl-bit>
        <fl-link
          [link]="user.profileUrl"
          flTrackingSection="ParticipantsView"
          flTrackingLabel="UsernameLink"
        >
          {{ user.displayName }}
          <ng-container
            *ngIf="user.id === currentUser.id"
            i18n="Chatbox groupchat participants self label"
          >
            (you)
          </ng-container>
        </fl-link>
        <fl-text *ngIf="isRecruiter && user.username !== user.displayName">
          {{ user.username }}
        </fl-text>
        <fl-bit
          *ngIf="
            user.id !== currentUser.id &&
            !(user | isOnline: (onlineOfflineStatuses$ | async)) &&
            user?.onlineOfflineStatus?.lastUpdatedTimestamp
          "
        >
          <fl-text
            [fontType]="FontType.SPAN"
            [size]="TextSize.XXXSMALL"
            [color]="FontColor.MID"
            i18n="Last seen online text"
          >
            Last seen
          </fl-text>
          <fl-relative-time
            [size]="TextSize.XXXSMALL"
            [date]="user.onlineOfflineStatus.lastUpdatedTimestamp"
            [includeSeconds]="false"
            [strict]="true"
          ></fl-relative-time>
        </fl-bit>
      </fl-bit>
      <fl-button
        class="RemoveButton"
        *ngIf="showRemoveButton(user)"
        (click)="handleRemove(user)"
        flTrackingLabel="GroupChatRemoveParticipant"
      >
        <fl-icon
          *ngIf="user.id === currentUser.id"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-close"
          i18n-label="Chatbox groupchat participant button"
          label="Leave this chat"
        ></fl-icon>
        <fl-icon
          *ngIf="user.id !== currentUser.id"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-close"
          i18n-label="Chatbox groupchat participant button"
          label="Remove the user from this chat"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-text
      class="AsideText"
      *ngIf="showGroupChatHelperText()"
      [color]="FontColor.MID"
      [size]="TextSize.XXSMALL"
      i18n="Chatbox groupchat view body"
    >
      You are currently talking to one user, add more people to start a new
      group chat.
    </fl-text>
  `,
  styleUrls: ['./participants-view-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsViewContentComponent {
  Margin = Margin;
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
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
  @Output() userRemoval = new EventEmitter<User>();

  showRemoveButton(user: User) {
    if (this.thread.threadType === ThreadTypeApi.TEAM) {
      if (this.team) {
        return (
          user.id !== this.team.ownerUserId &&
          this.team.members.includes(user.id)
        );
      }
      return false;
    }

    if (this.thread.threadType === ThreadTypeApi.TEAM_OFFICIAL) {
      return false;
    }

    return (
      (user.id === this.currentUser.id ||
        this.isThreadOwner ||
        this.isRecruiter) &&
      this.thread.threadType !== ThreadTypeApi.PRIVATE_CHAT
    );
  }

  showGroupChatHelperText() {
    return (
      this.participants.length === 2 &&
      this.thread.context.type !== ContextTypeApi.NONE &&
      ((this.isThreadOwner && this.candidatesExist) || this.isRecruiter)
    );
  }

  handleRemove(user: User) {
    this.userRemoval.emit(user);
  }
}

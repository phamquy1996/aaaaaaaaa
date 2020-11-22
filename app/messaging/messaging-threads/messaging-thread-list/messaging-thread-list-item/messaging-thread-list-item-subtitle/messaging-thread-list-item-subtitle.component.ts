import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Message, User } from '@freelancer/datastore/collections';
import { FontColor, FontType, FontWeight } from '@freelancer/ui/text';
import {
  ThreadSubtitleType,
  ThreadTitleType,
} from '../../../messaging-threads.types';

@Component({
  selector: 'app-messaging-thread-list-item-subtitle',
  template: `
    <ng-container [ngSwitch]="subtitleType">
      <fl-text
        *ngSwitchCase="ThreadSubtitleType.DELETED_PROJECT"
        i18n="This project has been deleted text"
        [fontType]="FontType.SPAN"
        [color]="fontColor"
        [weight]="fontWeight"
      >
        This project has been deleted
      </fl-text>

      <fl-text
        *ngSwitchCase="ThreadSubtitleType.DELETED_CONTEST"
        i18n="This contest has been deleted text"
        [fontType]="FontType.SPAN"
        [color]="fontColor"
        [weight]="fontWeight"
      >
        This contest has been deleted
      </fl-text>

      <fl-text
        *ngSwitchCase="ThreadSubtitleType.ATTACHMENT"
        i18n="User sent an attachment text"
        [fontType]="FontType.SPAN"
        [color]="fontColor"
        [weight]="fontWeight"
      >
        {{ lastMessageUser?.displayName }} sent an attachment
      </fl-text>

      <fl-text
        *ngSwitchCase="ThreadSubtitleType.TEAMS"
        i18n="Official group chat text"
        [fontType]="FontType.SPAN"
        [color]="fontColor"
        [weight]="fontWeight"
      >
        Official Group Chat
      </fl-text>

      <fl-text
        *ngSwitchCase="ThreadSubtitleType.LAST_MESSAGE"
        [fontType]="FontType.SPAN"
        [color]="fontColor"
        [weight]="fontWeight"
      >
        {{ lastMessage?.message }}
      </fl-text>

      <fl-text
        *ngSwitchCase="ThreadSubtitleType.CONTEXT_TITLE"
        [fontType]="FontType.SPAN"
        [color]="fontColor"
        [weight]="fontWeight"
      >
        {{ contextTitle }}
      </fl-text>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadListItemSubtitleComponent implements OnChanges {
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  ThreadTitleType = ThreadTitleType;
  ThreadSubtitleType = ThreadSubtitleType;

  @Input() contextTitle?: string;
  @Input() hasUnreadMessages: boolean;
  @Input() lastMessage?: Message;
  @Input() lastMessageUser?: User;
  @Input() subtitleType: ThreadSubtitleType;

  fontColor: FontColor = FontColor.MID;
  fontWeight: FontWeight = FontWeight.NORMAL;

  ngOnChanges(changes: SimpleChanges) {
    if ('hasUnreadMessages' in changes) {
      this.fontColor = this.hasUnreadMessages ? FontColor.DARK : FontColor.MID;
      this.fontWeight = this.hasUnreadMessages
        ? FontWeight.MEDIUM
        : FontWeight.NORMAL;
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from '@freelancer/datastore/collections';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { TextSize } from '@freelancer/ui/text';
import { ViewHeaderType } from '@freelancer/view-header-template';
import { ContextBoxState } from '../../messaging-chat/context-box/state-manager';

@Component({
  selector: 'app-messaging-inbox-header',
  template: `
    <fl-view-header
      *flViewHeaderTemplate="ViewHeaderType.SHOW_ALL; fullReplacement: true"
      [showMenu]="!emptyState"
      (menuClick)="openChatOptionsDrawer()"
    >
      <ng-container *ngIf="!emptyState">
        <app-context-box
          class="ContextBox"
          [state]="contextBoxState"
          [isOnline]="isOnline"
          [isGroupChatThread]="isGroupChatThread"
          [chatBoxMode]="false"
          [otherMembers]="otherMembers"
        ></app-context-box>
      </ng-container>
      <ng-container *ngIf="emptyState">
        <fl-heading
          i18n="Inbox messages header"
          [headingType]="HeadingType.H4"
          [size]="TextSize.LARGE"
        >
          Messages
        </fl-heading>
      </ng-container>
    </fl-view-header>
  `,
  styleUrls: ['./messaging-inbox-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingInboxHeaderComponent {
  ViewHeaderType = ViewHeaderType;
  VerticalAlignment = VerticalAlignment;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;

  @Input() emptyState: boolean;
  @Input() contextBoxState: ContextBoxState;
  @Input() isOnline: boolean;
  @Input() isGroupChatThread: boolean;
  @Input() otherMembers: ReadonlyArray<User>;

  @Output() chatOptionsDrawerToggle = new EventEmitter<boolean>();

  openChatOptionsDrawer() {
    this.chatOptionsDrawerToggle.emit(true);
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  OnlineOfflineUserStatus,
  User,
} from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-candidate-group',
  template: `
    <fl-button
      class="CandidateGroupTitle"
      (click)="handleExpand()"
      flTrackingLabel="expandCandidates"
    >
      <fl-icon
        *ngIf="expanded"
        [color]="IconColor.MID"
        [size]="IconSize.XSMALL"
        [hoverColor]="HoverColor.PRIMARY"
        name="ui-chevron-down"
        i18n-label="Chatbox groupchat candidate group icon"
        label="Collapse"
      ></fl-icon>
      <fl-icon
        *ngIf="!expanded"
        [color]="IconColor.MID"
        [size]="IconSize.XSMALL"
        [hoverColor]="HoverColor.PRIMARY"
        name="ui-chevron-right"
        i18n-label="Chatbox groupchat candidate group icon"
        label="Expand"
      ></fl-icon>
      {{ name }} ({{ candidateUsers.length }})
    </fl-button>
    <ng-container *ngIf="expanded">
      <fl-bit
        class="CandidateItem"
        *ngFor="let user of candidateUsers; trackBy: trackByUserId"
        flTrackingLabel="GroupChat.PickCandidate"
        (click)="handleClick(user)"
        [ngClass]="{ 'CandidateItem-selected': selectedUsers.has(user) }"
      >
        <fl-user-avatar
          [users]="[user]"
          [isOnline]="user | isOnline: (onlineOfflineStatuses$ | async)"
          [size]="AvatarSize.SMALL"
          [flMarginRight]="Margin.XXXSMALL"
        ></fl-user-avatar>
        <fl-bit class="DisplayName">{{ user.displayName }}</fl-bit>
        <fl-icon
          *ngIf="!selectedUsers.has(user)"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
          name="ui-plus"
        ></fl-icon>
        <fl-icon
          *ngIf="selectedUsers.has(user)"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
          name="ui-subtract-circle"
        ></fl-icon>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./candidate-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateGroupComponent {
  AvatarSize = AvatarSize;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;

  @Input() name: string;
  @Input() candidateUsers: ReadonlyArray<User>;
  @Input() selectedUsers: Set<User>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Output() userSelected = new EventEmitter<User>();
  expanded = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  handleExpand() {
    this.expanded = !this.expanded;
    this.changeDetectorRef.markForCheck();
  }

  handleClick(user: User) {
    this.userSelected.emit(user);
  }

  trackByUserId(user: User) {
    return user.id;
  }
}

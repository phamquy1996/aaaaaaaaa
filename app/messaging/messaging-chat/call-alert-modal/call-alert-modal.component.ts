import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { User, UsersCollection } from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { CallType as CallTypeChatBox } from '@freelancer/videochat';
import * as Rx from 'rxjs';

type CallType = CallTypeChatBox;

@Component({
  selector: 'app-call-alert-modal',
  template: `
    <fl-bit
      class="CallModalContainer"
      flTrackingSection="MessagingCallAlertModal"
    >
      <fl-bit class="HeaderTopRow" *ngIf="callType === 'Audio'">
        <fl-icon
          [name]="'ui-phone'"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
        ></fl-icon>
        <fl-text
          [color]="FontColor.MID"
          [size]="TextSize.XXSMALL"
          i18n="Chatbox incoming call description"
        >
          Incoming Audio Call
        </fl-text>
      </fl-bit>
      <fl-bit class="HeaderTopRow" *ngIf="callType === 'Video'">
        <fl-icon
          [name]="'ui-video-camera-v2'"
          [color]="IconColor.MID"
          [size]="IconSize.SMALL"
        ></fl-icon>
        <fl-text
          [color]="FontColor.MID"
          [size]="TextSize.XXSMALL"
          i18n="Chatbox incoming call description"
        >
          Incoming Video Call
        </fl-text>
      </fl-bit>
      <fl-text
        *ngFor="let member of otherMembers$ | async"
        [color]="FontColor.DARK"
        [size]="TextSize.SMALL"
        [weight]="FontWeight.BOLD"
      >
        {{ member.displayName }}
      </fl-text>

      <fl-bit class="CallContent">
        <fl-bit class="Animation" [flMarginBottom]="Margin.SMALL">
          <fl-bit [ngClass]="['Circle', 'CircleAvatar']">
            <fl-user-avatar
              [users]="otherMembers$ | async"
              [size]="AvatarSize.XLARGE"
            >
            </fl-user-avatar>
          </fl-bit>
          <fl-bit class="PulseRing"></fl-bit>
        </fl-bit>
        <fl-bit class="ActionButtons">
          <fl-button
            flTrackingLabel="AcceptCall"
            [ngClass]="['Circle', 'CircleIcon', 'CircleIconAccept']"
            (click)="handleCallAccept()"
          >
            <fl-icon
              [name]="'ui-phone'"
              [color]="IconColor.LIGHT"
              [size]="IconSize.MID"
            ></fl-icon>
          </fl-button>
          <fl-button
            flTrackingLabel="DeclineCall"
            [ngClass]="['Circle', 'CircleIcon', 'CircleIconDecline']"
            (click)="handleCallDecline()"
          >
            <fl-icon
              [name]="'ui-phone'"
              [color]="IconColor.LIGHT"
              [size]="IconSize.MID"
            ></fl-icon>
          </fl-button>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['call-alert-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallAlertModalComponent implements OnInit {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  TextSize = TextSize;

  @Input() otherUserIds: ReadonlyArray<number>;
  @Input() callType: CallType;
  @Input() threadId: number;

  otherMembers$: Rx.Observable<ReadonlyArray<User>>;

  constructor(
    private modalRef: ModalRef<CallAlertModalComponent>,
    private datastore: Datastore,
  ) {}

  ngOnInit() {
    this.otherMembers$ = this.datastore
      .collection<UsersCollection>('users', Rx.of(this.otherUserIds))
      .valueChanges();
  }

  handleCallAccept() {
    this.modalRef.close(true);
  }

  handleCallDecline() {
    this.modalRef.close(false);
  }
}

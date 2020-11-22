import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BackendAllErrorCodes } from '@freelancer/datastore';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { ContestCommentContextTypeApi } from 'api-typings/contests/contests';
import { ErrorCodeApi } from 'api-typings/errors/errors';

@Component({
  selector: 'app-contest-comment-form-messages',
  template: `
    <fl-text
      *ngIf="commentHasContactDetails && !error"
      i18n="Comment contains contact details warning text"
      [flMarginBottom]="Margin.XSMALL"
      [color]="FontColor.WARNING"
      [size]="TextSize.XXSMALL"
    >
      Comments containing contact details may be reported.
    </fl-text>
    <fl-bit *ngIf="error" [ngSwitch]="error" [flMarginBottom]="Margin.XSMALL">
      <fl-text
        i18n="Comment on deleted contest error text"
        *ngSwitchCase="ErrorCodeApi.CONTEST_DELETED"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Sorry, this contest doesn't exist. You can browse other contests
        <fl-link
          flTrackingLabel="BrowseOtherContests"
          [color]="LinkColor.INHERIT"
          [hoverColor]="LinkHoverColor.INHERIT"
          [link]="'/search/contests'"
          [size]="TextSize.XXSMALL"
          [underline]="LinkUnderline.ALWAYS"
        >
          here</fl-link
        >.
      </fl-text>
      <fl-text
        *ngSwitchCase="ErrorCodeApi.ENTRY_NOT_FOUND"
        i18n="Comment on deleted entry error text"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Sorry, this entry has been deleted.
        <fl-link
          flTrackingLabel="CloseEntry"
          [color]="LinkColor.INHERIT"
          [hoverColor]="LinkHoverColor.INHERIT"
          [size]="TextSize.XXSMALL"
          [underline]="LinkUnderline.ALWAYS"
          (click)="closeEntry.emit()"
        >
          Close
        </fl-link>
      </fl-text>
      <fl-text
        *ngSwitchCase="ErrorCodeApi.FORBIDDEN"
        i18n="Comment as blacklisted user error text"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        You are not allowed to post comments in this contest. Please contact
        support@freelancer.com for any concerns.
      </fl-text>
      <ng-container *ngSwitchCase="ErrorCodeApi.CONTEST_MESSAGE_NOT_FOUND">
        <fl-text
          *ngIf="
            !isContestHolder &&
              commentType === ContestCommentContextTypeApi.ANNOTATION;
            else submitToMainThread
          "
          i18n="Comment not available error text"
          [color]="FontColor.ERROR"
          [size]="TextSize.XXSMALL"
        >
          This comment is no longer available.
        </fl-text>
        <ng-template #submitToMainThread>
          <fl-banner-alert
            flTrackingSection="ContestCommentErrorBanner"
            [compact]="true"
            [type]="BannerAlertType.ERROR"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-text
              i18n="Reply to deleted comment error text"
              [flMarginBottom]="Margin.XSMALL"
            >
              This comment is no longer available. Post to the main thread?
            </fl-text>
            <fl-bit>
              <fl-button
                flTrackingLabel="PostCommentToMainThread"
                i18n="Cancel comment button"
                [color]="ButtonColor.DEFAULT"
                [flMarginRight]="Margin.XXSMALL"
                [flMarginBottom]="Margin.XXSMALL"
                [size]="ButtonSize.MINI"
                (click)="cancelComment.emit()"
              >
                Cancel
              </fl-button>
              <fl-button
                flTrackingLabel="PostCommentToMainThread"
                i18n="Post comment button"
                [color]="ButtonColor.DEFAULT"
                [size]="ButtonSize.MINI"
                (click)="submitCommentToMainThread.emit()"
              >
                Yes, post comment
              </fl-button>
            </fl-bit>
          </fl-banner-alert>
        </ng-template>
      </ng-container>
      <fl-text
        *ngSwitchDefault
        i18n="Default error text"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Failed to post.
        <fl-link
          flTrackingLabel="RetrySubmitComment"
          [color]="LinkColor.INHERIT"
          [hoverColor]="LinkHoverColor.INHERIT"
          [size]="TextSize.XXSMALL"
          [underline]="LinkUnderline.ALWAYS"
          (click)="retrySubmitComment.emit()"
        >
          Try again
          <fl-icon
            [name]="'ui-refresh'"
            [size]="IconSize.XSMALL"
            [color]="IconColor.ERROR"
            [hoverColor]="HoverColor.CURRENT"
          ></fl-icon>
        </fl-link>
      </fl-text>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentFormMessagesComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  TextSize = TextSize;

  ContestCommentContextTypeApi = ContestCommentContextTypeApi;
  ErrorCodeApi = ErrorCodeApi;

  @Input() commentType: ContestCommentContextTypeApi;
  @Input() commentHasContactDetails: boolean;
  @Input() error?: BackendAllErrorCodes;
  @Input() isContestHolder: boolean;
  @Output() cancelComment = new EventEmitter<void>();
  @Output() closeEntry = new EventEmitter<void>();
  @Output() retrySubmitComment = new EventEmitter<void>();
  @Output() submitCommentToMainThread = new EventEmitter<void>();
}

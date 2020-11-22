import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { ToastAlertColor, ToastAlertType } from '@freelancer/ui/toast-alert';

export const DELETE_COMMENT_DEFAULT_ERROR_TOAST =
  'delete-comment-default-error';
export const DELETE_COMMENT_SUCCESS_TOAST = 'delete-comment-success';
export const UNDELETE_COMMENT_DEFAULT_ERROR_TOAST =
  'undelete-comment-default-error';

export const RETRY_TIMEOUT = 500;

@Component({
  selector: 'app-contest-comment-delete-toast',
  template: `
    <ng-container flTrackingSection="ContestComment.DeleteToast">
      <!-- SUCCEST TOAST -->
      <!-- Note: stopPropagation stop comments callout from closing -->
      <fl-toast-alert
        i18n="Comment deleted text"
        id="{{ DELETE_COMMENT_SUCCESS_TOAST }}-{{ commentId }}"
        [color]="ToastAlertColor.LIGHT"
        [timeout]="TOAST_TIMEOUT"
        [type]="ToastAlertType.SUCCESS"
        (click)="$event.stopPropagation()"
      >
        Comment deleted.
        <fl-link
          *ngIf="!loading; else showSpinner"
          flTrackingLabel="UndoDeleteComment"
          (click)="undeleteComment.emit()"
        >
          Undo
        </fl-link>
      </fl-toast-alert>
      <!-- ERROR TOASTS -->
      <!-- Note:stopPropagation stop comments callout from closing -->
      <fl-toast-alert
        i18n="Default delete comment error message"
        id="{{ DELETE_COMMENT_DEFAULT_ERROR_TOAST }}-{{ commentId }}"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
        (click)="$event.stopPropagation()"
      >
        We encountered a problem while deleting this comment.
        <fl-link
          *ngIf="!loading; else showSpinner"
          flTrackingLabel="RetryDeleteComment"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          (click)="retryDeleteComment.emit()"
        >
          Try again
        </fl-link>
      </fl-toast-alert>

      <!-- Note:stopPropagation stop comments callout from closing -->
      <fl-toast-alert
        i18n="Default undelete comment error message"
        id="{{ UNDELETE_COMMENT_DEFAULT_ERROR_TOAST }}-{{ commentId }}"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
        (click)="$event.stopPropagation()"
      >
        We encountered a problem while undeleting this comment.
        <fl-link
          *ngIf="!loading; else showSpinner"
          flTrackingLabel="RetryUndeleteComment"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          (click)="retryUndeleteComment.emit()"
        >
          Try again
        </fl-link>
      </fl-toast-alert>
    </ng-container>
    <ng-template #showSpinner>
      <fl-spinner
        flTrackingLabel="ContestsCommentToastSpinner"
        [size]="SpinnerSize.SMALL"
      ></fl-spinner>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentDeleteToastComponent {
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  SpinnerSize = SpinnerSize;
  ToastAlertColor = ToastAlertColor;
  ToastAlertType = ToastAlertType;

  DELETE_COMMENT_DEFAULT_ERROR_TOAST = DELETE_COMMENT_DEFAULT_ERROR_TOAST;
  DELETE_COMMENT_SUCCESS_TOAST = DELETE_COMMENT_SUCCESS_TOAST;
  UNDELETE_COMMENT_DEFAULT_ERROR_TOAST = UNDELETE_COMMENT_DEFAULT_ERROR_TOAST;

  readonly TOAST_TIMEOUT = 5000;

  @Input() commentId: number;
  @Input() loading: boolean;
  @Output() undeleteComment = new EventEmitter<void>();
  @Output() retryDeleteComment = new EventEmitter<void>();
  @Output() retryUndeleteComment = new EventEmitter<void>();
}

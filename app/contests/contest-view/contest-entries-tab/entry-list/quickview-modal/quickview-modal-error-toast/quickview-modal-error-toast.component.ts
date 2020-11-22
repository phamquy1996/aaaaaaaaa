import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';
import { ToastAlertColor, ToastAlertType } from '@freelancer/ui/toast-alert';

export enum EntryToastError {
  REJECT_FORBIDDEN = 'reject-forbidden',
  REJECT_CONFLICT = 'reject-conflict',
  REJECT_DEFAULT_ERROR = 'reject-default-error',
  RECONSIDER_FORBIDDEN = 'reconsider-forbidden',
  RECONSIDER_CONFLICT = 'reconsider-conflict',
  RECONSIDER_DEFAULT_ERROR = 'reconsider-default-error',
  RATE_BAD_REQUEST = 'rate-bad-request',
  RATE_FORBIDDEN = 'rate-forbidden',
  RATE_DEFAULT_ERROR = 'rate-default-error',
  LIKE_BAD_REQUEST = 'like-bad-request',
  LIKE_FORBIDDEN = 'like-forbidden',
  LIKE_DEFAULT_ERROR = 'like-default',
  LIKE_CONFLICT = 'like-conflict',
  DISLIKE_CONFLICT = 'dislike-conflict',
}

@Component({
  selector: 'app-quickview-modal-error-toast',
  template: `
    <!-- REJECT ERROR TOASTS -->
    <ng-container flTrackingSection="EntryQuickviewModal.ErrorToast">
      <fl-toast-alert
        i18n="Invalid user for rejecting error message"
        [id]="EntryToastError.REJECT_FORBIDDEN"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You must be the contest holder or collaborator to reject an entry
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Invalid entry status for rejecting error message"
        [id]="EntryToastError.REJECT_CONFLICT"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You can only reject active entries
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Default reject error message"
        [id]="EntryToastError.REJECT_DEFAULT_ERROR"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        We encountered a problem while rejecting this entry.
        <fl-link
          flTrackingLabel="RetryReject"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          (click)="retryReject.emit()"
        >
          Try again
        </fl-link>
      </fl-toast-alert>

      <!-- RECONSIDER ERROR TOASTS -->
      <fl-toast-alert
        i18n="Invalid user for reconsider error message"
        [id]="EntryToastError.RECONSIDER_FORBIDDEN"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You must be the contest holder or collaborator to reconsider an entry
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Invalid entry status for reconsider error message"
        [id]="EntryToastError.RECONSIDER_CONFLICT"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You can only reconsider rejected entries
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Default reconsider error message"
        [id]="EntryToastError.RECONSIDER_DEFAULT_ERROR"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        We encountered a problem while reconsidering this entry.
        <fl-link
          flTrackingLabel="RetryReconsider"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          (click)="retryReconsider.emit()"
        >
          Try again
        </fl-link>
      </fl-toast-alert>

      <!-- RATE ERROR TOASTS -->
      <fl-toast-alert
        i18n="Entry rate bad request error message"
        [id]="EntryToastError.RATE_BAD_REQUEST"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You can only rate an entry from 1 to 5 stars
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Entry rate forbidden error message"
        [id]="EntryToastError.RATE_FORBIDDEN"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You must be the contest holder or collaborator to rate an entry
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Entry rate default error message"
        [id]="EntryToastError.RATE_DEFAULT_ERROR"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        We encountered a problem while rating this entry.
        <fl-link
          flTrackingLabel="RetryRate"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          (click)="retryRate.emit()"
        >
          Try again
        </fl-link>
      </fl-toast-alert>

      <!-- LIKE/DISLIKE ERROR TOASTS -->
      <fl-toast-alert
        i18n="Entry like/dislike bad request error message"
        [id]="EntryToastError.LIKE_BAD_REQUEST"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You must like/dislike a valid entry
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Entry like/dislike forbidden error message"
        [id]="EntryToastError.LIKE_FORBIDDEN"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You are not allowed to like/dislike this entry
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Entry like conflict error message"
        [id]="EntryToastError.LIKE_CONFLICT"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You have already liked this entry
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Entry dislike conflict error message"
        [id]="EntryToastError.DISLIKE_CONFLICT"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        You can only dislike an entry you already liked
      </fl-toast-alert>

      <fl-toast-alert
        i18n="Entry like/dislike default error message"
        [id]="EntryToastError.LIKE_DEFAULT_ERROR"
        [closeable]="true"
        [color]="ToastAlertColor.DARK"
        [type]="ToastAlertType.ERROR"
        [timeout]="TOAST_TIMEOUT"
      >
        We encountered a problem while liking/disliking this entry. Please
        refresh or try again.
      </fl-toast-alert>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickviewModalErrorToastComponent {
  EntryToastError = EntryToastError;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  ToastAlertColor = ToastAlertColor;
  ToastAlertType = ToastAlertType;

  readonly TOAST_TIMEOUT = 5000;

  @Output() retryReject = new EventEmitter<void>();
  @Output() retryReconsider = new EventEmitter<void>();
  @Output() retryRate = new EventEmitter<void>();
}

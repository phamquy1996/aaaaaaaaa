import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  BackendDeleteResponse,
  BackendUpdateResponse,
  Datastore,
  RequestStatus,
} from '@freelancer/datastore';
import {
  ContestComment,
  ContestCommentsCollection,
  ContestQuickviewEntry,
  ContestViewContest,
  ParentContestComment,
  User,
} from '@freelancer/datastore/collections';
import { TimeUtils } from '@freelancer/time-utils';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontType, FontWeight } from '@freelancer/ui/text';
import { ToastAlertService } from '@freelancer/ui/toast-alert';
import * as Rx from 'rxjs';
import {
  DELETE_COMMENT_DEFAULT_ERROR_TOAST,
  DELETE_COMMENT_SUCCESS_TOAST,
  RETRY_TIMEOUT,
  UNDELETE_COMMENT_DEFAULT_ERROR_TOAST,
} from '../contest-comment-delete-toast/contest-comment-delete-toast.component';
import {
  MobileCommentsPage,
  MobileCommentsSource,
  ShowMobileRepliesDetails,
} from '../contest-comments-mobile/contest-comments-mobile.component';
import { EntryLinksMap } from './contest-comment-thread/contest-comment-item/contest-comment-item.component';

@Component({
  selector: 'app-contest-comment-list',
  template: `
    <!-- COMMENT LIST -->
    <ng-container
      *ngFor="
        let parentComment of parentComments$ | async;
        let first = first;
        trackBy: trackParentComment
      "
    >
      <fl-hr *ngIf="!first" [flMarginBottom]="Margin.SMALL"></fl-hr>
      <fl-bit [flMarginBottom]="Margin.SMALL">
        <app-contest-comment-thread
          [parentComment]="parentComment"
          [commentsSource]="commentsSource$ | async"
          [commentsUsers]="commentsUsers$ | async"
          [contest]="contest$ | async"
          [entry]="entry$ | async"
          [entryLinksMap]="entryLinksMap$ | async"
          [hasAwardedEntry]="hasAwardedEntry$ | async"
          [mobileCalloutPage]="mobileCalloutPage$ | async"
          [loggedInUser]="loggedInUser$ | async"
          [showReplyForm]="showReplyForm$ | async"
          (closeEntry)="closeEntry.emit()"
          (commentItemClicked)="commentItemClicked.emit($event)"
          (deleteComment)="onDeleteComment($event)"
          (reportComment)="onReportComment($event)"
          (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
          (showMobileReplies)="showMobileReplies.emit($event)"
        >
        </app-contest-comment-thread>
      </fl-bit>
    </ng-container>

    <ng-container *ngIf="parentCommentsFetchStatus$ | async as fetchStatus">
      <fl-bit class="ContestCommentList-statesContainer">
        <!-- LOADING STATE -->
        <fl-spinner
          *ngIf="!fetchStatus.ready && !fetchStatus.error"
          flTrackingLabel="LoadingMoreCommentsSpinner"
          [flMarginBottom]="Margin.SMALL"
          [size]="SpinnerSize.SMALL"
        ></fl-spinner>

        <!-- ERROR STATE -->
        <fl-bit
          *ngIf="!fetchStatus.ready && fetchStatus.error"
          class="ContestCommentList--centered"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-icon
            [name]="'ui-warning-alt-v2'"
            [color]="IconColor.CONTEST"
            [size]="IconSize.XLARGE"
            [flMarginBottom]="Margin.SMALL"
          ></fl-icon>
          <fl-text i18n="Failed to load comments text">
            Failed to load comments.
          </fl-text>
        </fl-bit>
      </fl-bit>

      <!-- VIEW MORE COMMENTS CTA -->
      <ng-container *ngIf="fetchStatus.ready && !fetchStatus.error">
        <fl-text
          *ngIf="
            (hasMoreParentComments$ | async) && !(mobileCalloutPage$ | async)
          "
          [weight]="FontWeight.MEDIUM"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-link
            i18n="View older comments button text"
            flTrackingLabel="ViewOlderComments"
            [color]="LinkColor.DARK"
            (click)="viewMoreComments.emit()"
          >
            <!-- FIXME: T182950 "View older comments" -> "View all comments ([entry count]) -->
            View older comments
          </fl-link>
        </fl-text>

        <fl-bit
          *ngIf="(parentComments$ | async)?.length === 0"
          class="ContestCommentList--centered"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-icon
            [name]="'ui-comment'"
            [flMarginBottom]="Margin.XXSMALL"
          ></fl-icon>
          <fl-text i18n="Be the first one to comment text">
            Be the first one to comment
          </fl-text>
        </fl-bit>
      </ng-container>
    </ng-container>

    <ng-container *ngFor="let deletedComment of deletedComments$ | async">
      <app-contest-comment-delete-toast
        [commentId]="deletedComment.id"
        [loading]="
          (commentUndeletePromisesMap.get(deletedComment.id) &&
            (commentUndeletePromisesMap.get(deletedComment.id) | async) ===
              null) ||
          (commentDeletePromisesMap.get(deletedComment.id) &&
            (commentDeletePromisesMap.get(deletedComment.id) | async) === null)
        "
        (undeleteComment)="onUndeleteComment(deletedComment)"
        (retryDeleteComment)="onRetryDeleteComment(deletedComment)"
        (retryUndeleteComment)="onRetryUndeleteComment(deletedComment)"
      >
      </app-contest-comment-delete-toast>
    </ng-container>
  `,
  styleUrls: [`./contest-comment-list.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentListComponent {
  FontType = FontType;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  Margin = Margin;
  SpinnerSize = SpinnerSize;

  @Input() commentsSource$?: Rx.Observable<MobileCommentsSource>;
  @Input() commentsUsers$: Rx.Observable<{ [key: number]: User }>;
  @Input() contest$: Rx.Observable<ContestViewContest>;
  @Input() entry$?: Rx.Observable<ContestQuickviewEntry>;
  @Input() entryLinksMap$?: Rx.Observable<EntryLinksMap>;
  @Input() hasAwardedEntry$?: Rx.Observable<boolean>;
  @Input() hasMoreParentComments$?: Rx.Observable<boolean>;
  @Input() loggedInUser$: Rx.Observable<User>;
  @Input() mobileCalloutPage$?: Rx.Observable<MobileCommentsPage>;
  @Input() parentCommentsFetchStatus$: Rx.Observable<
    RequestStatus<ContestCommentsCollection>
  >;
  @Input() parentComments$: Rx.Observable<ReadonlyArray<ParentContestComment>>;
  @Input() showReplyForm$?: Rx.Observable<boolean>;
  @Output() closeEntry = new EventEmitter<void>();
  @Output() commentItemClicked = new EventEmitter<number>();
  @Output() reportComment = new EventEmitter<ContestComment>();
  @Output() updateRepliesUserIds = new EventEmitter<ReadonlyArray<number>>();
  @Output() viewMoreComments = new EventEmitter<void>();
  @Output() showMobileReplies = new EventEmitter<ShowMobileRepliesDetails>();

  private deletedCommentsSubject$ = new Rx.BehaviorSubject<
    ReadonlyArray<ContestComment>
  >([]);

  commentDeletePromisesMap = new Map<
    number,
    Promise<BackendDeleteResponse<ContestCommentsCollection>>
  >();
  commentUndeletePromisesMap = new Map<
    number,
    Promise<BackendUpdateResponse<ContestCommentsCollection>>
  >();
  deletedComments$ = this.deletedCommentsSubject$.asObservable();

  constructor(
    private datastore: Datastore,
    private timeUtils: TimeUtils,
    private toastAlertService: ToastAlertService,
  ) {}

  onDeleteComment(comment: ContestComment) {
    // Add toast container
    this.deletedCommentsSubject$.next([
      ...this.deletedCommentsSubject$
        .getValue()
        .filter(deletedComment => deletedComment.id !== comment.id),
      comment,
    ]);

    // We can use parentCommentsCollection to delete both parent comments and replies
    const commentDeletePromise = this.datastore
      .collection<ContestCommentsCollection>('contestComments')
      .remove(comment.id);

    this.commentDeletePromisesMap.set(comment.id, commentDeletePromise);

    commentDeletePromise.then(response => {
      if (response.status === 'error') {
        this.toastAlertService.open(
          `${DELETE_COMMENT_DEFAULT_ERROR_TOAST}-${comment.id}`,
        );
      } else if (response.status === 'success') {
        this.toastAlertService.open(
          `${DELETE_COMMENT_SUCCESS_TOAST}-${comment.id}`,
        );
      }
    });
  }

  onReportComment(comment: ContestComment) {
    this.reportComment.emit(comment);
  }

  onUndeleteComment(comment: ContestComment) {
    // We can use parentCommentsCollection to undelete both parent comments and replies
    const commentUndeletePromise = this.datastore
      .collection<ContestCommentsCollection>('contestComments')
      .update(comment.id, {
        ...comment,
        isDeleted: false,
      });

    this.commentUndeletePromisesMap.set(comment.id, commentUndeletePromise);

    commentUndeletePromise.then(response => {
      this.toastAlertService.close(
        `${DELETE_COMMENT_SUCCESS_TOAST}-${comment.id}`,
      );

      if (response.status === 'error') {
        this.toastAlertService.open(
          `${UNDELETE_COMMENT_DEFAULT_ERROR_TOAST}-${comment.id}`,
        );
      }
    });
  }

  onRetryDeleteComment(comment: ContestComment) {
    this.toastAlertService.close(
      `${DELETE_COMMENT_DEFAULT_ERROR_TOAST}-${comment.id}`,
    );
    this.timeUtils.setTimeout(
      () => this.onDeleteComment(comment),
      RETRY_TIMEOUT,
    );
  }

  onRetryUndeleteComment(comment: ContestComment) {
    this.toastAlertService.close(
      `${UNDELETE_COMMENT_DEFAULT_ERROR_TOAST}-${comment.id}`,
    );
    this.timeUtils.setTimeout(
      () => this.onUndeleteComment(comment),
      RETRY_TIMEOUT,
    );
  }

  trackParentComment(_index: number, comment: ContestComment) {
    return comment.id;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Datastore,
  OrderByDirection,
  RequestStatus,
} from '@freelancer/datastore';
import {
  ContestComment,
  ContestCommentsCollection,
  ContestQuickviewEntry,
  ContestViewContest,
  ParentContestComment,
  ReplyContestComment,
  User,
} from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { ContestCommentContextTypeApi } from 'api-typings/contests/contests';
import * as Rx from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import {
  MobileCommentsPage,
  MobileCommentsSource,
  ShowMobileRepliesDetails,
} from '../../contest-comments-mobile/contest-comments-mobile.component';
import { EntryLinksMap } from './contest-comment-item/contest-comment-item.component';

@Component({
  selector: 'app-contest-comment-thread',
  template: `
    <!-- PARENT COMMENT -->
    <fl-bit [flMarginBottom]="Margin.XXSMALL">
      <app-contest-comment-item
        [comment]="parentComment"
        [commentUser]="commentsUsers[parentComment.fromUserId]"
        [contest]="contest"
        [entry]="entry"
        [entryLinksMap]="entryLinksMap"
        [hasAwardedEntry]="hasAwardedEntry"
        [isCompact]="isCompact"
        [loggedInUser]="loggedInUser"
        (closeEntry)="closeEntry.emit()"
        (commentItemClicked)="commentItemClicked.emit(parentComment.id)"
        (deleteComment)="onDeleteComment($event)"
        (reportComment)="onReportComment($event)"
        (replyToComment)="onReplyToComment()"
      >
      </app-contest-comment-item>
    </fl-bit>
    <!-- REPLIES LIST -->
    <fl-bit
      [flMarginBottom]="isCompact ? Margin.SMALL : Margin.NONE"
      [ngClass]="{ RepliesSection: !isCompact }"
    >
      <fl-bit *ngIf="!isCompact && showReplyForm">
        <ng-container *ngTemplateOutlet="replyForm"></ng-container>
      </fl-bit>
      <fl-bit
        *ngIf="
          repliesFetchStatus$ | async as fetchStatus;
          else viewMoreRepliesButton
        "
        [flMarginBottom]="Margin.XXSMALL"
      >
        <fl-spinner
          *ngIf="!fetchStatus.ready && !fetchStatus.error"
          flTrackingLabel="LoadingMoreRepliesSpinner"
          flTrackingReferenceType="parent_comment_id"
          flTrackingReferenceId="{{ parentComment.id }}"
          [flMarginBottom]="Margin.SMALL"
          [size]="SpinnerSize.SMALL"
        ></fl-spinner>

        <!-- FIXME: Fix error state styling when design has been updated -->
        <fl-bit
          class="QuickviewCommentList-error"
          *ngIf="!fetchStatus.ready && fetchStatus.error"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-text i18n="Failed to load comments text">
            Failed to load comments.
          </fl-text>
        </fl-bit>

        <ng-container *ngIf="fetchStatus.ready && !fetchStatus.error">
          <ng-container
            *ngTemplateOutlet="viewMoreRepliesButton"
          ></ng-container>
        </ng-container>
      </fl-bit>

      <ng-template #viewMoreRepliesButton>
        <fl-bit *ngIf="hiddenRepliesCount$ | async as hiddenRepliesCount">
          <fl-button
            *ngIf="hiddenRepliesCount > 0"
            flTrackingLabel="ViewMoreReplies"
            flTrackingReferenceType="parent_comment_id"
            flTrackingReferenceId="{{ parentComment.id }}"
            i18n="View more replies"
            (click)="onViewMoreReplies()"
          >
            <fl-text
              *ngIf="hiddenRepliesCount === 1; else pluralRepliesText"
              [size]="TextSize.XXSMALL"
              [weight]="FontWeight.MEDIUM"
            >
              View {{ hiddenRepliesCount }} more reply
            </fl-text>
            <ng-template #pluralRepliesText>
              <fl-text [size]="TextSize.XXSMALL" [weight]="FontWeight.MEDIUM">
                View {{ hiddenRepliesCount }} more replies
              </fl-text>
            </ng-template>
          </fl-button>
        </fl-bit>
      </ng-template>

      <fl-bit [ngClass]="{ 'RepliesSection-repliesList': !isCompact }">
        <fl-bit
          *ngFor="let reply of replies$ | async"
          [flMarginBottom]="Margin.SMALL"
        >
          <app-contest-comment-item
            [comment]="reply"
            [commentUser]="commentsUsers[reply.fromUserId]"
            [contest]="contest"
            [entry]="entry"
            [entryLinksMap]="entryLinksMap"
            [hasAwardedEntry]="hasAwardedEntry"
            [isCompact]="isCompact"
            [loggedInUser]="loggedInUser"
            (closeEntry)="closeEntry.emit()"
            (commentItemClicked)="commentItemClicked.emit(parentComment.id)"
            (deleteComment)="onDeleteComment($event)"
            (reportComment)="onReportComment($event)"
          >
          </app-contest-comment-item>
        </fl-bit>
      </fl-bit>
    </fl-bit>
    <ng-template #replyForm>
      <!-- We also pass the annotation coordinates in case a reply
      to an annotation is submitted to the main thread -->
      <app-contest-comment-form
        [annotationCoordinates]="{
          x: parentComment.annotationDetails?.coordinates.x,
          y: parentComment.annotationDetails?.coordinates.y
        }"
        [commentParentId]="parentComment.id"
        [contest]="contest"
        [entry]="entry"
        [formContext]="{
          contextId: parentComment.contextId,
          contextType: parentComment.contextType
        }"
        [loggedInUser]="loggedInUser"
        [showCtas]="!isCompact"
        (cancelComment)="showReplyForm = false"
        (closeEntry)="closeEntry.emit()"
        (submitSuccess)="onSubmitReply()"
      >
      </app-contest-comment-form>
    </ng-template>
    <fl-bit *ngIf="isCompact" class="RepliesSection-replyFormMobile">
      <ng-container *ngTemplateOutlet="replyForm"></ng-container>
    </fl-bit>
  `,
  styleUrls: [`./contest-comment-thread.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentThreadComponent
  implements OnChanges, OnDestroy, OnInit {
  FontWeight = FontWeight;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  TextSize = TextSize;

  ContestCommentContextTypeApi = ContestCommentContextTypeApi;

  @Input() commentsSource?: MobileCommentsSource;
  @Input() commentsUsers: { [key: number]: User };
  @Input() contest: ContestViewContest;
  @Input() entry?: ContestQuickviewEntry;
  @Input() entryLinksMap?: EntryLinksMap;
  @Input() hasAwardedEntry?: boolean;
  @Input() isCompact = false;
  @Input() loggedInUser: User;
  @Input() mobileCalloutPage?: MobileCommentsPage;
  @Input() parentComment: ParentContestComment;
  @Input() showReplyForm = false;
  @Output() closeEntry = new EventEmitter<void>();
  @Output() commentItemClicked = new EventEmitter<number>();
  @Output() deleteComment = new EventEmitter<ContestComment>();
  @Output() reportComment = new EventEmitter<ContestComment>();
  @Output() updateRepliesUserIds = new EventEmitter<ReadonlyArray<number>>();
  @Output() showMobileReplies = new EventEmitter<ShowMobileRepliesDetails>();

  readonly REPLIES_LIMIT_INCREMENT = 5;
  private repliesLimitSubject$ = new Rx.BehaviorSubject<number>(0);
  repliesLimit$ = this.repliesLimitSubject$.asObservable();
  replies$: Rx.Observable<ReadonlyArray<ReplyContestComment>>;
  hiddenRepliesCount$: Rx.Observable<number>;
  repliesFetchStatus$: Rx.Observable<RequestStatus<ContestCommentsCollection>>;
  repliesUsersIdsSubscription?: Rx.Subscription;

  private repliesCountSubject$ = new Rx.BehaviorSubject<number>(0);
  repliesCount$ = this.repliesCountSubject$.asObservable();
  displayedRepliesCount = 0;

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    // When viewing comment replies from the mobile callout interface, we want to
    // display the replies on page load
    if (this.mobileCalloutPage === MobileCommentsPage.REPLIES_THREAD) {
      this.onViewMoreReplies();
    }

    const repliesCollection = this.datastore.collection<
      ContestCommentsCollection
    >('contestComments', query =>
      query
        .where('parentId', '==', this.parentComment.id)
        .orderBy('dateLastComment', OrderByDirection.DESC)
        .limit(this.repliesLimit$.pipe(filter(limit => limit > 0))),
    );

    // When deleting a comment, it isn't removed from the collection, but instead
    // it's isDeleted field is set to true. This is so that we can support
    // undeleting the comment. On the template, we have to filter comments
    // based on isDeleted.
    // We also want to display the latest comments based on a limit in ascending order.
    // To get the latest comments without having to provide an offset, the backend
    // queries for comments in descending order with the limit. We then reverse the
    // list here to be displayed in ascending order
    this.replies$ = repliesCollection.valueChanges().pipe(
      startWith([]),
      map(comments =>
        comments
          .filter(comment => !comment.isDeleted)
          .slice()
          .reverse()
          .map(comment => comment as ReplyContestComment),
      ),
      tap(replies => (this.displayedRepliesCount = replies.length)),
    );

    this.repliesFetchStatus$ = repliesCollection.status$;

    this.hiddenRepliesCount$ = Rx.combineLatest([
      this.replies$,
      this.repliesCount$,
    ]).pipe(
      map(([replies, repliesCount]) =>
        repliesCount ? repliesCount - replies.length : 0,
      ),
    );

    const repliesUserIds$ = this.replies$.pipe(
      map(replies => replies.map(reply => reply.fromUserId)),
    );

    this.repliesUsersIdsSubscription = repliesUserIds$.subscribe(
      repliesUserIds => this.updateRepliesUserIds.emit(repliesUserIds),
    );
  }

  onViewMoreReplies() {
    if (
      this.mobileCalloutPage === MobileCommentsPage.PARENT_COMMENT_LIST ||
      this.commentsSource === MobileCommentsSource.CONTEST_COMMENTS_TAB
    ) {
      this.showMobileReplies.emit({
        parentComment: this.parentComment,
        showReplyForm: false,
      });
    } else {
      // Round off the current display limit to a multiple of 5 before incrementing it
      const newLimit =
        Math.round(this.displayedRepliesCount / this.REPLIES_LIMIT_INCREMENT) *
          this.REPLIES_LIMIT_INCREMENT +
        this.REPLIES_LIMIT_INCREMENT;

      // There are cases wherein the View More button is visible even though replies limit
      // is already equal to replies count. This happens when the # of new replies
      // is equal to the # of deleted comments. We force the datastore to fetch the new
      // replies by incrementing it again.
      this.repliesLimitSubject$.next(
        newLimit === this.repliesLimitSubject$.value
          ? newLimit + this.REPLIES_LIMIT_INCREMENT
          : newLimit,
      );
    }
  }

  onDeleteComment(comment: ContestComment) {
    this.deleteComment.emit(comment);
  }

  onReportComment(comment: ContestComment) {
    this.reportComment.emit(comment);
  }

  onSubmitReply() {
    this.showReplyForm = false;
    this.repliesLimitSubject$.next(this.repliesLimitSubject$.value + 1);
  }

  onReplyToComment() {
    if (
      this.mobileCalloutPage === MobileCommentsPage.PARENT_COMMENT_LIST ||
      this.commentsSource === MobileCommentsSource.CONTEST_COMMENTS_TAB
    ) {
      this.showMobileReplies.emit({
        parentComment: this.parentComment,
        showReplyForm: true,
      });
    } else {
      this.showReplyForm = !this.showReplyForm;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('parentComment' in changes) {
      this.repliesCountSubject$.next(this.parentComment.repliesCount || 0);
    }
  }

  ngOnDestroy() {
    if (this.repliesUsersIdsSubscription) {
      this.repliesUsersIdsSubscription.unsubscribe();
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RequestStatus } from '@freelancer/datastore';
import {
  ContestComment,
  ContestCommentsCollection,
  ContestQuickviewEntry,
  ContestViewContest,
  ParentContestComment,
  User,
} from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { CalloutComponent } from '@freelancer/ui/callout';
import { Margin } from '@freelancer/ui/margin';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CommentFormContext } from '../contest-comment-form/contest-comment-form.types';
import { EntryLinksMap } from '../contest-comment-list/contest-comment-thread/contest-comment-item/contest-comment-item.component';

export interface ShowMobileRepliesDetails {
  readonly parentComment: ContestComment;
  readonly showReplyForm: boolean;
}

export enum MobileCommentsPage {
  PARENT_COMMENT_LIST,
  REPLIES_THREAD,
}

export enum MobileCommentsSource {
  QUICKVIEW_COMMENTS_TAB,
  QUICKVIEW_ANNOTATIONS_TAB,
  CONTEST_COMMENTS_TAB,
}

@Component({
  selector: 'app-contest-comments-mobile',
  template: `
    <fl-callout
      #mobileCommentsCallout
      [hideCloseButton]="true"
      [mobileHeaderTitle]="
        (commentsSource$ | async) ===
        MobileCommentsSource.QUICKVIEW_ANNOTATIONS_TAB
          ? 'Annotations'
          : 'Comments'
      "
      [mobileFullscreen]="true"
      (calloutClose)="showMobileParentComments()"
    >
      <fl-callout-trigger class="ContestCommentsMobile-trigger">
        <ng-content></ng-content>
      </fl-callout-trigger>
      <fl-callout-content>
        <ng-container
          *ngIf="
            (currentPage$ | async) === MobileCommentsPage.PARENT_COMMENT_LIST &&
            (commentsSource$ | async) !==
              MobileCommentsSource.CONTEST_COMMENTS_TAB
          "
        >
          <fl-bit
            *ngIf="commentFormContext$ | async"
            [flMarginBottom]="Margin.SMALL"
          >
            <app-contest-comment-form
              [contest]="contest$ | async"
              [formContext]="commentFormContext$ | async"
              [loggedInUser]="loggedInUser$ | async"
              (closeEntry)="closeEntry.emit()"
            >
            </app-contest-comment-form>
          </fl-bit>
          <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
          <app-contest-comment-list
            [commentsUsers$]="commentsUsers$"
            [contest$]="contest$"
            [hasMoreParentComments$]="hasMoreParentComments$"
            [loggedInUser$]="loggedInUser$"
            [mobileCalloutPage$]="parentCommentListPage$"
            [parentCommentsFetchStatus$]="parentCommentsFetchStatus$"
            [parentComments$]="parentComments$"
            (closeEntry)="closeEntry.emit()"
            (reportComment)="reportComment.emit($event)"
            (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
            (viewMoreComments)="viewMoreComments.emit()"
            (showMobileReplies)="showMobileReplies($event)"
          >
          </app-contest-comment-list>
        </ng-container>

        <ng-container
          *ngIf="(currentPage$ | async) === MobileCommentsPage.REPLIES_THREAD"
        >
          <fl-bit
            *ngIf="
              !(
                (commentsSource$ | async) ===
                MobileCommentsSource.CONTEST_COMMENTS_TAB
              )
            "
            [flMarginBottom]="Margin.XSMALL"
          >
            <fl-link
              flTrackingLabel="BackToParentCommentsList"
              i18n="Back to parent comments list"
              (click)="showMobileParentComments()"
            >
              Back to all comments
            </fl-link>
          </fl-bit>
          <app-contest-comment-list
            [commentsUsers$]="commentsUsers$"
            [contest$]="contest$"
            [entry$]="entry$"
            [entryLinksMap$]="entryLinksMap$"
            [hasAwardedEntry$]="hasAwardedEntry$"
            [loggedInUser$]="loggedInUser$"
            [mobileCalloutPage$]="repliesThreadPage$"
            [parentCommentsFetchStatus$]="parentCommentsFetchStatus$"
            [parentComments$]="commentListForRepliesThread$"
            [showReplyForm$]="showReplyForm$"
            (closeEntry)="closeEntry.emit()"
            (reportComment)="reportComment.emit($event)"
            (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
          >
          </app-contest-comment-list>
        </ng-container>
      </fl-callout-content>
    </fl-callout>
  `,
  styleUrls: [`./contest-comments-mobile.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentsMobileComponent implements OnInit {
  ButtonColor = ButtonColor;
  Margin = Margin;
  MobileCommentsPage = MobileCommentsPage;
  MobileCommentsSource = MobileCommentsSource;

  @Input() commentFormContext$?: Rx.Observable<CommentFormContext>;
  @Input() commentsSource$: Rx.Observable<MobileCommentsSource>;
  @Input() commentsUsers$: Rx.Observable<{ [key: number]: User }>;
  @Input() contest$: Rx.Observable<ContestViewContest>;
  @Input() entry$?: Rx.Observable<ContestQuickviewEntry>;
  @Input() entryLinksMap$?: Rx.Observable<EntryLinksMap>;
  @Input() hasAwardedEntry$?: Rx.Observable<boolean>;
  @Input() hasMoreParentComments$: Rx.Observable<boolean>;
  @Input() loggedInUser$: Rx.Observable<User>;
  @Input() parentCommentsFetchStatus$: Rx.Observable<
    RequestStatus<ContestCommentsCollection>
  >;
  @Input() parentComments$: Rx.Observable<ReadonlyArray<ParentContestComment>>;
  @Output() closeEntry = new EventEmitter<void>();
  @Output() reportComment = new EventEmitter<ContestComment>();
  @Output() updateRepliesUserIds = new EventEmitter<ReadonlyArray<number>>();
  @Output() viewMoreComments = new EventEmitter<void>();

  @ViewChild('mobileCommentsCallout')
  mobileCommentsCallout: CalloutComponent;

  commentListForRepliesThread$: Rx.Observable<
    ReadonlyArray<ParentContestComment>
  >;
  parentCommentListPage$: Rx.Observable<MobileCommentsPage> = Rx.of(
    MobileCommentsPage.PARENT_COMMENT_LIST,
  );
  repliesThreadPage$: Rx.Observable<MobileCommentsPage> = Rx.of(
    MobileCommentsPage.REPLIES_THREAD,
  );

  private parentCommentForRepliesSubject$ = new Rx.BehaviorSubject<
    ContestComment | undefined
  >(undefined);
  parentCommentForReplies$ = this.parentCommentForRepliesSubject$.asObservable();

  private currentPageSubject$ = new Rx.BehaviorSubject<MobileCommentsPage>(
    MobileCommentsPage.PARENT_COMMENT_LIST,
  );
  currentPage$ = this.currentPageSubject$.asObservable();

  private showReplyFormSubject$ = new Rx.BehaviorSubject<boolean>(false);
  showReplyForm$ = this.showReplyFormSubject$.asObservable();

  ngOnInit() {
    // The parentCommentForReplies$ is a BehaviorSubject and doesn't update with the DS calls
    // for delete/undelete. So we get the parent comment from parentComments$ instead
    this.commentListForRepliesThread$ = Rx.combineLatest([
      this.parentComments$,
      this.parentCommentForReplies$.pipe(filter(isDefined)),
    ]).pipe(
      map(([parentComments, parentCommentForReplies]) =>
        parentComments.filter(
          parentComment => parentComment.id === parentCommentForReplies.id,
        ),
      ),
    );
  }

  openCallout() {
    this.mobileCommentsCallout.open();
  }

  showMobileReplies(details: ShowMobileRepliesDetails) {
    this.currentPageSubject$.next(MobileCommentsPage.REPLIES_THREAD);
    this.parentCommentForRepliesSubject$.next(details.parentComment);
    this.showReplyFormSubject$.next(details.showReplyForm);
  }

  showMobileParentComments() {
    this.currentPageSubject$.next(MobileCommentsPage.PARENT_COMMENT_LIST);
  }
}

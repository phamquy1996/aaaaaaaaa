import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DatastoreCollection, RequestStatus } from '@freelancer/datastore';
import {
  ContestComment,
  ContestCommentsCollection,
  ContestEntryFileType,
  ContestQuickviewEntry,
  ContestViewContest,
  ParentContestComment,
  User,
} from '@freelancer/datastore/collections';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TabsBorder } from '@freelancer/ui/tabs';
import { ContestCommentContextTypeApi } from 'api-typings/contests/contests';
import * as Rx from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContestCommentFormComponent } from '../../../../contest-comments/contest-comment-form/contest-comment-form.component';
import { CommentFormContext } from '../../../../contest-comments/contest-comment-form/contest-comment-form.types';
import { MobileCommentsSource } from '../../../../contest-comments/contest-comments-mobile/contest-comments-mobile.component';

export enum QuickviewCommentsTab {
  COMMENTS,
  ANNOTATIONS,
}

@Component({
  selector: 'app-quickview-modal-comments-section',
  template: `
    <fl-tabs>
      <fl-tab-item
        flTrackingLabel="CommentsTab"
        title="Comments"
        i18n-title="Comments tab title"
        [selected]="
          (currentTab$ | async) === QuickviewCommentsTab.COMMENTS ||
          !(hasAnnotations$ | async)
        "
        (click)="selectTab.emit(QuickviewCommentsTab.COMMENTS)"
      ></fl-tab-item>
      <fl-tab-item
        *ngIf="
          (hasAnnotations$ | async) &&
          (currentFileType$ | async) === ContestEntryFileType.IMAGE
        "
        flTrackingLabel="AnnotationsTab"
        title="Annotations"
        i18n-title="Annotations tab title"
        [selected]="(currentTab$ | async) === QuickviewCommentsTab.ANNOTATIONS"
        (click)="selectTab.emit(QuickviewCommentsTab.ANNOTATIONS)"
      ></fl-tab-item>
    </fl-tabs>
    <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>

    <ng-container
      *ngIf="(currentTab$ | async) === QuickviewCommentsTab.COMMENTS"
    >
      <app-contest-comments-mobile
        [flShowMobile]="true"
        [commentFormContext$]="commentFormContext$"
        [commentsSource$]="mobileCommentsTabSource$"
        [commentsUsers$]="commentsUsers$"
        [entry$]="entry$"
        [contest$]="contest$"
        [entry$]="entry$"
        [hasMoreParentComments$]="hasMoreParentComments$"
        [loggedInUser$]="loggedInUser$"
        [parentCommentsFetchStatus$]="parentCommentsFetchStatus$"
        [parentComments$]="parentComments$"
        (closeEntry)="closeEntry.emit()"
        (reportComment)="onReportComment($event)"
        (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
        (viewMoreComments)="viewMoreComments.emit()"
      >
        <ng-container
          *ngTemplateOutlet="
            mobileCalloutTrigger;
            context: { fetchStatus$: parentCommentsFetchStatus$ }
          "
        ></ng-container>
      </app-contest-comments-mobile>

      <fl-bit [flHideMobile]="true">
        <fl-bit [flMarginBottom]="Margin.SMALL">
          <app-contest-comment-form
            [contest]="contest$ | async"
            [formContext]="commentFormContext$ | async"
            [loggedInUser]="loggedInUser$ | async"
            (closeEntry)="closeEntry.emit()"
          >
          </app-contest-comment-form>
        </fl-bit>
        <!-- FIXME: T182950 Hide divider below if there are no comments -->
        <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
        <app-contest-comment-list
          [commentsUsers$]="commentsUsers$"
          [contest$]="contest$"
          [hasMoreParentComments$]="hasMoreParentComments$"
          [loggedInUser$]="loggedInUser$"
          [parentCommentsFetchStatus$]="parentCommentsFetchStatus$"
          [parentComments$]="parentComments$"
          (closeEntry)="closeEntry.emit()"
          (reportComment)="onReportComment($event)"
          (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
          (viewMoreComments)="viewMoreComments.emit()"
        >
        </app-contest-comment-list>
      </fl-bit>
    </ng-container>

    <ng-container
      *ngIf="(currentTab$ | async) === QuickviewCommentsTab.ANNOTATIONS"
    >
      <fl-bit [flShowMobile]="true">
        <fl-bit
          class="QuickviewCommentsSection-annotationDescription"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-icon
            [name]="'ui-pin'"
            [color]="IconColor.DARK"
            [flMarginRight]="Margin.SMALL"
          ></fl-icon>
          <fl-text i18n="Long press on the image to add an annotation text">
            Long press on the image to add an annotation
          </fl-text>
        </fl-bit>
        <app-contest-comments-mobile
          [commentsSource$]="mobileAnnotationsTabSource$"
          [commentsUsers$]="commentsUsers$"
          [contest$]="contest$"
          [entry$]="entry$"
          [hasMoreParentComments$]="hasMoreParentAnnotations$"
          [loggedInUser$]="loggedInUser$"
          [parentCommentsFetchStatus$]="parentAnnotationsFetchStatus$"
          [parentComments$]="parentAnnotations$"
          (closeEntry)="closeEntry.emit()"
          (reportComment)="onReportComment($event)"
          (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
          (viewMoreComments)="viewMoreComments.emit()"
        >
          <ng-container
            *ngTemplateOutlet="
              mobileCalloutTrigger;
              context: { fetchStatus$: parentAnnotationsFetchStatus$ }
            "
          ></ng-container>
        </app-contest-comments-mobile>
      </fl-bit>
      <app-contest-comment-list
        [flHideMobile]="true"
        [commentsUsers$]="commentsUsers$"
        [contest$]="contest$"
        [entry$]="entry$"
        [hasMoreParentComments$]="hasMoreParentAnnotations$"
        [loggedInUser$]="loggedInUser$"
        [parentCommentsFetchStatus$]="parentAnnotationsFetchStatus$"
        [parentComments$]="parentAnnotations$"
        (closeEntry)="closeEntry.emit()"
        (commentItemClicked)="commentItemClicked.emit($event)"
        (reportComment)="onReportComment($event)"
        (updateRepliesUserIds)="updateRepliesUserIds.emit($event)"
        (viewMoreComments)="viewMoreComments.emit()"
      >
      </app-contest-comment-list>
    </ng-container>

    <ng-template #mobileCalloutTrigger let-fetchStatus$="fetchStatus$">
      <fl-bit class="QuickviewCommentsSection-mobileCallout-trigger">
        <!-- Note: We need this overlay to prevent click events in contest-comment-list -->
        <fl-bit class="QuickviewCommentsSection-mobileCallout-overlay">
        </fl-bit>
        <app-contest-comment-list
          [commentsUsers$]="commentsUsers$"
          [contest$]="contest$"
          [loggedInUser$]="loggedInUser$"
          [parentCommentsFetchStatus$]="fetchStatus$"
          [parentComments$]="commentListForMobileCalloutTrigger$"
        >
        </app-contest-comment-list>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: [`./quickview-modal-comments-section.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickviewModalCommentsSectionComponent implements OnInit {
  IconColor = IconColor;
  Margin = Margin;
  TabsBorder = TabsBorder;

  ContestEntryFileType = ContestEntryFileType;
  QuickviewCommentsTab = QuickviewCommentsTab;

  @Input() commentsUsers$: Rx.Observable<{ [key: number]: User }>;
  @Input() currentFileType$: Rx.Observable<ContestEntryFileType>;
  @Input() currentTab$: Rx.Observable<QuickviewCommentsTab>;
  @Input() entry$: Rx.Observable<ContestQuickviewEntry>;
  @Input() contest$: Rx.Observable<ContestViewContest>;
  @Input() hasMoreParentComments$: Rx.Observable<boolean>;
  @Input() hasMoreParentAnnotations$: Rx.Observable<boolean>;
  @Input() loggedInUser$: Rx.Observable<User>;
  @Input() parentCommentsCollection: DatastoreCollection<
    ContestCommentsCollection
  >;
  @Input() parentAnnotationsCollection: DatastoreCollection<
    ContestCommentsCollection
  >;
  @Output() closeEntry = new EventEmitter<void>();
  @Output() commentItemClicked = new EventEmitter<number>();
  @Output() reportComment = new EventEmitter<ContestComment>();
  @Output() updateRepliesUserIds = new EventEmitter<ReadonlyArray<number>>();
  @Output() viewMoreComments = new EventEmitter<void>();
  @Output() selectTab = new EventEmitter<QuickviewCommentsTab>();

  hasAnnotations$: Rx.Observable<boolean>;
  commentFormContext$: Rx.Observable<CommentFormContext>;
  commentListForMobileCalloutTrigger$: Rx.Observable<
    ReadonlyArray<ParentContestComment>
  >;
  parentAnnotations$: Rx.Observable<ReadonlyArray<ParentContestComment>>;
  parentAnnotationsFetchStatus$: Rx.Observable<
    RequestStatus<ContestCommentsCollection>
  >;
  parentComments$: Rx.Observable<ReadonlyArray<ParentContestComment>>;
  parentCommentsFetchStatus$: Rx.Observable<
    RequestStatus<ContestCommentsCollection>
  >;
  mobileCommentsTabSource$: Rx.Observable<MobileCommentsSource> = Rx.of(
    MobileCommentsSource.QUICKVIEW_COMMENTS_TAB,
  );
  mobileAnnotationsTabSource$: Rx.Observable<MobileCommentsSource> = Rx.of(
    MobileCommentsSource.QUICKVIEW_ANNOTATIONS_TAB,
  );

  @ViewChild(ContestCommentFormComponent)
  quickviewModalCommentForm: ContestCommentFormComponent;

  ngOnInit() {
    // When deleting a comment, it isn't removed from the collection, but instead
    // it's isDeleted field is set to true. This is so that we can support
    // undeleting the comment. On the template, we have to filter comments
    // based on isDeleted.
    this.parentComments$ = this.parentCommentsCollection
      .valueChanges()
      .pipe(
        map(comments =>
          comments
            .filter(comment => !comment.isDeleted)
            .map(comment => comment as ParentContestComment),
        ),
      );
    this.parentCommentsFetchStatus$ = this.parentCommentsCollection.status$;

    this.parentAnnotations$ = this.parentAnnotationsCollection
      .valueChanges()
      .pipe(
        map(annotations =>
          annotations
            .filter(annotation => !annotation.isDeleted)
            .map(comment => comment as ParentContestComment),
        ),
      );
    this.parentAnnotationsFetchStatus$ = this.parentAnnotationsCollection.status$;

    // This will be used for the mobile comments callout trigger, which is a list
    // that contains only the first parent comment
    this.commentListForMobileCalloutTrigger$ = Rx.combineLatest([
      this.parentComments$,
      this.parentAnnotations$,
      this.currentTab$,
    ]).pipe(
      map(([parentComments, parentAnnotations, currentTab]) => {
        const comments =
          currentTab === QuickviewCommentsTab.COMMENTS
            ? parentComments
            : parentAnnotations;
        return comments.length > 0 ? [comments[0]] : [];
      }),
    );

    this.hasAnnotations$ = this.parentAnnotations$.pipe(
      map(parentAnnotations => parentAnnotations.length > 0),
    );

    this.commentFormContext$ = this.entry$.pipe(
      map(entry => ({
        contextType: ContestCommentContextTypeApi.ENTRY,
        contextId: entry.id,
      })),
      tap(_ => {
        if (this.quickviewModalCommentForm) {
          this.quickviewModalCommentForm.resetForm();
        }
      }),
    );
  }

  onReportComment(comment: ContestComment) {
    this.reportComment.emit(comment);
  }
}

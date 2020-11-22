import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  BackendAllErrorCodes,
  BackendPushResponse,
  BackendUpdateResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  ContestComment,
  ContestCommentsCollection,
  ContestCommentType,
  ContestQuickviewEntry,
  ContestViewContest,
  User,
} from '@freelancer/datastore/collections';
import { AutoGrowDirective } from '@freelancer/directives';
import { TimeUtils } from '@freelancer/time-utils';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import {
  containsContactDetailsRegex,
  maxLength,
} from '@freelancer/ui/validators';
import { ContestCommentContextTypeApi } from 'api-typings/contests/contests';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import {
  AnnotationCoordinates,
  CommentFormContext,
} from './contest-comment-form.types';

@Component({
  selector: 'app-contest-comment-form',
  template: `
    <fl-bit
      class="ContestCommentForm-form"
      [flMarginBottom]="
        textareaFocused || commentControl.value || showCtas
          ? Margin.XSMALL
          : Margin.NONE
      "
    >
      <fl-user-avatar
        *ngIf="showAvatar"
        [flHideDesktop]="true"
        [flMarginRight]="Margin.XXSMALL"
        [size]="AvatarSize.SMALL"
        [users]="[loggedInUser]"
      ></fl-user-avatar>
      <fl-user-avatar
        *ngIf="showAvatar"
        [flMarginRight]="Margin.XXSMALL"
        [flShowDesktop]="true"
        [users]="[loggedInUser]"
      ></fl-user-avatar>
      <fl-bit class="ContestCommentForm-form-content">
        <fl-textarea
          flTrackingLabel="CommentForm"
          placeholder="Add a comment..."
          i18n-placeholder="Add a comment text"
          [control]="commentControl"
          [disabled]="submitResponse$ && (submitResponse$ | async) === null"
          [rows]="showLargeForm ? 3 : 1"
          [flAutoGrow]="commentControl"
          [flAutoGrowMaxHeight]="FORM_MAX_HEIGHT"
          (inputBlur)="textareaFocused = false"
          (inputFocus)="textareaFocused = !textareaFocused"
        ></fl-textarea>
        <app-contest-comment-form-messages
          [commentHasContactDetails]="commentContainsContactDetails$ | async"
          [commentType]="formContext?.contextType || comment?.contextType"
          [error]="formError$ | async"
          [isContestHolder]="loggedInUser?.id === contest?.ownerId"
          (cancelComment)="resetForm()"
          (closeEntry)="closeEntry.emit()"
          (retrySubmitComment)="
            comment ? handleSaveComment() : handleSubmitComment()
          "
          (submitCommentToMainThread)="handleSubmitCommentToMainThread()"
        >
        </app-contest-comment-form-messages>
      </fl-bit>
    </fl-bit>
    <fl-bit
      *ngIf="textareaFocused || commentControl.value || showCtas"
      class="ContestCommentForm-ctas"
    >
      <fl-button
        i18n="Contest comments cancel button text"
        flTrackingLabel="CancelComment"
        [disabled]="submitResponse$ && (submitResponse$ | async) === null"
        [color]="ButtonColor.DEFAULT"
        [flMarginRight]="Margin.XXSMALL"
        [size]="ButtonSize.SMALL"
        (click)="resetForm()"
      >
        Cancel
      </fl-button>
      <fl-button
        *ngIf="!comment; else editMode"
        i18n="Contest comments submit button text"
        flTrackingLabel="SubmitComment"
        [busy]="submitResponse$ && (submitResponse$ | async) === null"
        [disabled]="!(isCommentValid$ | async)"
        [color]="ButtonColor.SECONDARY"
        [size]="ButtonSize.SMALL"
        (click)="handleSubmitComment()"
      >
        Post
      </fl-button>
      <ng-template #editMode>
        <fl-button
          i18n="Contest comments save button text"
          flTrackingLabel="SaveComment"
          [busy]="submitResponse$ && (submitResponse$ | async) === null"
          [disabled]="!(isCommentValid$ | async)"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          (click)="handleSaveComment()"
        >
          Save
        </fl-button>
      </ng-template>
    </fl-bit>
  `,
  styleUrls: [`./contest-comment-form.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentFormComponent
  implements AfterViewInit, OnChanges, OnInit {
  AvatarSize = AvatarSize;
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  Margin = Margin;

  @Input() annotationCoordinates?: AnnotationCoordinates;
  @Input() commentParentId?: number;
  @Input() comment?: ContestComment;
  @Input() contest: ContestViewContest;
  @Input() entry?: ContestQuickviewEntry;
  @Input() formContext?: CommentFormContext;
  @Input() loggedInUser: User;
  @Input() showAvatar = true;
  @Input() showCtas = false;
  @Input() showLargeForm = false;
  @Output() cancelComment = new EventEmitter<void>();
  @Output() closeEntry = new EventEmitter<void>();
  @Output() submitSuccess = new EventEmitter<number>();

  @ViewChild(AutoGrowDirective, { static: true })
  textareaAutogrow: AutoGrowDirective;

  readonly FORM_MAX_HEIGHT = 200;
  readonly COMMENT_MAX_CHAR_COUNT = 1000;
  textareaFocused = false;

  commentControl = new FormControl(
    '',
    Validators.compose([
      maxLength(
        this.COMMENT_MAX_CHAR_COUNT,
        $localize`Please enter at most ${this.COMMENT_MAX_CHAR_COUNT} characters`,
      ),
    ]),
  );

  isCommentValid$: Rx.Observable<boolean>;
  commentContainsContactDetails$: Rx.Observable<boolean>;
  submitResponse$: Promise<
    | BackendPushResponse<ContestCommentsCollection>
    | BackendUpdateResponse<ContestCommentsCollection>
  >;

  private formErrorSubject$ = new Rx.BehaviorSubject<
    BackendAllErrorCodes | undefined
  >(undefined);
  formError$ = this.formErrorSubject$.asObservable();

  constructor(private datastore: Datastore, private timeUtils: TimeUtils) {}

  ngOnInit() {
    this.isCommentValid$ = this.commentControl.valueChanges.pipe(
      map(
        value =>
          this.commentControl.valid &&
          value?.trim() &&
          value !== this.comment?.comment,
      ),
      tap(_ => this.formErrorSubject$.next(undefined)),
      startWith(false),
    );

    this.commentContainsContactDetails$ = this.commentControl.valueChanges.pipe(
      map(comment => comment?.match(containsContactDetailsRegex)),
      distinctUntilChanged(),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('comment' in changes) {
      this.commentControl.reset(this.comment?.comment);
    }
  }

  ngAfterViewInit() {
    // Render textarea height when this component becomes visible in the dom
    this.timeUtils.setTimeout(() => this.textareaAutogrow.adjust(), 0);
  }

  resetForm() {
    this.formErrorSubject$.next(undefined);
    this.commentControl.reset(this.comment?.comment);
    this.cancelComment.emit();
  }

  handleSubmitCommentToMainThread() {
    this.commentParentId = undefined;
    this.handleSubmitComment();
  }

  handleSubmitComment() {
    if (!this.formContext) {
      throw new Error('Missing form context required for posting comments');
    }

    this.formErrorSubject$.next(undefined);

    this.submitResponse$ = this.datastore
      .collection<ContestCommentsCollection>('contestComments')
      .push({
        // Replies to annotation are of type Entry
        contextType:
          this.commentParentId &&
          this.formContext.contextType ===
            ContestCommentContextTypeApi.ANNOTATION
            ? ContestCommentContextTypeApi.ENTRY
            : this.formContext.contextType,
        contextId:
          this.entry?.id &&
          this.commentParentId &&
          this.formContext.contextType ===
            ContestCommentContextTypeApi.ANNOTATION
            ? this.entry?.id
            : this.formContext.contextId,
        comment: this.commentControl.value,
        fromUserId: this.loggedInUser.id,
        parentId: this.commentParentId,
        annotationDetails:
          this.annotationCoordinates &&
          this.formContext.contextType ===
            ContestCommentContextTypeApi.ANNOTATION
            ? {
                coordinates: {
                  x: this.annotationCoordinates.x,
                  y: this.annotationCoordinates.y,
                },
                fileId: this.formContext.contextId,
              }
            : undefined,
        type: ContestCommentType.PARENT,
        extraForPost: {
          contestId: this.contest.id,
          entryId: this.entry?.id,
        },
        isDeleted: false,
      } as ContestComment)
      .then(result => {
        if (result.status === 'success') {
          this.commentControl.reset('');
          this.submitSuccess.emit(result.id);
        } else {
          this.formErrorSubject$.next(result.errorCode);
        }
        return result;
      });
  }

  handleSaveComment() {
    if (!this.comment?.id) {
      throw new Error('Missing comment ID required for editing a comment');
    }

    this.formErrorSubject$.next(undefined);

    this.submitResponse$ = this.datastore
      .collection<ContestCommentsCollection>('contestComments')
      .update(this.comment?.id, {
        comment: this.commentControl.value,
      });

    this.submitResponse$.then(result => {
      if (result.status === 'success') {
        this.submitSuccess.emit();
      } else {
        this.formErrorSubject$.next(result.errorCode);
      }
    });
  }
}

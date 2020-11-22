import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ContestComment,
  ContestCommentType,
  ContestQuickviewEntry,
  ContestViewContest,
  User,
} from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { MoreOptionsSize } from '@freelancer/ui/more-options';
import { FontType, FontWeight } from '@freelancer/ui/text';
import { ContestStatusApi } from 'api-typings/contests/contests';
import { MAX_CONTEST_BUDGET } from 'app/contests/contest-view/contest-details-tab/contest-details/contest-details.component';
import { ContestTab } from 'app/contests/contest-view/contest-view-header/contest-view-header.component';

enum CommentWordType {
  UPGRADE_LINK,
  UPGRADE_APPLIED,
  ENTRY_NUMBER,
  PLAIN_TEXT,
}

enum UpgradeTags {
  EXTENDED = '#extended',
  GUARANTEED = '#guaranteed',
  SEALED = '#sealed',
  INCREASE_PRIZE = '#increaseprize',
}

interface CommentChunk {
  text: string;
  type: CommentWordType;
}

export interface EntryLinksMap {
  [key: string]: string;
}

@Component({
  selector: 'app-contest-comment-item',
  template: `
    <fl-comment-ui
      class="ContestCommentItem"
      flTrackingLabel="ContestCommentItem"
      [avatar]="commentUser?.avatar"
      [displayName]="commentUser?.displayName"
      [isCompact]="isCompact"
      [isEditMode]="isEditMode"
      [timeCreated]="comment.timestamp"
      [username]="commentUser?.username"
      [useCustomUserTitle]="contest?.ownerId === commentUser?.id"
      (click)="commentItemClicked.emit()"
    >
      <fl-comment-ui-content>
        <fl-text class="ContestCommentItem-content" [displayLineBreaks]="true">
          <ng-container *ngIf="!entry; else plainTextComment">
            <ng-container *ngFor="let item of parsedComment">
              <ng-container [ngSwitch]="item.type">
                <fl-link
                  *ngSwitchCase="CommentWordType.ENTRY_NUMBER"
                  flTrackingLabel="ContestEntryNumber"
                  [link]="entryLinksMap ? entryLinksMap[item.text] : undefined"
                  >{{ item.text }}</fl-link
                >
                <fl-link
                  *ngSwitchCase="CommentWordType.UPGRADE_LINK"
                  flTrackingLabel="ContestUpgrade"
                  (click)="handleUpgradeTagClick(item.text)"
                  >{{ item.text }}</fl-link
                >
                <fl-text
                  *ngSwitchCase="CommentWordType.UPGRADE_APPLIED"
                  [fontType]="FontType.SPAN"
                  [weight]="FontWeight.BOLD"
                  >{{ item.text }}</fl-text
                >
                <ng-container *ngSwitchCase="CommentWordType.PLAIN_TEXT">{{
                  item.text
                }}</ng-container>
              </ng-container>
            </ng-container>
          </ng-container>
          <ng-template #plainTextComment>
            {{ comment.comment }}
          </ng-template>
        </fl-text>
      </fl-comment-ui-content>

      <fl-comment-ui-custom-user-title i18n="Contest Holder text">
        Contest Holder
      </fl-comment-ui-custom-user-title>

      <fl-comment-ui-actions
        *ngIf="comment.type === ContestCommentType.PARENT && !isCompact"
      >
        <fl-comment-ui-action
          i18n="Reply button text"
          flTrackingLabel="ReplyButton"
          [icon]="'ui-comment'"
          (action)="onReplyToComment()"
        >
          Reply
        </fl-comment-ui-action>
      </fl-comment-ui-actions>

      <fl-comment-ui-options>
        <fl-more-options
          *ngIf="!isCompact; else displayedOptions"
          [size]="MoreOptionsSize.XSMALL"
        >
          <!-- stopPropagation stop comments callout from closing -->
          <fl-more-options-item
            *ngIf="this.commentUser?.id === this.loggedInUser?.id"
            i18n="Edit button text"
            flTrackingLabel="EditComment"
            (click)="$event.stopPropagation(); isEditMode = true"
          >
            Edit
          </fl-more-options-item>
          <fl-more-options-item
            *ngIf="!(this.commentUser?.id === this.loggedInUser?.id)"
            i18n="Report button text"
            flTrackingLabel="ReportComment"
            (click)="onReportComment()"
          >
            Report
          </fl-more-options-item>
          <fl-more-options-item
            *ngIf="
              this.loggedInUser?.id === this.commentUser?.id ||
              this.loggedInUser?.id === this.contest?.ownerId
            "
            i18n="Delete button text"
            flTrackingLabel="DeleteComment"
            (click)="onDeleteComment($event)"
          >
            Delete
          </fl-more-options-item>
        </fl-more-options>
        <ng-template #displayedOptions>
          <fl-bit class="ContestCommentItem-options">
            <fl-bit
              *ngIf="this.commentUser?.id === this.loggedInUser?.id"
              class="ContestCommentItem-options-item"
            >
              <fl-link
                i18n="Edit button text"
                flTrackingLabel="EditComment"
                (click)="isEditMode = true"
              >
                Edit
              </fl-link>
            </fl-bit>
            <fl-bit
              *ngIf="this.commentUser?.id !== this.loggedInUser?.id"
              class="ContestCommentItem-options-item"
            >
              <fl-link
                i18n="Report button text"
                flTrackingLabel="ReportComment"
                (click)="onReportComment()"
              >
                Report
              </fl-link>
            </fl-bit>
            <fl-bit
              *ngIf="
                this.loggedInUser?.id === this.commentUser?.id ||
                this.loggedInUser?.id === this.contest?.ownerId
              "
              class="ContestCommentItem-options-item"
            >
              <fl-link
                i18n="Delete button text"
                flTrackingLabel="DeleteComment"
                (click)="onDeleteComment($event)"
              >
                Delete
              </fl-link>
            </fl-bit>
          </fl-bit>
        </ng-template>
      </fl-comment-ui-options>

      <fl-comment-ui-edit-form>
        <app-contest-comment-form
          *ngIf="isEditMode"
          [comment]="comment"
          [contest]="contest"
          [entry]="entry"
          [loggedInUser]="loggedInUser"
          [showAvatar]="false"
          [showCtas]="true"
          (cancelComment)="isEditMode = false"
          (closeEntry)="closeEntry.emit()"
          (submitSuccess)="isEditMode = false"
        >
        </app-contest-comment-form>
      </fl-comment-ui-edit-form>
    </fl-comment-ui>
  `,
  styleUrls: [`./contest-comment-item.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestCommentItemComponent implements OnChanges {
  FontType = FontType;
  FontWeight = FontWeight;
  Margin = Margin;
  MoreOptionsSize = MoreOptionsSize;

  CommentWordType = CommentWordType;
  ContestCommentType = ContestCommentType;

  @Input() comment: ContestComment;
  @Input() commentUser: User;
  @Input() contest: ContestViewContest;
  @Input() entry?: ContestQuickviewEntry;
  @Input() entryLinksMap?: EntryLinksMap;
  @Input() isCompact = false;
  @Input() hasAwardedEntry?: boolean;
  @Input() loggedInUser: User;
  @Output() closeEntry = new EventEmitter<void>();
  @Output() commentItemClicked = new EventEmitter<void>();
  @Output() deleteComment = new EventEmitter<ContestComment>();
  @Output() reportComment = new EventEmitter<ContestComment>();
  @Output() replyToComment = new EventEmitter<void>();

  readonly DELIMITER_REGEX = /(\s|[!,.]+)/g;
  parsedComment: ReadonlyArray<CommentChunk>;
  isEditMode = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      'comment' in changes ||
      'entryLinksMap' in changes ||
      'contest' in changes
    ) {
      this.parsedComment = this.comment.comment
        .split(this.DELIMITER_REGEX)
        .map(commentWord => ({
          text: commentWord,
          type: this.getCommentWordType(commentWord),
        }));
    }
  }

  getCommentWordType(commentWord: string): CommentWordType {
    if (this.entryLinksMap && commentWord in this.entryLinksMap) {
      return CommentWordType.ENTRY_NUMBER;
    }

    const commentWordLower = commentWord.toLowerCase();
    if (
      Object.values<string>(UpgradeTags).includes(commentWordLower) &&
      this.comment.fromUserId !== this.contest.ownerId &&
      !this.hasAwardedEntry &&
      ![ContestStatusApi.INACTIVE, ContestStatusApi.CLOSED].includes(
        this.contest.status,
      )
    ) {
      if (
        (commentWordLower === UpgradeTags.GUARANTEED &&
          this.contest.upgrades?.guaranteed) ||
        (commentWordLower === UpgradeTags.SEALED &&
          this.contest.upgrades?.sealed) ||
        (commentWordLower === UpgradeTags.INCREASE_PRIZE &&
          (this.contest.prize || 0) >= MAX_CONTEST_BUDGET)
      ) {
        return CommentWordType.UPGRADE_APPLIED;
      }
      return CommentWordType.UPGRADE_LINK;
    }

    return CommentWordType.PLAIN_TEXT;
  }

  onDeleteComment(event: MouseEvent) {
    // Stop comments callout from closing
    event.stopPropagation();
    this.deleteComment.emit(this.comment);
  }

  onReportComment() {
    this.reportComment.emit(this.comment);
  }

  onReplyToComment() {
    this.replyToComment.emit();
  }

  handleUpgradeTagClick(upgradeTag: string) {
    if (this.loggedInUser.id !== this.contest.ownerId) {
      return;
    }

    let queryParams;
    let tab;
    switch (upgradeTag.toLowerCase()) {
      case UpgradeTags.GUARANTEED:
        tab = ContestTab.UPGRADES;
        queryParams = { guaranteed: true };
        break;
      case UpgradeTags.SEALED:
        tab = ContestTab.UPGRADES;
        queryParams = { sealed: true };
        break;
      case UpgradeTags.EXTENDED:
        tab = ContestTab.UPGRADES;
        queryParams = { extend: true };
        break;
      case UpgradeTags.INCREASE_PRIZE:
        tab = ContestTab.DETAILS;
        queryParams = { edit: true, contest_prize: true };
        break;
      default:
        break;
    }

    this.router.navigate([tab], {
      relativeTo: this.activatedRoute.parent,
      queryParamsHandling: 'merge',
      queryParams,
    });
  }
}

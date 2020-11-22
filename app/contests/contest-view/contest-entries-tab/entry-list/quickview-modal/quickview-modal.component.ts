import { DOCUMENT, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Auth } from '@freelancer/auth';
import {
  arrayIsShallowEqual,
  asObject,
  BackendUpdateResponse,
  Datastore,
  DatastoreCollection,
  OrderByDirection,
  RequestStatus,
  startWithEmptyList,
} from '@freelancer/datastore';
import {
  ContestBudgetRange,
  ContestComment,
  ContestCommentsCollection,
  ContestEntryFile,
  ContestEntryFileType,
  ContestEntryOffer,
  ContestEntryOffersCollection,
  ContestQuickviewEntriesCollection,
  ContestQuickviewEntry,
  ContestViewContest,
  ContestViewEntriesCollection,
  CONTEST_ENTRY_AWARD_STATUSES,
  CONTEST_ENTRY_TEXT_FORMATS,
  FreelancerReputation,
  FreelancerReputationsCollection,
  ParentContestComment,
  User,
  UserInteractionsCollection,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { Location as FlLocation } from '@freelancer/location';
import { TimeUtils } from '@freelancer/time-utils';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontType, ReadMore, TextSize } from '@freelancer/ui/text';
import {
  ToastAlertColor,
  ToastAlertService,
  ToastAlertType,
} from '@freelancer/ui/toast-alert';
import { toNumber } from '@freelancer/utils';
import {
  ContestCommentContextTypeApi,
  EntryFileFormatApi,
  EntryStatusApi,
  ENTRY_VIDEO_FORMATSApi,
} from 'api-typings/contests/contests';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { ViolationReportContextTypeApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import { QuickviewCommentsTab } from './quickview-modal-comments-section/quickview-modal-comments-section.component';
import { EntryToastError } from './quickview-modal-error-toast/quickview-modal-error-toast.component';
import { ThumbnailItem } from './quickview-modal-thumbnail-viewer/quickview-modal-thumbnail-item/quickview-modal-thumbnail-item.component';
import { QuickviewModalResponse } from './quickview-modal.types';

export enum EntryOfferStatus {
  ACCEPTED,
  DISABLED,
  NO_OFFER,
  PENDING,
}

enum KeyboardCode {
  KEY_RIGHT = 'ArrowRight',
  KEY_LEFT = 'ArrowLeft',
}

@Component({
  selector: 'app-quickview-modal',
  template: `
    <ng-container *flModalTitle i18n="Contest title">
      {{ (contest$ | async)?.title }}
    </ng-container>
    <ng-container
      *ngIf="{
        entry: entryFetchStatus$ | async,
        entryOwner: entryOwnerFetchStatus$ | async,
        entryOwnerReputation: entryOwnerReputationFetchStatus$ | async,
        entryOffer: entryOfferFetchStatus$ | async
      } as fetchStatus"
    >
      <ng-container
        *ngIf="
          (!fetchStatus.entry.ready && !fetchStatus.entry.error) ||
            (!fetchStatus.entryOwner.ready && !fetchStatus.entryOwner.error) ||
            (!fetchStatus.entryOwnerReputation.ready &&
              !fetchStatus.entryOwnerReputation.error) ||
            (!fetchStatus.entryOffer.ready && !fetchStatus.entryOffer.error);
          else loadedState
        "
      >
        <app-quickview-modal-loading-state></app-quickview-modal-loading-state>
      </ng-container>
    </ng-container>

    <fl-bit
      *ngIf="entryIds.length > 1"
      flTrackingSection="ContestViewPage.EntryPreviewModal"
      [flHideMobile]="true"
      [flHideTablet]="true"
    >
      <ng-template #navigation let-index="index">
        <fl-bit class="EntryQuickview-nav EntryQuickview-nav--previous">
          <fl-link
            class="EntryQuickview-nav-arrow"
            flTrackingLabel="ViewPreviousEntry"
            flTrackingReferenceType="entry_id"
            flTrackingReferenceId="{{ (entry$ | async)?.id }}"
            (click)="viewEntry(index - 1)"
          >
            <fl-icon
              label="Previous Entry"
              i18n-label="Label for previous entry navigation"
              [name]="'ui-chevron-left'"
              [color]="IconColor.LIGHT"
              [size]="IconSize.XLARGE"
            ></fl-icon>
          </fl-link>
        </fl-bit>
        <fl-bit class="EntryQuickview-nav EntryQuickview-nav--next">
          <fl-link
            class="EntryQuickview-nav-arrow"
            flTrackingLabel="ViewNextEntry"
            flTrackingReferenceType="entry_id"
            flTrackingReferenceId="{{ (entry$ | async)?.id }}"
            (click)="viewEntry(index + 1)"
          >
            <fl-icon
              label="Next Entry"
              i18n-label="Label for next entry navigation"
              [name]="'ui-chevron-right'"
              [color]="IconColor.LIGHT"
              [size]="IconSize.XLARGE"
            ></fl-icon>
          </fl-link>
        </fl-bit>
      </ng-template>
      <ng-container
        *ngTemplateOutlet="
          navigation;
          context: { index: currentEntryIndex$ | async }
        "
      ></ng-container>
    </fl-bit>

    <ng-template #loadedState>
      <ng-container
        *ngIf="{
          entry: entry$ | async,
          entryOwner: entryOwner$ | async,
          entryOwnerReputation: entryOwnerReputation$ | async,
          currentOffer: entryOffer$ | async,
          otherEntriesByUserFetchStatus: otherEntriesByUserFetchStatus$ | async,
          otherEntriesByUser: otherEntriesByUserThumbnails$ | async
        } as quickviewData"
      >
        <ng-container
          *ngIf="
            quickviewData.entry &&
            quickviewData.entryOwner &&
            quickviewData.entryOwnerReputation
          "
        >
          <fl-sticky-footer-wrapper>
            <fl-sticky-footer-body>
              <fl-bit
                class="EntryQuickview"
                flTrackingSection="ContestViewPage.EntryQuickviewModal"
              >
                <fl-bit
                  class="EntryQuickview-header"
                  [flMarginBottom]="Margin.XSMALL"
                >
                  <fl-heading
                    i18n="Entry number header"
                    id="{{ ENTRY_ID_PREFIX }}{{ quickviewData.entry.id }}"
                    [size]="TextSize.MID"
                    [sizeTablet]="TextSize.XLARGE"
                    [weight]="HeadingWeight.LIGHT"
                    [headingType]="HeadingType.H2"
                  >
                    Entry #{{ quickviewData.entry.number }}
                  </fl-heading>
                  <fl-rating
                    flTrackingLabel="RateEntry"
                    flTrackingReferenceType="entry_id"
                    flTrackingReferenceId="{{ quickviewData.entry.id }}"
                    [control]="ratingControl"
                    [hideValue]="true"
                    [readOnly]="
                      !isContestOwner ||
                      (isRejected$ | async) ||
                      (isWithdrawn$ | async)
                    "
                  ></fl-rating>
                </fl-bit>

                <fl-bit
                  [flMarginBottom]="Margin.SMALL"
                  [flMarginBottomTablet]="Margin.MID"
                >
                  <fl-bit
                    class="EntryQuickview-entry-area"
                    [flMarginBottom]="
                      quickviewData.entry.files.length > 1
                        ? Margin.XXSMALL
                        : Margin.NONE
                    "
                    [flMarginBottomTablet]="
                      quickviewData.entry.files.length > 1
                        ? Margin.SMALL
                        : Margin.NONE
                    "
                  >
                    <app-quickview-modal-entry-overlays
                      [isAwarded$]="isAwarded$"
                      [isBought$]="isBought$"
                      [isRejected$]="isRejected$"
                      [isWithdrawn$]="isWithdrawn$"
                    ></app-quickview-modal-entry-overlays>
                    <app-quickview-modal-entry-file
                      *ngIf="!(isWithdrawn$ | async)"
                      class="EntryQuickview-entry-item"
                      [selectedAnnotationId$]="selectedAnnotationId$"
                      [commentsUsers$]="commentsUsers$"
                      [contest$]="contest$"
                      [entry$]="entry$"
                      [entryFile$]="currentFile$"
                      [entryFileType$]="currentFileType$"
                      [loggedInUser$]="loggedInUser$"
                      [parentAnnotations$]="parentAnnotations$"
                      [enableAnnotations$]="enableAnnotations$"
                      [showAnnotatableImageOnboarding$]="
                        showAnnotatableImageOnboarding$
                      "
                      (closeAnnotatableImageOnboarding)="
                        closeAnnotatableImageOnboarding()
                      "
                      (closeEntry)="onCloseEntry()"
                      (completeAnnotatableImageOnboarding)="
                        completeAnnotatableImageOnboarding()
                      "
                      (reportComment)="onReportComment($event)"
                      (updateRepliesUserIds)="onUpdateRepliesUserIds($event)"
                    ></app-quickview-modal-entry-file>
                  </fl-bit>
                  <app-quickview-modal-thumbnail-viewer
                    *ngIf="quickviewData.entry.files.length > 1"
                    [currentFileIndex]="currentFileIndex$ | async"
                    [thumbnails]="entryFileThumbnails$ | async"
                    [showWithdrawnState]="isWithdrawn$ | async"
                    (viewFile)="onViewFile($event)"
                  ></app-quickview-modal-thumbnail-viewer>
                </fl-bit>
                <fl-bit
                  *ngIf="
                    (currentFileType$ | async) === ContestEntryFileType.IMAGE &&
                    (parentAnnotations$ | async)
                  "
                  class="EntryQuickview-annotationsToggle"
                  [flMarginBottom]="Margin.SMALL"
                >
                  <fl-toggle
                    flTrackingLabel="AnnotationsToggle"
                    [control]="annotationsToggleControl"
                  >
                  </fl-toggle>
                  <fl-text
                    *ngIf="
                      (parentAnnotations$ | async)?.length > 0;
                      else addAnnotationText
                    "
                    i18n="Show annotations toggle text"
                  >
                    Show annotations
                  </fl-text>
                  <ng-template #addAnnotationText>
                    <fl-text i18n="Add annotations toggle text">
                      Add annotations
                    </fl-text>
                  </ng-template>
                </fl-bit>
                <fl-grid
                  [flMarginBottom]="
                    quickviewData.otherEntriesByUserFetchStatus.ready &&
                    !quickviewData.otherEntriesByUserFetchStatus.error &&
                    quickviewData.otherEntriesByUser?.length
                      ? Margin.LARGE
                      : Margin.NONE
                  "
                >
                  <fl-col [col]="12" [colTablet]="7">
                    <app-quickview-modal-entry-tags
                      [currencyCode]="contest.currency.code"
                      [isAwarded]="isAwarded$ | async"
                      [isBeingSold]="isBeingSold$ | async"
                      [isBought]="isBought$ | async"
                      [isHighlighted]="quickviewData.entry.upgrades?.highlight"
                      [isRejected]="isRejected$ | async"
                      [isSealed]="quickviewData.entry.upgrades?.sealed"
                      [offerPrice]="quickviewData.currentOffer?.priceOffer"
                      [offerStatus]="entryOfferStatus$ | async"
                      [sellPrice]="
                        quickviewData.entry.sellPrice || contest?.prize
                      "
                    ></app-quickview-modal-entry-tags>

                    <fl-heading
                      class="EntryQuickview-text"
                      [size]="TextSize.MID"
                      [sizeTablet]="TextSize.XLARGE"
                      [weight]="HeadingWeight.LIGHT"
                      [headingType]="HeadingType.H2"
                      [flMarginBottom]="Margin.XSMALL"
                    >
                      {{ quickviewData.entry.title }}
                    </fl-heading>
                    <fl-text
                      class="EntryQuickview-text"
                      [flMarginBottom]="Margin.MID"
                      [flMarginBottomTablet]="Margin.LARGE"
                      [displayLineBreaks]="true"
                      [maxLines]="6"
                      [readMore]="ReadMore.LINK"
                      [size]="TextSize.SMALL"
                    >
                      {{ quickviewData.entry.description }}
                    </fl-text>

                    <fl-bit
                      *ngIf="quickviewData.entry.stockItems.length > 0"
                      [flMarginBottom]="Margin.MID"
                    >
                      <app-quickview-modal-stock-imagery
                        [stockItems]="quickviewData.entry.stockItems"
                      >
                      </app-quickview-modal-stock-imagery>
                    </fl-bit>
                    <fl-bit
                      [flMarginBottom]="Margin.MID"
                      [flMarginBottomTablet]="Margin.NONE"
                    >
                      <app-quickview-modal-comments-section
                        [parentCommentsCollection]="parentCommentsCollection"
                        [parentAnnotationsCollection]="
                          parentAnnotationsCollection
                        "
                        [commentsUsers$]="commentsUsers$"
                        [entry$]="entry$"
                        [contest$]="contest$"
                        [currentFileType$]="currentFileType$"
                        [currentTab$]="currentTab$"
                        [hasMoreParentComments$]="hasMoreParentComments$"
                        [hasMoreParentAnnotations$]="hasMoreParentAnnotations$"
                        [loggedInUser$]="loggedInUser$"
                        (closeEntry)="onCloseEntry()"
                        (commentItemClicked)="onSelectAnnotation($event)"
                        (reportComment)="onReportComment($event)"
                        (updateRepliesUserIds)="onUpdateRepliesUserIds($event)"
                        (viewMoreComments)="onViewMoreComments()"
                        (selectTab)="onTabSelect($event)"
                      >
                      </app-quickview-modal-comments-section>
                    </fl-bit>
                  </fl-col>
                  <fl-col [col]="12" [colTablet]="5">
                    <fl-bit
                      *ngIf="!(isWithdrawn$ | async)"
                      class="EntryQuickview-ctas"
                      [flMarginBottom]="Margin.MID"
                      [flHideMobile]="true"
                    >
                      <ng-container
                        *ngTemplateOutlet="entryCtas"
                      ></ng-container>
                    </fl-bit>
                    <ng-template #entryCtas>
                      <app-quickview-modal-entry-ctas
                        [entry$]="entry$"
                        [isActive$]="isActive$"
                        [isAwarded$]="isAwarded$"
                        [isBeingSold$]="isBeingSold$"
                        [isBought$]="isBought$"
                        [isRejected$]="isRejected$"
                        [offerStatus$]="entryOfferStatus$"
                        [rejectResponse$]="rejectResponse$"
                        [reconsiderResponse$]="reconsiderResponse$"
                        (awardEntry)="
                          onAwardEntry(
                            quickviewData.entry,
                            quickviewData.entryOwner
                          )
                        "
                        (buyEntry)="
                          onBuyEntry(
                            quickviewData.entry,
                            quickviewData.entryOwner,
                            quickviewData.currentOffer
                          )
                        "
                        (makeOffer)="
                          onMakeOffer(
                            quickviewData.entry,
                            quickviewData.entryOwner,
                            quickviewData.currentOffer
                          )
                        "
                        (reconsiderEntry)="onReconsiderEntry()"
                        (rejectEntry)="onRejectEntry()"
                      ></app-quickview-modal-entry-ctas>
                    </ng-template>
                    <fl-hr
                      *ngIf="!(isWithdrawn$ | async)"
                      [flMarginBottom]="Margin.MID"
                      [flHideMobile]="true"
                    ></fl-hr>

                    <fl-heading
                      i18n="About the freelancer header"
                      [headingType]="HeadingType.H3"
                      [size]="TextSize.MID"
                      [sizeDesktop]="TextSize.LARGE"
                      [weight]="HeadingWeight.NORMAL"
                      [flMarginBottom]="Margin.XXSMALL"
                    >
                      About the freelancer
                    </fl-heading>
                    <fl-bit [flMarginBottom]="Margin.SMALL">
                      <app-quickview-modal-user-info
                        [user]="quickviewData.entryOwner"
                        [userReputation]="quickviewData.entryOwnerReputation"
                      >
                      </app-quickview-modal-user-info>
                    </fl-bit>
                    <fl-chat-button
                      class="EntryQuickview-button"
                      flTrackingLabel="ChatEntryOwner"
                      flTrackingReferenceType="freelancer_id"
                      flTrackingReferenceId="{{ quickviewData.entryOwner.id }}"
                      [color]="ButtonColor.TRANSPARENT_DARK"
                      [flMarginBottom]="Margin.MID"
                      [otherMemberIds]="[quickviewData.entry.ownerId]"
                      [contextType]="ContextTypeApi.CONTEST"
                      [contextId]="quickviewData.entry.contestId"
                      (click)="onChatEntryOwner()"
                    ></fl-chat-button>
                    <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>

                    <fl-bit [flMarginBottom]="Margin.MID">
                      <fl-social-buttons
                        i18n-shareText="Share entry text"
                        shareText="Check out {{
                          quickviewData.entryOwner.username
                        }}'s entry in {{ contest.title }} on Freelancer.com"
                        [size]="IconSize.SMALL"
                        [shareUrl]="socialShareUrl"
                      ></fl-social-buttons>
                    </fl-bit>

                    <fl-bit
                      class="EntryQuickview-likes"
                      [flMarginBottom]="Margin.MID"
                    >
                      <fl-button
                        class="EntryQuickview-button"
                        i18n="Entry like button"
                        flTrackingLabel="LikeEntry"
                        flTrackingReferenceType="entry_id"
                        flTrackingReferenceId="{{ quickviewData.entry.id }}"
                        [flMarginRight]="Margin.XSMALL"
                        [color]="
                          quickviewData.entry.isLiked
                            ? ButtonColor.SECONDARY
                            : ButtonColor.TRANSPARENT_DARK
                        "
                        [disabled]="
                          (isEntryOwner$ | async) ||
                          (isRejected$ | async) ||
                          (isWithdrawn$ | async)
                        "
                        (click)="
                          onLikeEntry({
                            isLiked: !quickviewData.entry.isLiked
                          })
                        "
                      >
                        <fl-bit class="EntryQuickview-button-content">
                          <fl-icon
                            [name]="'ui-thumbs-up-v2'"
                            [color]="IconColor.INHERIT"
                            [size]="IconSize.SMALL"
                            [flMarginRight]="Margin.XXXSMALL"
                          ></fl-icon>
                          <ng-container
                            *ngIf="!quickviewData.entry.isLiked; else likedText"
                          >
                            Like
                          </ng-container>
                          <ng-template #likedText>
                            Liked
                          </ng-template>
                        </fl-bit>
                      </fl-button>
                      <fl-text i18n="Entry likes count" [size]="TextSize.SMALL">
                        {{ quickviewData.entry.likeCount || 0 }}
                        <ng-container
                          *ngIf="
                            quickviewData.entry.likeCount === 1;
                            else pluralLikes
                          "
                        >
                          Like
                        </ng-container>
                        <ng-template #pluralLikes>
                          Likes
                        </ng-template>
                      </fl-text>
                    </fl-bit>

                    <fl-link
                      i18n="Entry report text"
                      flTrackingLabel="ReportEntry"
                      [color]="LinkColor.INHERIT"
                      (click)="onReportEntry(quickviewData.entry)"
                    >
                      Report
                    </fl-link>
                  </fl-col>
                </fl-grid>
                <app-quickview-modal-more-entries
                  *ngIf="
                    quickviewData.otherEntriesByUserFetchStatus.ready &&
                    !quickviewData.otherEntriesByUserFetchStatus.error &&
                    quickviewData.otherEntriesByUser?.length
                  "
                  [entryOwner]="entryOwner$ | async"
                  [entryThumbnails]="quickviewData.otherEntriesByUser"
                  (seeAllEntries)="onViewAllEntriesByUser($event)"
                  (viewEntry)="onViewOtherEntry($event)"
                ></app-quickview-modal-more-entries>
              </fl-bit>
            </fl-sticky-footer-body>
            <fl-sticky-footer [flShowMobile]="true">
              <fl-bit
                *ngIf="!(isWithdrawn$ | async)"
                class="EntryQuickview-ctas"
                flTrackingSection="ContestViewPage.EntryQuickviewModal"
              >
                <ng-container *ngTemplateOutlet="entryCtas"></ng-container>
              </fl-bit>
            </fl-sticky-footer>
          </fl-sticky-footer-wrapper>
        </ng-container>
      </ng-container>
      <app-quickview-modal-error-toast
        (retryReject)="onRejectEntry()"
        (retryReconsider)="onReconsiderEntry()"
        (retryRate)="onRateEntry(rateEntryPayload)"
      ></app-quickview-modal-error-toast>
    </ng-template>
  `,
  styleUrls: ['./quickview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickviewModalComponent implements OnDestroy, OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  ContestEntryFileType = ContestEntryFileType;
  FontType = FontType;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  TextSize = TextSize;
  ToastAlertColor = ToastAlertColor;
  ToastAlertType = ToastAlertType;
  ReadMore = ReadMore;
  ContextTypeApi = ContextTypeApi;

  @Input() contest: ContestViewContest;
  @Input() isContestOwner: boolean;
  @Input() hasContestAwardedEntry: boolean;
  @Input() initialEntryId: number;
  @Input() entryIds: ReadonlyArray<number>;
  @Input() isOnMultiAward: boolean;
  @Input() canMultiAward: boolean;
  @Input() contestBudgetRange: ContestBudgetRange;
  @Input() initialFileIndex: number;

  private keyUpEventSubject$ = new Rx.Subject<KeyboardEvent>();
  keyUpEvent$ = this.keyUpEventSubject$.asObservable();
  private keyUpEventSubscription?: Rx.Subscription;

  loggedInUser$: Rx.Observable<User>;

  contest$: Rx.Observable<ContestViewContest>;
  currentEntryIndexSubject$: Rx.BehaviorSubject<number>;
  currentEntryIndex$: Rx.Observable<number>;
  entryIdSubject$: Rx.BehaviorSubject<number>;
  entryId$: Rx.Observable<number>;
  entry$: Rx.Observable<ContestQuickviewEntry>;
  entryFetchStatus$: Rx.Observable<
    RequestStatus<ContestQuickviewEntriesCollection>
  >;
  entrySubscription?: Rx.Subscription;

  entryOwner$: Rx.Observable<User>;
  entryOwnerFetchStatus$: Rx.Observable<RequestStatus<UsersCollection>>;
  entryOwnerReputation$: Rx.Observable<FreelancerReputation>;
  entryOwnerReputationFetchStatus$: Rx.Observable<
    RequestStatus<FreelancerReputationsCollection>
  >;
  entryOfferFetchStatus$: Rx.Observable<
    RequestStatus<ContestEntryOffersCollection>
  >;
  otherEntriesByUserFetchStatus$: Rx.Observable<
    RequestStatus<ContestViewEntriesCollection>
  >;
  otherEntriesByUserThumbnails$: Rx.Observable<ReadonlyArray<ThumbnailItem>>;
  entryOffer$: Rx.Observable<ContestEntryOffer | undefined>;
  entryOfferStatus$: Rx.Observable<EntryOfferStatus>;
  parentAnnotations$: Rx.Observable<ReadonlyArray<ParentContestComment>>;
  annotationsToggleControl = new FormControl(true);
  enableAnnotations$: Rx.Observable<boolean>;

  private currentFileIndexSubject$: Rx.BehaviorSubject<number>;
  currentFileIndex$: Rx.Observable<number>;
  currentFile$: Rx.Observable<ContestEntryFile>;
  currentFileType$: Rx.Observable<ContestEntryFileType>;
  entryFileThumbnails$: Rx.Observable<ReadonlyArray<ThumbnailItem>>;

  isActive$: Rx.Observable<boolean>;
  isAwarded$: Rx.Observable<boolean>;
  isBeingSold$: Rx.Observable<boolean>;
  isBought$: Rx.Observable<boolean>;
  isEntryOwner$: Rx.Observable<boolean>;
  isRejected$: Rx.Observable<boolean>;
  isWithdrawn$: Rx.Observable<boolean>;

  private shouldCloseOnboardingSubject$ = new Rx.BehaviorSubject<boolean>(
    false,
  );
  shouldCloseOnboarding$ = this.shouldCloseOnboardingSubject$.asObservable();
  showAnnotatableImageOnboarding$: Rx.Observable<boolean>;

  updateResponse$:
    | Promise<BackendUpdateResponse<ContestQuickviewEntriesCollection>>
    | undefined;
  rejectResponse$:
    | Promise<BackendUpdateResponse<ContestQuickviewEntriesCollection>>
    | undefined;
  reconsiderResponse$:
    | Promise<BackendUpdateResponse<ContestQuickviewEntriesCollection>>
    | undefined;
  ratingControl = new FormControl();
  ratingSubscription?: Rx.Subscription;
  socialShareUrl: string;

  private currentTabSubject$ = new Rx.BehaviorSubject<QuickviewCommentsTab>(
    QuickviewCommentsTab.COMMENTS,
  );
  currentTab$ = this.currentTabSubject$.asObservable();

  readonly ENTRY_ID_PREFIX = 'quickview-entry-';

  readonly PARENT_ANNOTATION_LIMIT_INCREMENT = 100;
  private parentAnnotationLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.PARENT_ANNOTATION_LIMIT_INCREMENT,
  );
  parentAnnotationLimit$ = this.parentAnnotationLimitSubject$.asObservable();
  parentAnnotationsCollection: DatastoreCollection<ContestCommentsCollection>;
  hasMoreParentAnnotations$: Rx.Observable<boolean>;

  readonly PARENT_COMMENT_LIMIT_INCREMENT = 10;
  private parentCommentLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.PARENT_COMMENT_LIMIT_INCREMENT,
  );
  parentCommentLimit$ = this.parentCommentLimitSubject$.asObservable();
  parentCommentsCollection: DatastoreCollection<ContestCommentsCollection>;
  commentsUsers$: Rx.Observable<{ [key: number]: User }>;
  hasMoreParentComments$: Rx.Observable<boolean>;

  readonly REJECT_ENTRY_CONTENTS = { status: EntryStatusApi.ELIMINATED };
  readonly RECONSIDER_ENTRY_CONTENTS = { status: EntryStatusApi.ACTIVE };
  readonly ONBOARDING_EVENT_NAME =
    'contest-annotatable-image-onboarding-complete';

  private commentRepliesUserIdsSubject$ = new Rx.BehaviorSubject<
    ReadonlyArray<number>
  >([]);
  commentRepliesUserIds$ = this.commentRepliesUserIdsSubject$.asObservable();

  private selectedAnnotationIdSubject$ = new Rx.BehaviorSubject<
    number | undefined
  >(undefined);
  selectedAnnotationId$ = this.selectedAnnotationIdSubject$.asObservable();

  rateEntryPayload: Partial<ContestQuickviewEntry>;

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private flLocation: FlLocation,
    private location: Location,
    private modalRef: ModalRef<QuickviewModalComponent>,
    private timeUtils: TimeUtils,
    private toastAlertService: ToastAlertService,
    @Inject(DOCUMENT) private document: HTMLDocument,
  ) {}

  ngOnInit() {
    this.contest$ = Rx.of(this.contest);
    this.entryIdSubject$ = new Rx.BehaviorSubject<number>(this.initialEntryId);
    this.entryId$ = this.entryIdSubject$.asObservable();

    this.currentEntryIndexSubject$ = new Rx.BehaviorSubject<number>(
      this.entryIds.indexOf(this.initialEntryId),
    );
    this.currentEntryIndex$ = this.currentEntryIndexSubject$.asObservable();

    const entriesDocument = this.datastore.document<
      ContestQuickviewEntriesCollection
    >('contestQuickviewEntries', this.entryId$);
    this.entry$ = entriesDocument.valueChanges();
    this.entryFetchStatus$ = entriesDocument.status$;

    this.entrySubscription = this.entry$
      .pipe(distinctUntilKeyChanged('id'))
      .subscribe(entry => {
        this.location.replaceState(entry.seoUrl);
        this.socialShareUrl = this.flLocation.href;
        this.ratingControl.markAsPristine();
        this.ratingControl.setValue(entry.rating);
        this.shouldCloseOnboardingSubject$.next(false);
        this.scrollToTop(`${this.ENTRY_ID_PREFIX}${entry.id}`);
      });

    this.currentFileIndexSubject$ = new Rx.BehaviorSubject<number>(
      this.initialFileIndex,
    );
    this.currentFileIndex$ = this.currentFileIndexSubject$.asObservable();

    this.currentFile$ = Rx.combineLatest([
      this.entry$,
      this.currentFileIndex$,
    ]).pipe(map(([entry, currentFileIndex]) => entry.files[currentFileIndex]));

    this.currentFileType$ = this.currentFile$.pipe(
      map(file => this.getFileType(file.name)),
    );

    this.entryFileThumbnails$ = this.entry$.pipe(
      distinctUntilKeyChanged('files'),
      map(entry =>
        entry.files.map(file => {
          const fileType = this.getFileType(file.name);
          return {
            fileType,
            alt: file.name,
            id: file.id,
            src:
              fileType === ContestEntryFileType.TEXT
                ? file.thumbnailPreview
                : file.thumbnail900Url,
          };
        }),
      ),
    );

    const entryOwnerId$ = this.entry$.pipe(
      map(entry => entry.ownerId),
      distinctUntilChanged(),
    );

    const entryOwnerDocument = this.datastore.document<UsersCollection>(
      'users',
      entryOwnerId$,
    );
    this.entryOwner$ = entryOwnerDocument.valueChanges();
    this.entryOwnerFetchStatus$ = entryOwnerDocument.status$;

    const entryOwnerReputationDocument = this.datastore.document<
      FreelancerReputationsCollection
    >('freelancerReputations', entryOwnerId$);
    this.entryOwnerReputation$ = entryOwnerReputationDocument.valueChanges();
    this.entryOwnerReputationFetchStatus$ =
      entryOwnerReputationDocument.status$;

    const loggedInUserId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));
    const loggedInUserDocument = this.datastore.document<UsersCollection>(
      'users',
      loggedInUserId$,
    );
    this.loggedInUser$ = loggedInUserDocument.valueChanges();

    this.isEntryOwner$ = Rx.combineLatest([loggedInUserId$, this.entry$]).pipe(
      map(([loggedInUserId, entry]) => loggedInUserId === entry.ownerId),
    );

    const entryOffersCollection = this.datastore.collection<
      ContestEntryOffersCollection
    >('contestEntryOffers', query =>
      query.where('contestId', '==', this.contest.id),
    );
    this.entryOffer$ = Rx.combineLatest([
      entryOffersCollection.valueChanges(),
      this.entryId$,
    ]).pipe(
      map(([offers, entryId]) =>
        offers.find(offer => offer.entryId === entryId),
      ),
      distinctUntilChanged(),
    );
    this.entryOfferFetchStatus$ = entryOffersCollection.status$;

    const otherEntriesByUserCollection = this.datastore.collection<
      ContestViewEntriesCollection
    >('contestViewEntries', query =>
      query
        .where('contestId', '==', this.contest.id)
        .where('status', 'in', [
          EntryStatusApi.ACTIVE,
          EntryStatusApi.BOUGHT,
          ...CONTEST_ENTRY_AWARD_STATUSES,
        ])
        .where('ownerId', '==', entryOwnerId$)
        .orderBy('rating', OrderByDirection.DESC)
        .orderBy('statusNumber', OrderByDirection.DESC)
        .orderBy('number', OrderByDirection.DESC)
        .limit(5),
    );
    this.otherEntriesByUserFetchStatus$ = otherEntriesByUserCollection.status$;

    this.otherEntriesByUserThumbnails$ = Rx.combineLatest([
      otherEntriesByUserCollection.valueChanges().pipe(
        distinctUntilChanged((prev, curr) =>
          arrayIsShallowEqual(
            prev.map(entry => entry.id),
            curr.map(entry => entry.id),
          ),
        ),
      ),
      this.entryId$,
    ]).pipe(
      map(([entries, currentEntryId]) =>
        entries
          .filter(entry => entry.id !== currentEntryId)
          .slice(0, 4)
          .map(entry => {
            const entryPreview = entry.files[0];
            const entryrPreviewFileType = this.getFileType(entryPreview.name);

            return {
              alt: entry.title || entryPreview.name,
              fileType: entryrPreviewFileType,
              id: entry.id,
              src:
                entryrPreviewFileType === ContestEntryFileType.TEXT
                  ? entryPreview.thumbnailPreview
                  : entryPreview.thumbnail900Url,
            };
          }),
      ),
    );

    this.parentAnnotationsCollection = this.datastore.collection<
      ContestCommentsCollection
    >('contestComments', query =>
      query
        .where(
          'contextId',
          '==',
          this.currentFile$.pipe(map(currentFile => currentFile.id)),
        )
        .where('contextType', '==', ContestCommentContextTypeApi.ANNOTATION)
        .where('parentId', '==', undefined)
        .orderBy('dateLastComment', OrderByDirection.DESC),
    );

    this.parentAnnotations$ = this.parentAnnotationsCollection
      .valueChanges()
      .pipe(
        map(annotations =>
          annotations
            .map(annotation => annotation as ParentContestComment)
            .filter(annotation => !annotation.isDeleted),
        ),
      );

    this.enableAnnotations$ = this.annotationsToggleControl.valueChanges.pipe(
      startWith(true),
    );

    this.parentCommentsCollection = this.datastore.collection<
      ContestCommentsCollection
    >('contestComments', query =>
      query
        .where('contextId', '==', this.entryId$)
        .where('contextType', '==', ContestCommentContextTypeApi.ENTRY)
        .where('parentId', '==', undefined)
        .orderBy('dateLastComment', OrderByDirection.DESC)
        .limit(this.parentCommentLimit$),
    );
    const parentComments$ = this.parentCommentsCollection.valueChanges();

    // TODO: Fix logic when comment counts is implemented
    this.hasMoreParentComments$ = Rx.combineLatest([
      parentComments$,
      this.parentCommentLimit$,
    ]).pipe(map(([comments, commentLimit]) => commentLimit <= comments.length));

    // TODO: Fix logic when comment counts is implemented
    this.hasMoreParentAnnotations$ = Rx.combineLatest([
      this.parentAnnotations$,
      this.parentAnnotationLimit$,
    ]).pipe(
      map(
        ([annotations, annotationLimit]) =>
          annotationLimit <= annotations.length,
      ),
    );

    const parentCommentsUserIds$ = parentComments$.pipe(
      map(parentComments =>
        parentComments.map(parentComment => parentComment.fromUserId),
      ),
    );

    const parentAnnotationsUserIds$ = this.parentAnnotations$.pipe(
      map(parentAnnotations =>
        parentAnnotations.map(parentAnnotation => parentAnnotation.fromUserId),
      ),
    );

    this.commentsUsers$ = this.datastore
      .collection<UsersCollection>(
        'users',
        Rx.combineLatest([
          parentCommentsUserIds$,
          parentAnnotationsUserIds$,
          this.commentRepliesUserIds$,
        ]).pipe(
          map(
            ([
              parentCommentsUserIds,
              parentAnnotationsUserIds,
              repliesUserIds,
            ]) => [
              ...parentCommentsUserIds,
              ...parentAnnotationsUserIds,
              ...repliesUserIds,
            ],
          ),
        ),
      )
      .valueChanges()
      .pipe(startWithEmptyList(), asObject());

    this.isRejected$ = this.entry$.pipe(
      map(entry =>
        [
          EntryStatusApi.ELIMINATED,
          EntryStatusApi.WITHDRAWN_ELIMINATED,
        ].includes(entry.status),
      ),
    );

    this.isWithdrawn$ = this.entry$.pipe(
      map(entry =>
        [
          EntryStatusApi.WITHDRAWN,
          EntryStatusApi.WITHDRAWN_ELIMINATED,
        ].includes(entry.status),
      ),
    );

    this.isActive$ = this.entry$.pipe(
      map(
        entry =>
          !this.hasContestAwardedEntry &&
          entry.status === EntryStatusApi.ACTIVE,
      ),
    );

    this.isAwarded$ = this.entry$.pipe(
      map(entry => CONTEST_ENTRY_AWARD_STATUSES.includes(entry.status)),
    );

    this.isBeingSold$ = this.entry$.pipe(
      map(
        entry =>
          this.hasContestAwardedEntry &&
          entry.status === EntryStatusApi.ACTIVE &&
          !!(entry.sellPrice || this.contest.prize),
      ),
    );

    this.entryOfferStatus$ = this.entryOffer$.pipe(
      map(currentOffer => {
        if ((this.contest.prize || 0) <= this.contestBudgetRange.minimum) {
          return EntryOfferStatus.DISABLED;
        }

        return !currentOffer
          ? EntryOfferStatus.NO_OFFER
          : currentOffer?.accepted
          ? EntryOfferStatus.ACCEPTED
          : EntryOfferStatus.PENDING;
      }),
    );

    this.isBought$ = this.entry$.pipe(
      map(entry => entry.status === EntryStatusApi.BOUGHT),
    );

    this.ratingSubscription = this.ratingControl.valueChanges.subscribe(
      rating => {
        if (this.ratingControl.dirty) {
          this.onRateEntry({ rating });
        }
      },
    );

    const isOnboardingComplete$ = this.datastore
      .collection<UserInteractionsCollection>('userInteractions', query =>
        query.where('eventName', '==', this.ONBOARDING_EVENT_NAME),
      )
      .valueChanges()
      .pipe(map(events => !!events[0]));

    // The onboarding callout will close when the window resizes, so we have
    // to hide the entire onboarding component or else the user will be stuck
    // on the onboarding page
    this.showAnnotatableImageOnboarding$ = Rx.combineLatest([
      this.shouldCloseOnboarding$,
      isOnboardingComplete$,
    ]).pipe(
      map(
        ([shouldCloseOnboarding, isOnboardingComplete]) =>
          !isOnboardingComplete && !shouldCloseOnboarding,
      ),
    );

    this.keyUpEventSubscription = this.keyUpEvent$
      .pipe(
        withLatestFrom(
          this.showAnnotatableImageOnboarding$,
          this.currentEntryIndex$,
          this.currentFileType$,
        ),
        filter(
          ([_, showOnboarding, __, currentFileType]) =>
            currentFileType !== ContestEntryFileType.IMAGE || !showOnboarding,
        ),
        filter(
          ([keyUpEvent, _, __, ___]) =>
            keyUpEvent.key === KeyboardCode.KEY_LEFT ||
            keyUpEvent.key === KeyboardCode.KEY_RIGHT,
        ),
        map(([keyUpEvent, _, currentEntryIndex, __]) =>
          keyUpEvent.key === KeyboardCode.KEY_RIGHT
            ? currentEntryIndex + 1
            : currentEntryIndex - 1,
        ),
      )
      .subscribe(entryIndex => this.viewEntry(entryIndex));
  }

  onAwardEntry(entry: ContestQuickviewEntry, entryOwner: User) {
    this.modalRef.close({
      response: QuickviewModalResponse.AWARD,
      entry,
      freelancer: entryOwner,
      canMultiAward: this.canMultiAward,
    });
  }

  onBuyEntry(
    entry: ContestQuickviewEntry,
    entryOwner: User,
    currentOffer: ContestEntryOffer,
  ) {
    this.modalRef.close({
      response: QuickviewModalResponse.BUY,
      contest: this.contest,
      entry,
      currentOffer,
      freelancer: entryOwner,
      hasContestAwardedEntry: this.hasContestAwardedEntry,
    });
  }

  onChatEntryOwner() {
    this.modalRef.close();
  }

  onReportEntry(entry: ContestQuickviewEntry) {
    this.modalRef.close({
      response: QuickviewModalResponse.REPORT,
      reportDetails: {
        violatorUserId: entry.ownerId,
        contextId: entry.id,
        contextType: ViolationReportContextTypeApi.CONTEST_ENTRY,
      },
    });
  }

  onTabSelect(tab: QuickviewCommentsTab) {
    this.currentTabSubject$.next(tab);
  }

  viewEntry(index: number) {
    this.currentFileIndexSubject$.next(0);
    this.currentTabSubject$.next(QuickviewCommentsTab.COMMENTS);
    this.parentCommentLimitSubject$.next(this.PARENT_COMMENT_LIMIT_INCREMENT);
    this.parentAnnotationLimitSubject$.next(
      this.PARENT_ANNOTATION_LIMIT_INCREMENT,
    );

    // Set index when hitting the end of the list. It should behave like a
    // circular list.
    const entryToLoadIndex =
      (index + this.entryIds.length) % this.entryIds.length;

    this.currentEntryIndexSubject$.next(entryToLoadIndex);
    this.entryIdSubject$.next(this.entryIds[entryToLoadIndex]);

    // unset error message
    this.resetEntryActionResponses();
  }

  onViewFile(index: number) {
    this.currentFileIndexSubject$.next(index);
    this.currentTabSubject$.next(QuickviewCommentsTab.COMMENTS);
  }

  onViewOtherEntry(id: number) {
    this.viewEntry(this.entryIds.indexOf(id));
  }

  onViewAllEntriesByUser(entrant: User) {
    this.modalRef.close({
      response: QuickviewModalResponse.VIEW_ALL_ENTRIES_BY_ENTRANT,
      entrant,
    });
  }

  onCloseEntry() {
    this.modalRef.close({});
  }

  onRateEntry(changes: Partial<ContestQuickviewEntry>) {
    this.updateResponse$ = this.updateEntry(changes);
    this.updateResponse$.then(response => {
      if (response.status === 'error') {
        this.rateEntryPayload = changes;
        switch (response.errorCode as ErrorCodeApi) {
          case ErrorCodeApi.BAD_REQUEST:
            this.toastAlertService.open(EntryToastError.RATE_BAD_REQUEST);
            break;
          case ErrorCodeApi.FORBIDDEN:
            this.toastAlertService.open(EntryToastError.RATE_FORBIDDEN);
            break;
          default:
            this.toastAlertService.open(EntryToastError.RATE_DEFAULT_ERROR);
        }
      }
    });
  }

  onLikeEntry(changes: Partial<ContestQuickviewEntry>) {
    this.updateResponse$ = this.updateEntry(changes);
    this.updateResponse$.then(response => {
      if (response.status === 'error') {
        switch (response.errorCode as ErrorCodeApi) {
          case ErrorCodeApi.BAD_REQUEST:
            this.toastAlertService.open(EntryToastError.LIKE_BAD_REQUEST);
            break;
          case ErrorCodeApi.FORBIDDEN:
            this.toastAlertService.open(EntryToastError.LIKE_FORBIDDEN);
            break;
          case ErrorCodeApi.CONFLICT:
            if (changes.isLiked) {
              this.toastAlertService.open(EntryToastError.LIKE_CONFLICT);
            } else {
              this.toastAlertService.open(EntryToastError.DISLIKE_CONFLICT);
            }
            break;
          default:
            this.toastAlertService.open(EntryToastError.LIKE_DEFAULT_ERROR);
        }
      }
    });
  }

  onRejectEntry() {
    this.rejectResponse$ = this.updateEntry(this.REJECT_ENTRY_CONTENTS);
    this.rejectResponse$.then(response => {
      if (response.status === 'error') {
        switch (response.errorCode as ErrorCodeApi) {
          case ErrorCodeApi.FORBIDDEN:
            this.toastAlertService.open(EntryToastError.REJECT_FORBIDDEN);
            break;
          case ErrorCodeApi.CONFLICT:
            this.toastAlertService.open(EntryToastError.REJECT_CONFLICT);
            break;
          default:
            this.toastAlertService.open(EntryToastError.REJECT_DEFAULT_ERROR);
        }
      }
    });
  }

  onReconsiderEntry() {
    this.reconsiderResponse$ = this.updateEntry(this.RECONSIDER_ENTRY_CONTENTS);
    this.reconsiderResponse$.then(response => {
      if (response.status === 'error') {
        switch (response.errorCode as ErrorCodeApi) {
          case ErrorCodeApi.FORBIDDEN:
            this.toastAlertService.open(EntryToastError.RECONSIDER_FORBIDDEN);
            break;
          case ErrorCodeApi.CONFLICT:
            this.toastAlertService.open(EntryToastError.RECONSIDER_CONFLICT);
            break;
          default:
            this.toastAlertService.open(
              EntryToastError.RECONSIDER_DEFAULT_ERROR,
            );
        }
      }
    });
  }

  onMakeOffer(
    entry: ContestQuickviewEntry,
    freelancer: User,
    currentOffer: ContestEntryOffer,
  ) {
    this.modalRef.close({
      response: QuickviewModalResponse.MAKE_OFFER,
      contest: this.contest,
      contestBudgetRange: this.contestBudgetRange,
      currentOffer,
      entry,
      freelancer,
    });
  }

  onReportComment(comment: ContestComment) {
    this.modalRef.close({
      response: QuickviewModalResponse.REPORT,
      reportDetails: {
        violatorUserId: comment.fromUserId,
        contextId: comment.id,
        contextType: ViolationReportContextTypeApi.CONTEST_COMMENT,
      },
    });
  }

  onViewMoreComments() {
    if (this.currentTabSubject$.value === QuickviewCommentsTab.COMMENTS) {
      this.parentCommentLimitSubject$.next(
        this.parentCommentLimitSubject$.getValue() +
          this.PARENT_COMMENT_LIMIT_INCREMENT,
      );
    } else {
      this.parentAnnotationLimitSubject$.next(
        this.parentAnnotationLimitSubject$.getValue() +
          this.PARENT_ANNOTATION_LIMIT_INCREMENT,
      );
    }
  }

  onUpdateRepliesUserIds(repliesUserIds: ReadonlyArray<number>) {
    this.commentRepliesUserIdsSubject$.next([
      ...this.commentRepliesUserIdsSubject$.value,
      ...repliesUserIds,
    ]);
  }

  onSelectAnnotation(parentAnnotationId: number) {
    // For T184452 to work, we need to set to undefined first before setting it
    // to the correct parentAnnotationId to fix the issue where clicking on the
    // same comment thread again doesn't trigger the corresponsing annotation
    // pin to open
    this.selectedAnnotationIdSubject$.next(undefined);
    setTimeout(
      () => this.selectedAnnotationIdSubject$.next(parentAnnotationId),
      0,
    );
  }

  updateEntry(changes: Partial<ContestQuickviewEntry>) {
    return this.datastore
      .document<ContestQuickviewEntriesCollection>(
        'contestQuickviewEntries',
        this.entryId$,
      )
      .update(changes);
  }

  resetEntryActionResponses() {
    this.reconsiderResponse$ = undefined;
    this.rejectResponse$ = undefined;
  }

  closeAnnotatableImageOnboarding() {
    this.shouldCloseOnboardingSubject$.next(true);
  }

  completeAnnotatableImageOnboarding() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      {
        eventName: this.ONBOARDING_EVENT_NAME,
      },
    );
  }

  getFileType(fileName: string): ContestEntryFileType {
    let fileType = fileName.split('.').pop();
    fileType = fileType ? fileType.toLowerCase() : fileName;

    if (ENTRY_VIDEO_FORMATSApi.includes(fileType as EntryFileFormatApi)) {
      return ContestEntryFileType.VIDEO;
    }
    if (CONTEST_ENTRY_TEXT_FORMATS.includes(fileType)) {
      return ContestEntryFileType.TEXT;
    }
    return ContestEntryFileType.IMAGE;
  }

  scrollToTop(targetId: string) {
    this.timeUtils.setTimeout(() => {
      const targetElement = this.document.getElementById(targetId);

      if (!targetElement) {
        return;
      }

      targetElement.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    });
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Disable keyboard bindings when user is typing
    const focusedElement = this.document.querySelector(':focus');
    if (
      focusedElement &&
      (focusedElement.tagName.toLowerCase() === 'textarea' ||
        focusedElement.tagName.toLowerCase() === 'input')
    ) {
      return;
    }

    this.keyUpEventSubject$.next(event);
  }

  ngOnDestroy() {
    if (this.entrySubscription) {
      this.entrySubscription.unsubscribe();
    }

    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }

    if (this.keyUpEventSubscription) {
      this.keyUpEventSubscription.unsubscribe();
    }
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BackendDeleteResponse,
  BackendPushResponse,
  BackendSuccessResponse,
  BackendUpdateResponse,
} from '@freelancer/datastore';
import {
  CartsCollection,
  ContestEntry,
  ContestFile,
  ContestFilesCollection,
  ContestViewContest,
  ContestViewContestsCollection,
  ContestViewEntry,
  Skill,
} from '@freelancer/datastore/collections';
import { PaymentsCart } from '@freelancer/payments-cart';
import { DurationFormat } from '@freelancer/pipes';
import { ModalService } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CardSize } from '@freelancer/ui/card';
import { DropdownFilterContentSize } from '@freelancer/ui/dropdown-filter';
import { FileDisplayType } from '@freelancer/ui/file-display';
import { Focus } from '@freelancer/ui/focus';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { InputComponent, InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { ModalSize } from '@freelancer/ui/modal';
import { SelectItem } from '@freelancer/ui/select';
import { TagType } from '@freelancer/ui/tag';
import {
  FontColor,
  FontWeight,
  TextAlign,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import {
  getUpgradeOrder,
  transformUpgradeType,
  UpgradeType,
} from '@freelancer/ui/upgrade-tag';
import {
  maxLength,
  maxValue,
  minLength,
  minNumOfTrue,
  minValue,
  required,
  wholeNumber,
} from '@freelancer/ui/validators';
import { isDefined, isFormControl, toNumber } from '@freelancer/utils';
import {
  ContestStatusApi,
  EntryFileFormatApi,
  EntryStatusApi,
  ENTRY_IMAGE_FORMATSApi,
  ENTRY_VIDEO_FORMATSApi,
} from 'api-typings/contests/contests';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { ContestFilePreviewModalComponent } from '../../../contest-file-preview-modal/contest-file-preview-modal.component';

export const MAX_CONTEST_BUDGET = 999999999;

export interface ContestAndFilesChanges {
  originalContest: Readonly<ContestViewContest>;
  contest: Partial<ContestViewContest>;
  newFiles: ReadonlyArray<ContestFile>;
  deletedFileIds: ReadonlyArray<number>;
}

@Component({
  selector: 'app-contest-details',
  template: `
    <ng-container
      *ngIf="!error; else errorState"
      flTrackingSection="ContestViewPage.Details"
    >
      <fl-card [size]="CardSize.SMALL">
        <fl-card-header-title class="CardHeader-left">
          <fl-heading
            i18n="Contest details header"
            [headingType]="HeadingType.H1"
            [size]="TextSize.MID"
            [flMarginRight]="Margin.XXSMALL"
            [flHideMobile]="true"
          >
            Contest Details
          </fl-heading>
          <fl-heading
            class="CardHeader-left-mobile"
            i18n="Contest details header"
            [headingType]="HeadingType.H1"
            [size]="TextSize.MID"
            [flMarginRight]="Margin.XXSMALL"
            [flHideTablet]="true"
            [flHideDesktop]="true"
          >
            Contest Details
          </fl-heading>
          <fl-link
            *ngIf="
              !((isEditingContestDetails$ | async) && isContestOwner) &&
              canEditContest
            "
            title="Edit"
            i18n-title="Edit contest details button"
            flTrackingLabel="GoToEditContest"
            flTrackingReferenceType="contest_id"
            flTrackingReferenceId="{{ contest?.id }}"
            (click)="handleEditDetailsShow()"
          >
            <fl-icon
              label="Edit Contest"
              i18n-label="Edit Contest icon label"
              [name]="'ui-pencil-v2'"
              [size]="IconSize.SMALL"
            ></fl-icon>
          </fl-link>
        </fl-card-header-title>
        <fl-card-header-right
          class="CardHeader-right"
          *ngIf="contest"
          [flHideMobile]="true"
        >
          <ng-container
            *ngIf="
              !((isEditingContestDetails$ | async) && canEditContest);
              else editPrizeDesktop
            "
          >
            <fl-heading
              class="CardHeader-right-value"
              [headingType]="HeadingType.H1"
              [size]="TextSize.MID"
            >
              {{ contest?.prize | flCurrency: contest?.currency.code }}
            </fl-heading>
            <fl-text
              i18n="Contest details prize header"
              [color]="FontColor.MID"
              [size]="TextSize.XXSMALL"
              [textTransform]="TextTransform.UPPERCASE"
              [weight]="FontWeight.BOLD"
            >
              Contest Prize
            </fl-text>
          </ng-container>
          <ng-template #editPrizeDesktop>
            <ng-container *ngIf="editDetailsFormGroup.get('prize') as control">
              <ng-container *ngIf="isFormControl(control)">
                <fl-input
                  #editPrize
                  class="PrizeInputField"
                  i18n-placeholder="Edit prize placeholder"
                  placeholder="Enter a prize"
                  flTrackingLabel="EditContestPrizeDesktop"
                  [disabled]="(contest?.prize || 0) >= MAX_CONTEST_BUDGET"
                  [control]="control"
                  [type]="InputType.NUMBER"
                  [beforeLabel]="contest?.currency.sign"
                  [afterLabel]="contest?.currency.code"
                ></fl-input>
              </ng-container>
            </ng-container>
          </ng-template>
        </fl-card-header-right>

        <ng-container *ngIf="contest; else loadingState">
          <fl-bit
            class="PrizeContainer"
            [flHideTablet]="true"
            [flHideDesktop]="true"
          >
            <ng-container
              *ngIf="
                !((isEditingContestDetails$ | async) && canEditContest);
                else editPrizeMobile
              "
            >
              <fl-heading
                class="PrizeContainer-value"
                [headingType]="HeadingType.H1"
                [size]="TextSize.MID"
              >
                {{ contest?.prize | flCurrency: contest?.currency.code }}
              </fl-heading>
              <fl-text
                i18n="Contest details prize header"
                [color]="FontColor.MID"
                [size]="TextSize.XXSMALL"
                [textTransform]="TextTransform.UPPERCASE"
                [weight]="FontWeight.BOLD"
                [flMarginBottom]="Margin.SMALL"
              >
                Contest Prize
              </fl-text>
            </ng-container>
            <ng-template #editPrizeMobile>
              <ng-container
                *ngIf="editDetailsFormGroup.get('prize') as control"
              >
                <fl-input
                  *ngIf="isFormControl(control)"
                  i18n-placeholder="Edit prize placeholder"
                  placeholder="Enter a prize"
                  flTrackingLabel="EditContestPrizeMobile"
                  [flMarginBottom]="Margin.SMALL"
                  [disabled]="(contest?.prize || 0) >= MAX_CONTEST_BUDGET"
                  [control]="control"
                  [type]="InputType.NUMBER"
                  [beforeLabel]="contest?.currency.sign"
                  [afterLabel]="contest?.currency.code"
                ></fl-input>
              </ng-container>
            </ng-template>
          </fl-bit>
          <fl-bit [flShowMobile]="true">
            <fl-heading
              i18n="Contest details title header"
              [headingType]="HeadingType.H2"
              [size]="TextSize.SMALL"
              [flMarginBottom]="Margin.XXSMALL"
            >
              Name
            </fl-heading>
            <fl-text
              i18n="Contest details title text"
              [flMarginBottom]="Margin.SMALL"
            >
              {{ contest?.title }}
            </fl-text>
          </fl-bit>
          <ng-container *ngIf="contestEnded; else contestOngoing">
            <fl-heading
              *ngIf="contest?.timeEnded"
              i18n="Contest details duration header"
              [headingType]="HeadingType.H2"
              [size]="TextSize.SMALL"
              [flMarginBottom]="Margin.XXSMALL"
            >
              Duration
            </fl-heading>
            <fl-text
              *ngIf="contest?.timeEnded"
              i18n="Contest details duration text"
              [flMarginBottom]="Margin.SMALL"
            >
              Submission of entries ended on {{ submissionEndDate | date }}
            </fl-text>
          </ng-container>
          <ng-template #contestOngoing>
            <fl-heading
              *ngIf="duration"
              i18n="Contest details duration header"
              [headingType]="HeadingType.H2"
              [size]="TextSize.SMALL"
              [flMarginBottom]="Margin.XXSMALL"
            >
              Duration
            </fl-heading>
            <fl-text
              *ngIf="duration"
              i18n="Contest details duration text"
              [flMarginBottom]="Margin.SMALL"
            >
              Contest ends in
              {{ duration | duration: DurationFormat.LONG | async }}
            </fl-text>
          </ng-template>

          <fl-heading
            i18n="Contest details description header"
            [headingType]="HeadingType.H2"
            [size]="TextSize.SMALL"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Description
          </fl-heading>
          <ng-container
            *ngIf="
              !((isEditingContestDetails$ | async) && canEditContest);
              else editDescription
            "
          >
            <fl-interactive-text
              class="Description"
              [fontSize]="TextSize.XSMALL"
              [fontColor]="FontColor.DARK"
              [link]="true"
              [content]="contest?.description"
              [flMarginBottom]="Margin.SMALL"
            ></fl-interactive-text>

            <fl-text
              *ngIf="isContestOwner && contest?.upgrades?.nda"
              i18n="NDA contest message for contest holder"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.SMALL"
            >
              Freelancers must sign a
              <fl-link
                flTrackingLabel="GoToNdaContestPage"
                flTrackingReferenceType="contest_id"
                flTrackingReferenceId="{{ contest?.id }}"
                [link]="'/contest/nda_print.php'"
                [queryParams]="{ contest_id: contest?.id }"
                [newTab]="true"
              >
                Non-Disclosure Agreement
              </fl-link>
              to view this contest
            </fl-text>

            <fl-bit
              *ngIf="upgrades.length !== 0"
              [flMarginBottom]="Margin.SMALL"
            >
              <fl-upgrade-tag
                *ngFor="let upgrade of upgrades"
                [upgradeType]="upgrade"
                [flMarginBottom]="Margin.XXSMALL"
                [flMarginRight]="Margin.XXXSMALL"
              ></fl-upgrade-tag>
            </fl-bit>
          </ng-container>

          <ng-template #editDescription>
            <ng-container
              *ngIf="editDetailsFormGroup.get('description') as control"
            >
              <fl-textarea
                *ngIf="isFormControl(control)"
                i18n-placeholder="
                   Edit Contest form description field placeholder
                "
                placeholder="Write a description"
                flTrackingLabel="EditDescription"
                [control]="control"
                [rows]="7"
              >
              </fl-textarea>
            </ng-container>
            <fl-text
              *ngIf="
                DESCRIPTION_MAX_CHAR_COUNT -
                  descriptionControl?.value.length !==
                1
              "
              i18n="Description character count"
              [flMarginBottom]="Margin.SMALL"
              [size]="TextSize.XXSMALL"
              [textAlign]="TextAlign.RIGHT"
            >
              {{
                DESCRIPTION_MAX_CHAR_COUNT - descriptionControl?.value.length
              }}
              characters remaining
            </fl-text>
            <fl-text
              *ngIf="
                DESCRIPTION_MAX_CHAR_COUNT -
                  descriptionControl?.value.length ===
                1
              "
              i18n="Description character count"
              [flMarginBottom]="Margin.SMALL"
              [size]="TextSize.XXSMALL"
              [textAlign]="TextAlign.RIGHT"
            >
              {{
                DESCRIPTION_MAX_CHAR_COUNT - descriptionControl?.value.length
              }}
              character remaining
            </fl-text>
          </ng-template>

          <fl-bit
            *ngIf="
              (contestFiles && contestFiles?.length !== 0) ||
              ((isEditingContestDetails$ | async) && canEditContest)
            "
          >
            <fl-heading
              i18n="Contest details attachments header"
              [headingType]="HeadingType.H2"
              [size]="TextSize.SMALL"
              [flMarginBottom]="Margin.XXSMALL"
            >
              Files Attached
            </fl-heading>

            <ng-container
              *ngIf="
                !((isEditingContestDetails$ | async) && canEditContest);
                else editFiles
              "
            >
              <fl-grid [flMarginBottom]="Margin.SMALL">
                <fl-col
                  class="FileContainer"
                  *ngFor="let file of contestFiles; let i = index"
                  [col]="12"
                  [colTablet]="6"
                  [colDesktopSmall]="4"
                  [flMarginBottom]="Margin.XXSMALL"
                >
                  <fl-file-display
                    [src]="file.name"
                    [alt]="file.name"
                    [type]="FileDisplayType.ICON"
                    [iconColor]="IconColor.MID"
                    [iconSize]="IconSize.MID"
                    [flMarginRight]="Margin.XXXSMALL"
                  ></fl-file-display>
                  <fl-link
                    flTrackingLabel="OpenFilePreviewModal"
                    flTrackingReferenceType="file_id"
                    flTrackingReferenceId="{{ file.id }}"
                    (click)="onFileClick(i)"
                  >
                    {{ file.name | truncateFilename: MAX_FILENAME_LENGTH }}
                  </fl-link>
                </fl-col>
              </fl-grid>
            </ng-container>

            <ng-template #editFiles>
              <app-contest-file-upload
                [contest]="contest"
                [contestFiles]="visibleContestFiles"
                (onFileAdd)="handleFileUploadInProgress()"
                (onFileDelete)="handleFileDelete($event)"
                (onUploadFinish)="handleFileUploadFinish($event)"
              ></app-contest-file-upload>
            </ng-template>
          </fl-bit>

          <fl-heading
            i18n="Contest details skills header"
            [headingType]="HeadingType.H2"
            [size]="TextSize.SMALL"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Skills Required
          </fl-heading>
          <fl-bit
            *ngIf="
              !((isEditingContestDetails$ | async) && canEditContest);
              else editSkills
            "
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-tag
              *ngFor="let skill of contest?.skills"
              [type]="TagType.DEFAULT"
              [flMarginRight]="Margin.XXXSMALL"
              [flMarginBottom]="Margin.XXXSMALL"
            >
              {{ skill.name }}
            </fl-tag>
          </fl-bit>
          <ng-template #editSkills>
            <ng-container *ngIf="editDetailsFormGroup.get('skills') as control">
              <ng-container *ngIf="isFormControl(control)">
                <fl-multi-select
                  *ngIf="skillsOptions as skills"
                  flTrackingLabel="EditSkills"
                  i18n-placeholder="Edit Contest form skills field placeholder"
                  placeholder="Enter skills here"
                  [flMarginBottom]="Margin.SMALL"
                  [control]="control"
                  [options]="skills"
                ></fl-multi-select>
              </ng-container>
            </ng-container>
          </ng-template>

          <fl-heading
            i18n="Contest details file format header"
            [headingType]="HeadingType.H2"
            [size]="TextSize.SMALL"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Accepted File Formats
          </fl-heading>
          <fl-text
            *ngIf="
              !((isEditingContestDetails$ | async) && canEditContest);
              else editFileFormats
            "
            [flMarginBottom]="Margin.SMALL"
            [textTransform]="TextTransform.UPPERCASE"
          >
            {{ contest?.acceptedFileFormats.join(', ') }}
          </fl-text>
          <ng-template #editFileFormats>
            <fl-dropdown-filter
              buttonText="{{ selectedFileFormatsNames }}"
              [contentSize]="DropdownFilterContentSize.INHERIT"
              [display]="'block'"
              [flMarginBottom]="Margin.SMALL"
            >
              <ng-container *ngIf="fileFormatControls.get('image') as control">
                <fl-checkbox
                  *ngIf="isFormControl(control)"
                  class="FileFormatCheckbox"
                  flTrackingLabel="TickImageFileType"
                  flTrackingReferenceType="contest_id"
                  flTrackingReferenceId="{{ contest.id }}"
                  i18n-label="File format checkbox label"
                  label="Image {{ fileFormatControlExtensions['image'] }}"
                  [control]="control"
                ></fl-checkbox>
              </ng-container>
              <ng-container *ngIf="fileFormatControls.get('video') as control">
                <fl-checkbox
                  *ngIf="isFormControl(control)"
                  class="FileFormatCheckbox"
                  flTrackingLabel="TickVideoFileType"
                  flTrackingReferenceType="contest_id"
                  flTrackingReferenceId="{{ contest.id }}"
                  i18n-label="File format checkbox label"
                  label="Video {{ fileFormatControlExtensions['video'] }}"
                  [control]="control"
                ></fl-checkbox>
              </ng-container>
              <ng-container *ngIf="fileFormatControls.get('text') as control">
                <fl-checkbox
                  *ngIf="isFormControl(control)"
                  class="FileFormatCheckbox"
                  flTrackingLabel="TickTextFileType"
                  flTrackingReferenceType="contest_id"
                  flTrackingReferenceId="{{ contest.id }}"
                  i18n-label="File format checkbox label"
                  label="Text {{ fileFormatControlExtensions['text'] }}"
                  [control]="control"
                ></fl-checkbox>
              </ng-container>
            </fl-dropdown-filter>
          </ng-template>

          <fl-banner-alert
            [flHide]="
              !(
                (isEditingContestDetails$ | async) &&
                canEditContest &&
                ((updateDetailsPromise | async)?.status === 'error' ||
                  (updatePrizePromise | async)?.status === 'error' ||
                  hasFilesError)
              )
            "
            flTrackingSection="ContestViewPage.Details"
            [type]="BannerAlertType.ERROR"
            [flMarginBottom]="Margin.SMALL"
            [closeable]="false"
          >
            <fl-text
              *ngIf="
                (updateDetailsPromise | async)?.status === 'error' &&
                  hasFilesError;
                else updateDetailsError
              "
              i18n="Update contest error message"
            >
              Something went wrong while updating the contest. Your changes
              might have been partially saved only. Please try again.
            </fl-text>
            <ng-template #updateDetailsError>
              <fl-text
                *ngIf="
                  (updateDetailsPromise | async)?.status === 'error';
                  else updatePrizeError
                "
                i18n="Update contest details error message"
              >
                Something went wrong while updating the contest. Please try
                again.
              </fl-text>
            </ng-template>
            <ng-template #updatePrizeError>
              <fl-text
                *ngIf="
                  (updatePrizePromise | async)?.status === 'error';
                  else updateFilesError
                "
                i18n="Update contest prize error message"
              >
                Something went wrong while updating the contest prize. Please
                try again.
              </fl-text>
            </ng-template>
            <ng-template #updateFilesError>
              <fl-text i18n="Update contest files error message">
                Something went wrong while updating the contest files. Your
                changes might have been partially saved only. Please try again.
              </fl-text>
            </ng-template>
          </fl-banner-alert>
          <fl-bit
            class="EditDetailsCtas"
            *ngIf="(isEditingContestDetails$ | async) && canEditContest"
          >
            <fl-button
              i18n="Edit contest details cancel button"
              flTrackingLabel="CancelContestDetailsEdit"
              [color]="ButtonColor.DEFAULT"
              [flMarginRight]="Margin.XSMALL"
              [size]="ButtonSize.SMALL"
              [disabled]="
                (updateDetailsPromise && !(updateDetailsPromise | async)) ||
                (contestFilesPromise && !(contestFilesPromise | async)) ||
                (updatePrizePromise && !(updatePrizePromise | async)) ||
                (updatePrizePromise | async)?.status === 'success'
              "
              (click)="handleEditDetailsCancel()"
            >
              Cancel
            </fl-button>
            <fl-button
              i18n="Edit contest details save button"
              flTrackingLabel="SaveContestDetailsEdit"
              [color]="ButtonColor.SECONDARY"
              [disabled]="
                (!editDetailsFormGroup.valid ||
                  !editDetailsFormGroup.dirty ||
                  isFileUploadInProgress) &&
                !(
                  (updateDetailsPromise && !(updateDetailsPromise | async)) ||
                  (contestFilesPromise && !(contestFilesPromise | async)) ||
                  (updatePrizePromise && !(updatePrizePromise | async)) ||
                  (updatePrizePromise | async)?.status === 'success'
                )
              "
              [busy]="
                (updateDetailsPromise && !(updateDetailsPromise | async)) ||
                (contestFilesPromise && !(contestFilesPromise | async)) ||
                (updatePrizePromise && !(updatePrizePromise | async)) ||
                (updatePrizePromise | async)?.status === 'success'
              "
              [size]="ButtonSize.SMALL"
              (click)="handleEditDetailsSave()"
            >
              Save
            </fl-button>
          </fl-bit>
        </ng-container>
        <ng-template #loadingState>
          <fl-loading-text [rows]="8"></fl-loading-text>
        </ng-template>
      </fl-card>
    </ng-container>
    <ng-template #errorState>
      <fl-card [flMarginBottom]="Margin.MID">
        <fl-bit class="ErrorContainer">
          <fl-picture
            alt="Load Contest Error"
            i18n-alt="Load contest error image"
            [src]="'contest-view-page/load-contest-error.svg'"
            [flMarginBottom]="Margin.SMALL"
          ></fl-picture>
          <fl-bit class="ErrorContainer-text">
            <fl-text
              i18n="Load contest error text"
              [weight]="FontWeight.BOLD"
              [flMarginRight]="Margin.XXXSMALL"
            >
              Oops, something went wrong. Please refresh or try again.
            </fl-text>
          </fl-bit>
        </fl-bit>
      </fl-card>
    </ng-template>
  `,
  styleUrls: [`./contest-details.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestDetailsComponent
  implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CardSize = CardSize;
  DropdownFilterContentSize = DropdownFilterContentSize;
  DurationFormat = DurationFormat;
  FileDisplayType = FileDisplayType;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  InputType = InputType;
  isFormControl = isFormControl;
  Margin = Margin;
  TagType = TagType;
  TextAlign = TextAlign;
  TextTransform = TextTransform;

  MAX_CONTEST_BUDGET = MAX_CONTEST_BUDGET;

  @Input() contest: ContestViewContest;
  @Input() contestFiles: ReadonlyArray<ContestFile>;
  @Input() entries: ReadonlyArray<ContestEntry>;
  @Input() error: boolean;
  @Input() isContestOwner: boolean;
  @Input() awardedEntry: ContestViewEntry;
  @Input() skills: ReadonlyArray<Skill>;
  @Input() updateDetailsPromise:
    | Promise<BackendUpdateResponse<ContestViewContestsCollection>>
    | undefined;
  @Input() contestFilesPromise:
    | Promise<
        ReadonlyArray<
          | BackendPushResponse<ContestFilesCollection>
          | BackendDeleteResponse<ContestFilesCollection>
        >
      >
    | undefined;
  @Output() onEditContestAndFilesSave = new EventEmitter<
    ContestAndFilesChanges
  >();

  readonly DESCRIPTION_MIN_CHAR_COUNT = 30;
  readonly DESCRIPTION_MAX_CHAR_COUNT = 4000;

  readonly MAX_FILENAME_LENGTH = 25;

  visibleContestFiles: ReadonlyArray<ContestFile> = [];
  uploadedFiles: ReadonlyArray<ContestFile> = [];
  deletedFileIds: ReadonlyArray<number> = [];

  isEditingContestDetails$: Rx.Observable<boolean>;
  contestEnded: boolean;
  submissionEndDate: number | null;
  duration: number | null;
  upgrades: ReadonlyArray<UpgradeType | undefined> = [];
  canEditContest: boolean;
  editDetailsFormGroup: FormGroup;
  editContestParamsSubscription?: Rx.Subscription;
  skillsControl: FormControl;
  descriptionControl: FormControl;
  prizeControl: FormControl;
  fileFormatControls: FormGroup;
  skillsOptions: ReadonlyArray<SelectItem> = [];
  currentSkillsIds: ReadonlyArray<number>;
  updatePrizePromise:
    | Promise<BackendSuccessResponse | BackendUpdateResponse<CartsCollection>>
    | undefined;
  selectedFileFormats: ReadonlyArray<EntryFileFormatApi> = [];
  selectedFileFormatsNames: string;
  fileFormatControlExtensions: { [key: string]: string };
  fileFormatControlsSubscription?: Rx.Subscription;
  isFileUploadInProgress = false;
  hasFilesError = false;

  @ViewChild('editPrize') contestPrizeInput: InputComponent;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private router: Router,
    private cart: PaymentsCart,
    private focus: Focus,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('contest' in changes && changes.contest.currentValue !== null) {
      this.contestEnded = this.hasContestEnded();
      this.duration = this.getDuration();
      this.upgrades = this.getUpgrades();

      this.currentSkillsIds = this.contest.skills.map(skill => skill.id);

      this.skillsControl = new FormControl(
        this.currentSkillsIds,
        Validators.compose([
          minLength(1, $localize`Please enter at least 1 skill`),
          maxLength(5, $localize`Please enter at most 5 skills`),
        ]),
      );

      // Due to some contests having more than 5 skills, we validate the
      // skills to display the error message when edit mode is toggled on
      this.skillsControl.markAsTouched();

      this.descriptionControl = new FormControl(
        this.contest.description,
        Validators.compose([
          required($localize`Please enter a description`),
          minLength(
            this.DESCRIPTION_MIN_CHAR_COUNT,
            $localize`Please enter at least ${this.DESCRIPTION_MIN_CHAR_COUNT} characters`,
          ),
          maxLength(
            this.DESCRIPTION_MAX_CHAR_COUNT,
            $localize`Please enter at most ${this.DESCRIPTION_MAX_CHAR_COUNT} characters`,
          ),
        ]),
      );

      // Check on contest change because `handleEditDetailsShow` does not get
      // called when a user navigates from another page to edit contest details
      if (this.activatedRoute.snapshot.queryParamMap.has('edit')) {
        this.checkDescriptionValidity();
      }

      if (
        !this.prizeControl ||
        (this.contest &&
          isDefined(this.contest.prize) &&
          this.prizeControl.value < toNumber(this.contest.prize))
      ) {
        this.prizeControl = new FormControl(
          this.contest.prize,
          Validators.compose([
            required($localize`You must enter a contest prize`),
            wholeNumber($localize`The prize must be in whole numbers`),
            minValue(
              this.contest.prize ? this.contest.prize : 0,
              $localize`You can only increase the contest prize`,
            ),
            maxValue(
              MAX_CONTEST_BUDGET,
              $localize`The contest prize cannot be greater than ${MAX_CONTEST_BUDGET}.`,
            ),
          ]),
        );
      }

      this.fileFormatControls = this.fb.group(
        {
          image: false,
          video: false,
          text: false,
        },
        {
          validator: minNumOfTrue(
            1,
            $localize`Please select at least one file type`,
          ),
        },
      );

      this.initializeFileFormatEditMode();

      this.editDetailsFormGroup = this.fb.group({
        description: this.descriptionControl,
        skills: this.skillsControl,
        prize: this.prizeControl,
        entryFileFormats: this.fileFormatControls,
      });
    }

    if (
      'contestFiles' in changes &&
      changes.contestFiles.currentValue !== null
    ) {
      this.visibleContestFiles = this.contestFiles.filter(
        file => !this.deletedFileIds.includes(file.id),
      );
    }

    if ('entries' in changes && changes.entries.currentValue !== null) {
      this.submissionEndDate = this.getSubmissionEndDate();
    }

    if (
      ('contest' in changes && changes.contest.currentValue !== null) ||
      ('isContestOwner' in changes &&
        changes.isContestOwner.currentValue !== null &&
        this.contest !== null) ||
      ('awardedEntry' in changes && changes.awardedEntry.currentValue !== null)
    ) {
      this.canEditContest = this.canEditContestDetails();
    }

    if ('skills' in changes && changes.skills.currentValue !== null) {
      // Format all skills to SelectItem
      this.skillsOptions = this.skills.map(skill => ({
        displayText: skill.name,
        value: skill.id,
      }));
    }

    if (
      ('updateDetailsPromise' in changes &&
        changes.updateDetailsPromise.currentValue !== undefined &&
        this.updateDetailsPromise !== undefined) ||
      ('contestFilesPromise' in changes &&
        changes.contestFilesPromise.currentValue !== undefined &&
        this.contestFilesPromise !== undefined)
    ) {
      if (this.updateDetailsPromise && this.contestFilesPromise) {
        Promise.all([this.updateDetailsPromise, this.contestFilesPromise]).then(
          ([updateContestResult, filesResult]) => {
            this.hasFilesError = filesResult.some(
              result => result.status !== 'success',
            );

            if (this.hasFilesError) {
              this.editDetailsFormGroup.markAsDirty();
              return;
            }

            if (updateContestResult.status !== 'success') {
              return;
            }

            this.handlePrizeUpdate();
          },
        );
      } else if (this.updateDetailsPromise) {
        this.updateDetailsPromise.then(response =>
          response.status === 'success' ? this.handlePrizeUpdate() : undefined,
        );
      } else if (this.contestFilesPromise) {
        this.contestFilesPromise.then(response => {
          if (response.every(result => result.status === 'success')) {
            return this.handlePrizeUpdate();
          }

          // If something fails on the files request, we should make the
          // save button clickable
          this.editDetailsFormGroup.markAsDirty();
          this.hasFilesError = true;
        });
      }
    }
  }

  ngOnInit() {
    this.isEditingContestDetails$ = this.activatedRoute.queryParamMap.pipe(
      map(params => params.has('edit')),
    );
  }

  ngAfterViewInit() {
    this.editContestParamsSubscription = Rx.combineLatest([
      this.activatedRoute.queryParamMap,
      this.isEditingContestDetails$,
    ]).subscribe(([params, isEditingContest]) => {
      if (
        isEditingContest &&
        this.contestPrizeInput &&
        params.has('contest_prize') &&
        params.get('contest_prize')
      ) {
        this.focus.focusElement(this.contestPrizeInput.nativeElement);
      }
    });
  }

  initializeFileFormatEditMode() {
    const isImageFileFormatAccepted = ENTRY_IMAGE_FORMATSApi.some(format =>
      this.contest.acceptedFileFormats.includes(format),
    );

    const isVideoFileFormatAccepted = ENTRY_VIDEO_FORMATSApi.some(format =>
      this.contest.acceptedFileFormats.includes(format),
    );

    const isTextFileFormatAccepted = this.contest.acceptedFileFormats.includes(
      EntryFileFormatApi.PDF,
    );

    this.fileFormatControls.setValue(
      {
        image: isImageFileFormatAccepted,
        video: isVideoFileFormatAccepted,
        text: isTextFileFormatAccepted,
      },
      { emitEvent: false },
    );

    this.fileFormatControlExtensions = {
      image: `(${ENTRY_IMAGE_FORMATSApi.join(', ').toUpperCase()})`,
      video: `(${ENTRY_VIDEO_FORMATSApi.join(', ').toUpperCase()})`,
      text: `(${EntryFileFormatApi.PDF.toUpperCase()})`,
    };

    this.selectedFileFormats = [...this.contest.acceptedFileFormats];

    this.selectedFileFormatsNames = this.contest.acceptedFileFormats
      .join(', ')
      .toUpperCase();

    this.fileFormatControlsSubscription = this.fileFormatControls.valueChanges.subscribe(
      fileFormat => {
        const fileFormatArray: EntryFileFormatApi[] = [];

        if (fileFormat.image) {
          fileFormatArray.push(...ENTRY_IMAGE_FORMATSApi);
        }

        if (fileFormat.video) {
          fileFormatArray.push(...ENTRY_VIDEO_FORMATSApi);
        }

        if (fileFormat.text) {
          fileFormatArray.push(EntryFileFormatApi.PDF);
        }

        this.selectedFileFormats = fileFormatArray;
        this.selectedFileFormatsNames =
          fileFormatArray.length !== 0
            ? fileFormatArray.join(', ').toUpperCase()
            : '(Please select at least one file type)';
      },
    );
  }

  hasContestEnded() {
    return [ContestStatusApi.PENDING, ContestStatusApi.CLOSED].includes(
      this.contest.status,
    );
  }

  getSubmissionEndDate() {
    const awardedEntry = this.entries.find(
      entry => entry.status === EntryStatusApi.WON,
    );
    if (awardedEntry && awardedEntry.timeWon) {
      return awardedEntry.timeWon;
    }

    if (this.contest && this.contest.timeEnded) {
      return this.contest.timeEnded;
    }

    return null;
  }

  getDuration() {
    if (this.contest && this.contest.timeEnded) {
      return this.contest.timeEnded - new Date().getTime();
    }

    return null;
  }

  getUpgrades() {
    if (this.contest.upgrades) {
      return Object.entries(this.contest.upgrades)
        .filter(([_, value]) => value)
        .map(([upgrade, _]) => transformUpgradeType(upgrade))
        .filter(isDefined)
        .sort(
          (upgrade1, upgrade2) =>
            getUpgradeOrder(upgrade1) - getUpgradeOrder(upgrade2),
        );
    }

    return [];
  }

  canEditContestDetails() {
    return (
      this.isContestOwner &&
      this.contest.status === ContestStatusApi.ACTIVE &&
      this.awardedEntry === undefined
    );
  }

  onFileClick(index: number) {
    this.modalService.open(ContestFilePreviewModalComponent, {
      inputs: {
        files: this.contestFiles,
        selectedFileIndex: index,
      },
      size: ModalSize.MID,
      mobileFullscreen: true,
    });
  }

  handleEditDetailsShow() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        edit: true,
      },
      replaceUrl: true,
    });

    this.checkDescriptionValidity();
  }

  handleEditDetailsCancel() {
    // Reset form values and hide form
    this.skillsControl.setValue(this.currentSkillsIds, {
      emitEvent: true,
    });
    this.descriptionControl.setValue(this.contest.description);
    this.prizeControl.setValue(this.contest.prize);

    this.initializeFileFormatEditMode();

    // Reset promises to reset error state
    this.contestFilesPromise = undefined;
    this.updateDetailsPromise = undefined;
    this.updatePrizePromise = undefined;

    // Reset to pristine since file changes have been discarded
    this.editDetailsFormGroup.markAsPristine();
    this.deletedFileIds = [];
    this.uploadedFiles = [];
    this.visibleContestFiles = this.contestFiles;
    this.isFileUploadInProgress = false;
    this.hasFilesError = false;

    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        edit: null,
        contest_prize: null,
      },
      replaceUrl: true,
    });
  }

  handleEditDetailsSave() {
    const description: string = this.descriptionControl.value;
    const skillIds: ReadonlyArray<number> = this.skillsControl.value;
    const selectedSkills: ReadonlyArray<Skill> = this.skills.filter(skill =>
      skillIds.includes(skill.id),
    );

    // set to false while we're waiting for the result
    this.hasFilesError = false;
    this.onEditContestAndFilesSave.emit({
      newFiles: this.uploadedFiles,
      deletedFileIds: this.deletedFileIds,
      contest: {
        description,
        skills: selectedSkills,
        acceptedFileFormats: this.selectedFileFormats,
      },
      originalContest: this.contest,
    });
  }

  handlePrizeUpdate() {
    // Call on cart only if the prize field is changed
    const prize: number = this.prizeControl.value;
    const currentPrize = this.contest.prize ? this.contest.prize : 0;
    if (prize > currentPrize) {
      this.updatePrize(prize - currentPrize);
    } else {
      this.handleEditDetailsCancel();
    }
  }

  private updatePrize(amountToCharge: number) {
    this.updatePrizePromise = this.cart.handle(
      `Contest Prize Upgrade for ${this.contest.id}`,
      {
        destination: DestinationApi.CONTEST_VIEW_PAGE,
        payload: `${this.contest.id}/details`,
      },
      [
        {
          contextType: ContextTypeApi.CONTEST_PRIZE_UPGRADE,
          contextId: `${this.contest.id}`,
          description: 'Contest Prize Upgrade',
          currencyId: this.contest.currency.id,
          amount: amountToCharge,
        },
      ],
    );
  }

  handleFileDelete(fileId: number) {
    this.editDetailsFormGroup.markAsDirty();
    this.deletedFileIds = [...this.deletedFileIds, fileId];
    this.visibleContestFiles = this.contestFiles.filter(
      file => !this.deletedFileIds.includes(file.id),
    );
  }

  handleFileUploadFinish(files: ReadonlyArray<ContestFile>) {
    this.editDetailsFormGroup.markAsDirty();
    this.isFileUploadInProgress = false;
    this.uploadedFiles = files;

    if (files.length === 0) {
      if (
        !this.skillsControl.dirty &&
        !this.descriptionControl.dirty &&
        !this.prizeControl.dirty &&
        this.deletedFileIds.length === 0
      ) {
        this.editDetailsFormGroup.markAsPristine();
      }
    }
  }

  handleFileUploadInProgress() {
    this.isFileUploadInProgress = true;
  }

  checkDescriptionValidity() {
    // We immediately check if the contest has an invalid description because
    // it's possible to create a contest without a description or a description
    // that is below the minimum character count via API/legacy flow. This is
    // because on the legacy PJP, description was optional but is now required.
    if (this.descriptionControl && this.descriptionControl.invalid) {
      this.descriptionControl.markAsTouched();
    }
  }

  ngOnDestroy() {
    if (this.fileFormatControlsSubscription) {
      this.fileFormatControlsSubscription.unsubscribe();
    }

    if (this.editContestParamsSubscription) {
      this.editContestParamsSubscription.unsubscribe();
    }
  }
}

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
import { FormControl } from '@angular/forms';
import {
  ContestFile,
  ContestViewContest,
} from '@freelancer/datastore/collections';
import {
  FileStorage,
  StorageBucket,
  UploadTask,
  UploadTaskEvent,
} from '@freelancer/file-storage';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { FileDisplaySize, FileDisplayType } from '@freelancer/ui/file-display';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { ProgressFill, ProgressSize } from '@freelancer/ui/progress-bar';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import {
  filenamesUniqueAsync,
  filesUniqueAsync,
  maxFileSize,
  minFileSize,
} from '@freelancer/ui/validators';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, last, map, switchMap, take } from 'rxjs/operators';

/**
 * Used as the main upload object for this component.
 *
 * @property temporaryUploadId - returned by the endpoint as a temporary ID
 * @property file - the file that is being uploaded
 * @property uploadTask - needed to add this here since I need the cancel method
 * @property uploadDone - we're using a flag that is set when the uploadTaskEvent$ emits last since it's easier than to flatten and track a dynamic list of observables of uploadTaskEvent$
 * @property uploadProgress$ - file upload progress
 * @property uploadTaskEvent$ - need this for the error code in case an upload fails
 */
interface FileUploadObject {
  temporaryUploadId: number | undefined;
  file: File;
  uploadDone: boolean;
  uploadTask: UploadTask;
  uploadProgress$: Rx.Observable<number>;
  uploadTaskEvent$: Rx.Observable<UploadTaskEvent>;
}

@Component({
  selector: 'app-contest-file-upload',
  template: `
    <fl-bit class="FileSelectCustom">
      <fl-file-select
        #fileSelect
        flTrackingLabel="ContestFileSelect"
        [control]="filesControl"
        [multiple]="true"
      >
        <fl-bit
          flTrackingLabel="ContestFileSelect"
          class="FileSelectCustom-uploadArea"
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.NONE"
          [ngClass]="{
            'FileSelectCustom-uploadArea-error': filesControl.invalid
          }"
          [flHideMobile]="true"
          (click)="fileSelect.triggerInput()"
        >
          <fl-icon
            name="ui-upload"
            [color]="IconColor.DARK"
            [size]="IconSize.SMALL"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-icon>
          <fl-text
            i18n="Edit Contest attachment upload text"
            [color]="FontColor.DARK"
            [fontType]="FontType.SPAN"
          >
            Drag & drop your files here or
            <fl-link
              flTrackingLabel="UploadFileAttachment"
              flTrackingReferenceType="contest_id"
              flTrackingReferenceId="{{ contest.id }}"
            >
              browse
            </fl-link>
            (Max file size: {{ MAX_FILE_SIZE_TEXT }}).
          </fl-text>
        </fl-bit>

        <fl-button
          flTrackingLabel="UploadFileAttachment"
          flTrackingReferenceType="contest_id"
          flTrackingReferenceId="{{ contest.id }}"
          i18n="Edit Contest attachment upload button"
          [color]="ButtonColor.TRANSPARENT_DARK"
          [size]="ButtonSize.SMALL"
          [flHideDesktop]="true"
          [flHideTablet]="true"
          (click)="fileSelect.triggerInput()"
        >
          <fl-icon name="ui-plus-alt" [size]="IconSize.XSMALL"></fl-icon>
          Upload Files
        </fl-button>
      </fl-file-select>
      <fl-list [bottomBorder]="true" [type]="ListItemType.DISMISS">
        <fl-list-item
          *ngFor="let file of contestFiles"
          [padding]="ListItemPadding.MID"
          (dismiss)="deleteFile(file)"
        >
          <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
            <fl-col class="FileSelectCustom-fileName" [col]="8">
              <fl-file-display
                [flMarginRight]="Margin.SMALL"
                [size]="FileDisplaySize.XSMALL"
                [src]="file.name"
                [type]="FileDisplayType.ICON"
              ></fl-file-display>
              <fl-text [size]="TextSize.XXSMALL">
                <fl-bit class="FileSelectCustom-fileName-text">
                  {{ file.name }}
                </fl-bit>
              </fl-text>
            </fl-col>
          </fl-grid>
        </fl-list-item>

        <fl-list-item
          *ngFor="let uploadObject of fileUploads$ | async"
          [padding]="ListItemPadding.MID"
          (dismiss)="cancelUpload(uploadObject.file)"
        >
          <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
            <fl-col class="FileSelectCustom-fileName" [col]="8">
              <fl-file-display
                [flMarginRight]="Margin.SMALL"
                [size]="FileDisplaySize.XSMALL"
                [src]="uploadObject.file.name"
                [type]="FileDisplayType.ICON"
              ></fl-file-display>
              <fl-text [size]="TextSize.XXSMALL">
                <fl-bit class="FileSelectCustom-fileName-text">
                  {{ uploadObject.file.name }}
                </fl-bit>
              </fl-text>
            </fl-col>

            <fl-col
              *ngIf="!uploadObject.temporaryUploadId"
              [col]="4"
              [flexContainer]="true"
            >
              <ng-container
                *ngIf="
                  uploadObject.uploadTaskEvent$ | async;
                  let uploadTaskEvent
                "
              >
                <fl-progress-bar
                  *ngIf="uploadTaskEvent.state === 'running'"
                  label="File uploading"
                  i18n-label="Contest details file upload's progress bar label"
                  [fill]="ProgressFill.DEFAULT"
                  [flMarginRight]="Margin.SMALL"
                  [progressPercentage]="uploadObject.uploadProgress$ | async"
                  [size]="ProgressSize.LARGE"
                ></fl-progress-bar>
                <app-contest-file-upload-inline-error
                  *ngIf="uploadTaskEvent.state === 'error'"
                  [errorCode]="uploadTaskEvent.error.errorCode"
                  [hasRequestId]="!!uploadTaskEvent.error.requestId"
                ></app-contest-file-upload-inline-error>
              </ng-container>
            </fl-col>
          </fl-grid>
        </fl-list-item>
      </fl-list>
    </fl-bit>
  `,
  styleUrls: [`./file-upload.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestFileUploadComponent
  implements OnChanges, OnInit, OnDestroy {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FileDisplaySize = FileDisplaySize;
  FileDisplayType = FileDisplayType;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  IconColor = IconColor;
  IconSize = IconSize;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;
  ProgressFill = ProgressFill;
  ProgressSize = ProgressSize;
  VerticalAlignment = VerticalAlignment;

  @Input() contest: Readonly<ContestViewContest>;
  @Input() contestFiles: ReadonlyArray<ContestFile>;
  @Output() onFileDelete = new EventEmitter<number>();
  @Output() onFileAdd = new EventEmitter();
  @Output() onUploadFinish = new EventEmitter<ReadonlyArray<ContestFile>>();

  readonly MAX_FILE_SIZE = 20971520;
  readonly MAX_FILE_SIZE_TEXT = '20 MB';
  readonly MIN_FILE_SIZE = 1;
  readonly MIN_FILE_SIZE_TEXT = '1 byte';

  // Need this for the `filenamesUniqueAsync` validator to work
  private existingContestFilesSubject$ = new Rx.BehaviorSubject<
    ReadonlyArray<File>
  >([]);
  private existingContestFiles$ = this.existingContestFilesSubject$.asObservable();
  // We need to use a subject/observable for the `filesUniqueAsync` validator
  private fileUploadsSubject$ = new Rx.BehaviorSubject<
    ReadonlyArray<FileUploadObject>
  >([]);
  fileUploads$ = this.fileUploadsSubject$.asObservable();
  private failedUploads: ReadonlyArray<FileUploadObject> = [];

  fileSubscription?: Rx.Subscription;

  filesControl = new FormControl(
    [],
    [
      maxFileSize(
        this.MAX_FILE_SIZE,
        $localize`Please upload a file that does not exceed ${this.MAX_FILE_SIZE_TEXT} in size.`,
      ),
      minFileSize(
        this.MIN_FILE_SIZE,
        $localize`Please upload a file with a size of at least ${this.MIN_FILE_SIZE_TEXT}.`,
      ),
    ],
    [
      filenamesUniqueAsync(
        this.existingContestFiles$.pipe(take(1)),
        Rx.of(
          $localize`You have already uploaded a file with the same name. Try renaming the file in order to proceed.`,
        ),
      ),
      filesUniqueAsync(
        this.fileUploads$.pipe(
          map(files =>
            files
              .filter(
                uploadObject =>
                  !this.failedUploads
                    .map(fileUploadObject => fileUploadObject.file)
                    .includes(uploadObject.file),
              )
              .map(fileUploadObject => fileUploadObject.file),
          ),
          take(1),
        ),
        Rx.of(
          $localize`You have already uploaded a file with the same name. Try renaming the file in order to proceed.`,
        ),
      ),
    ],
  );

  constructor(private fileStorage: FileStorage) {}

  /**
   * (1) Initialize the files subscription here. For each valid file that is
   * added by the user, the `addFile` function is called. If there was
   * previously a failed attempt to upload the file, we remove the file
   * from the list of the uploads and start another attempt.
   */
  ngOnInit() {
    this.fileSubscription = this.filesControl.valueChanges
      .pipe(
        filter(isDefined),
        switchMap((files: ReadonlyArray<File>) => files),
      )
      .subscribe(file => {
        if (this.filesControl.valid) {
          if (
            this.failedUploads.find(uploadObject =>
              this.isSameFile(uploadObject.file, file),
            )
          ) {
            this.removeFileFromUploadLists(file);
          }

          this.addFile(file);
        }
      });
  }

  /**
   * We watch `contestFiles` here since we want to remove the files that have
   * already been created via datastore. Normally, we wouldn't need to do this
   * but in case some of the `createObject` fail, the interface would show
   * an error message but wouldn't update the upload list. We should remove
   * the successful uploads in the list.
   *
   * We also change the existing files for the `filenamesUniqueAsync` validator
   * here by passing in an array of files having the names present in the
   * current list of contest files.
   */
  ngOnChanges(changes: SimpleChanges) {
    if ('contestFiles' in changes && isDefined(this.contestFiles)) {
      const filenames = this.contestFiles.map(file => file.name);
      const uploadObjects = this.fileUploadsSubject$.value;
      uploadObjects.forEach(uploadObject => {
        if (filenames.includes(uploadObject.file.name)) {
          this.removeFileFromUploadLists(uploadObject.file);
        }
      });

      // If only we we're passing an observable of `ContestFile`... :'(
      // We do this in order for the `filenamesUniqueAsync` validator since
      // it requires a stream. I've tried using `Rx.of` before. Didn't work.
      this.existingContestFilesSubject$.next(
        filenames.map(name => new File([], name)),
      );
    }
  }

  /**
   * (2) Called via the `filesSubscription` when the user drops/selects a file
   * via the input field. This emits void on the parent component in order to
   * lock the save button then calls the `uploadFile` and adds the file onto the
   * upload list.
   *
   * @param file File
   */
  addFile(file: File) {
    this.onFileAdd.emit();
    this.fileUploadsSubject$.next([
      ...this.fileUploadsSubject$.value,
      this.uploadFile(file),
    ]);
  }

  /**
   * Emits the ID of the contest file to be deleted. Called when the user clicks
   * the delete (X) button on the file list for an existing contest file.
   *
   * @param file ContestFile
   */
  deleteFile(file: ContestFile) {
    this.onFileDelete.emit(file.id);
  }

  /**
   * Cancels the upload and removes the file from the upload lists. Called when
   * the user clicks the (X) button on the file list on an uploading or a newly-
   * uploaded file.
   *
   * @param file File
   */
  cancelUpload(file: File) {
    const fileUploadObject = this.fileUploadsSubject$.value.find(uploadObject =>
      this.isSameFile(uploadObject.file, file),
    );

    if (fileUploadObject && !fileUploadObject.uploadDone) {
      fileUploadObject.uploadTask.cancel();
    }

    this.removeFileFromUploadLists(file);
  }

  /**
   * (3) Uploads the file via the file-storage service to a temporary storage.
   * Whenever a file finishes/fails uploading, we set the `FileUploadObject`
   * `uploadDone` property to `true` then check all the `uploadDone` property
   * for each file on the file list. We emit the objects (`ContestFile`) if
   * all uploads are done.
   *
   * @param file File
   * @return FileUploadObject
   */
  private uploadFile(file: File): FileUploadObject {
    const uploadTask = this.fileStorage.upload(
      StorageBucket.LEGACY_CONTEST_ATTACHMENTS,
      file,
    );

    const contestFileUploadObject: FileUploadObject = {
      file,
      temporaryUploadId: undefined,
      uploadProgress$: uploadTask.percentageChanges(),
      uploadTaskEvent$: uploadTask.changes(),
      uploadDone: false,
      uploadTask,
    };

    // We also set the `temporaryUploadId` returned by the upload endpoint when
    // the file upload finishes successfully
    uploadTask
      .changes()
      .pipe(last())
      .subscribe(uploadTaskEvent => {
        contestFileUploadObject.uploadDone = true;

        if (
          uploadTaskEvent.state === 'success' &&
          uploadTaskEvent.ref.DEPREACTED_DO_NOT_USE_backendId
        ) {
          contestFileUploadObject.temporaryUploadId =
            uploadTaskEvent.ref.DEPREACTED_DO_NOT_USE_backendId;
        } else if (
          uploadTaskEvent.state === 'error' ||
          !uploadTaskEvent.ref.DEPREACTED_DO_NOT_USE_backendId
        ) {
          this.failedUploads = [...this.failedUploads, contestFileUploadObject];
        }

        // If all uploads are finished, emit the contest files
        if (
          this.fileUploadsSubject$.value.every(
            fileUploadObject => fileUploadObject.uploadDone,
          )
        ) {
          this.emitContestFiles();
        }
      });

    return contestFileUploadObject;
  }

  /**
   * Remove the file from the file lists. Called when the user cancels an
   * running/new upload or when the user starts another attempt to upload a
   * previously failed upload. Also emits the contest files if there are no
   * running uploads since we want to keep the list on the parent component
   * updated.
   *
   * @param file File
   */
  private removeFileFromUploadLists(file: File) {
    this.fileUploadsSubject$.next(
      this.fileUploadsSubject$.value.filter(
        fileUploadObject => !this.isSameFile(fileUploadObject.file, file),
      ),
    );

    this.failedUploads = this.failedUploads.filter(
      fileUploadObject => !this.isSameFile(fileUploadObject.file, file),
    );

    // Emit if there are no running uploads to keep the parent component updated
    if (
      this.fileUploadsSubject$.value.every(
        uploadObject => uploadObject.uploadDone,
      )
    ) {
      this.emitContestFiles();
    }
  }

  /**
   * (4) Emits the contest file objects to the parent component. Called when:
   * - an upload finishes and all other uploads are done uploading; or
   * - user removes/cancel a new upload and all other uploads are done uploading
   */
  private emitContestFiles() {
    const contestFiles = this.fileUploadsSubject$.value
      .filter(
        fileUploadObject =>
          fileUploadObject.uploadDone && fileUploadObject.temporaryUploadId,
      )
      .map(
        fileUploadObject =>
          ({
            name: fileUploadObject.file.name,
            contestId: this.contest.id,
            deleted: false,
            // Pass in the temporary drive file ID as the ID
            id: fileUploadObject.temporaryUploadId,
            // Dummy URL. Will be provided by the API return object
            url: '',
          } as ContestFile),
      );

    this.onUploadFinish.emit(contestFiles);
  }

  private isSameFile(f1: File, f2: File): boolean {
    return f1.name === f2.name && f1.size === f2.size;
  }

  ngOnDestroy() {
    if (this.fileSubscription) {
      this.fileSubscription.unsubscribe();
    }
  }
}

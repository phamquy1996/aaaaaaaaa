import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Datastore } from '@freelancer/datastore';
import {
  DriveFile,
  DriveFilePermission,
  DriveFilesCollection,
  User,
} from '@freelancer/datastore/collections';
import { TimeUtils } from '@freelancer/time-utils';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import { DriveFilePublicPermissionApi } from 'api-typings/drive/drive';
import * as Rx from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface UserAndPermission {
  user: User;
  permission?: DriveFilePermission;
}

@Component({
  selector: 'app-project-file-share-modal',
  template: `
    <fl-bit flTrackingSection="ProjectFileShareModal">
      <fl-heading
        i18n="Title for file share modal."
        [size]="TextSize.MID"
        [headingType]="HeadingType.H4"
        [flMarginBottom]="Margin.SMALL"
      >
        Manage File Sharing Access
      </fl-heading>
      <fl-list [bottomBorder]="true">
        <fl-list-item>
          <fl-bit class="ListItemContent">
            <fl-heading
              i18n="User list heading"
              [color]="HeadingColor.MID"
              [size]="TextSize.SMALL"
              [headingType]="HeadingType.H6"
            >
              Users
            </fl-heading>
            <fl-heading
              i18n="File access list heading"
              [color]="HeadingColor.MID"
              [size]="TextSize.SMALL"
              [headingType]="HeadingType.H6"
            >
              Access
            </fl-heading>
          </fl-bit>
        </fl-list-item>
        <fl-list-item>
          <fl-bit class="ListItemContent">
            <fl-bit class="Container">
              <fl-icon [name]="'ui-user-group'" class="PublicIcon"></fl-icon>
              <fl-text i18n="Anyone user group label" class="UserName">
                Anyone
              </fl-text>
            </fl-bit>
            <fl-bit class="Container">
              <ng-container *ngIf="!(isProcessing$ | async); else processing">
                <fl-checkbox
                  flTrackingLabel="PermissionCheckbox"
                  class="PermissionCheckBox"
                  [control]="changePublicPermission"
                ></fl-checkbox>
                <fl-text i18n="File permission for viewing file">
                  View File
                </fl-text>
              </ng-container>
              <ng-template #processing>
                <fl-spinner
                  flTrackingLabel="ProjectFileShareChangePermissionsSpinner"
                  [size]="SpinnerSize.SMALL"
                ></fl-spinner>
              </ng-template>
            </fl-bit>
          </fl-bit>
        </fl-list-item>
      </fl-list>
      <fl-list [flMarginBottom]="Margin.MID">
        <app-project-file-share-modal-user-row
          *ngIf="usersAndPermissions$ | async as users"
          [driveFileId]="file.id"
          [usersAndPermissions]="users"
          (status)="showStatusMessage($event)"
        >
        </app-project-file-share-modal-user-row>
      </fl-list>
      <fl-bit class="ButtonContainer">
        <fl-bit>
          <fl-text
            class="StatusMessage"
            *ngIf="(shareResult$ | async) === 'success'"
            [fontType]="FontType.PARAGRAPH"
            [color]="FontColor.SUCCESS"
            [size]="TextSize.XXSMALL"
            i18n="Update file successful error message."
          >
            <fl-icon
              [name]="'ui-tick'"
              [color]="IconColor.SUCCESS"
              [size]="IconSize.SMALL"
            ></fl-icon>
            Changes saved
          </fl-text>
          <fl-text
            class="StatusMessage"
            *ngIf="(shareResult$ | async) === 'error'"
            [fontType]="FontType.PARAGRAPH"
            [color]="FontColor.ERROR"
            [size]="TextSize.XXSMALL"
            i18n="Update file failed error message."
          >
            <fl-icon [name]="'ui-info-v2'" [color]="IconColor.ERROR"></fl-icon>
            Failed to update
          </fl-text>
        </fl-bit>
        <fl-button
          flTrackingLabel="SaveFileShareButton"
          i18n="Button to save changes"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.SMALL"
          (click)="handleClose()"
        >
          Done
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./project-file-share.scss'],
})
export class ProjectFileShareModalComponent implements OnInit, OnDestroy {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontType = FontType;
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  SpinnerSize = SpinnerSize;

  readonly FADE_TIME = 2_000;

  changePublicPermission = new FormControl();
  filePublicPermissionSubscription?: Rx.Subscription;

  // The file we want to share.
  @Input() file: DriveFile;

  // An array of users we want to share the file with or remove their permission.
  // The user has permission on the file if his/her permission !== undefined
  @Input() usersAndPermissions$: Rx.Observable<
    ReadonlyArray<UserAndPermission>
  >;

  private shareResultSubject$ = new Rx.BehaviorSubject<string | undefined>(
    undefined,
  );
  shareResult$ = this.shareResultSubject$.asObservable();

  private processingSubject$ = new Rx.BehaviorSubject<boolean>(false);
  isProcessing$ = this.processingSubject$.asObservable();

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<ProjectFileShareModalComponent>,
    private timeUtils: TimeUtils,
  ) {}

  handleClose() {
    this.modalRef.close();
  }

  ngOnInit() {
    this.changePublicPermission.setValue(
      this.isFilePublic(this.file.publicPermission),
    );

    const fileListCollection = this.datastore.collection<DriveFilesCollection>(
      'driveFiles',
      query =>
        query
          .where('contextType', '==', this.file.contextType)
          .where('contextId', '==', this.file.contextId),
    );

    this.filePublicPermissionSubscription = this.changePublicPermission.valueChanges
      .pipe(
        tap(() => {
          this.processingSubject$.next(true);
        }),
        switchMap((setPublic: boolean) => {
          const publicPermission = setPublic
            ? DriveFilePublicPermissionApi.PUBLIC_READ_LOGGED_IN
            : DriveFilePublicPermissionApi.PRIVATE;

          return fileListCollection.update(this.file.id, { publicPermission });
        }),
      )
      .subscribe(response => {
        this.showStatusMessage(response.status);
      });
  }

  isFilePublic(publicPermission: DriveFilePublicPermissionApi) {
    return (
      publicPermission === DriveFilePublicPermissionApi.PUBLIC_READ ||
      publicPermission === DriveFilePublicPermissionApi.PUBLIC_READ_LOGGED_IN
    );
  }

  showStatusMessage(status: string) {
    this.shareResultSubject$.next(status);
    this.processingSubject$.next(false);

    this.timeUtils.setTimeout(() => {
      this.shareResultSubject$.next(undefined);
    }, this.FADE_TIME);
  }

  ngOnDestroy() {
    if (this.filePublicPermissionSubscription) {
      this.filePublicPermissionSubscription.unsubscribe();
    }
  }
}

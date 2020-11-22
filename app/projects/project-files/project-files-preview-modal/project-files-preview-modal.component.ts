import { Component, Input, OnInit } from '@angular/core';
import { DriveFile } from '@freelancer/datastore/collections';
import { FileReference, StorageBucket } from '@freelancer/file-storage';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { DriveFileTypeApi } from 'api-typings/drive/drive';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-files-preview-modal',
  template: `
    <ng-container *ngIf="currentFile$ | async as file">
      <fl-heading
        class="ProjectFileHeading"
        [headingType]="HeadingType.H1"
        [weight]="HeadingWeight.NORMAL"
        [size]="TextSize.LARGE"
        [flMarginBottom]="Margin.SMALL"
      >
        {{ file.displayName }}
      </fl-heading>
      <app-project-files-preview
        [file]="currentFile$ | async"
      ></app-project-files-preview>
      <fl-bit flTrackingSection="ImagePreview">
        <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
          <fl-col class="FooterNavigationContainer" [col]="4" [pull]="'right'">
            <app-project-files-preview-navigation
              flTrackingSection="ProjectFilePreviewModal"
              *ngIf="(files$ | async) && (files$ | async)?.length > 1"
              [initial]="index$ | async"
              [count]="fileCount$ | async"
              (navigate)="index$.next($event)"
            ></app-project-files-preview-navigation>
          </fl-col>
          <fl-col [col]="4" class="FooterDownloadContaier">
            <fl-file-download
              *ngIf="showDownloadButton$ | async"
              [fileReference]="fileReference$ | async"
              [fileName]="file.displayName"
            ></fl-file-download>
          </fl-col>
        </fl-grid>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./project-files-preview-modal.component.scss'],
})
export class ProjectFilesPreviewModalComponent implements OnInit {
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;
  VerticalAlignment = VerticalAlignment;

  @Input() files$: Rx.Observable<ReadonlyArray<DriveFile>>;
  @Input() index: number;

  index$: Rx.Subject<number>;
  currentFile$: Rx.Observable<DriveFile>;
  fileReference$: Rx.Observable<FileReference>;
  fileCount$: Rx.Observable<number>;
  showDownloadButton$: Rx.Observable<boolean>;

  ngOnInit() {
    this.index$ = new Rx.BehaviorSubject<number>(this.index);
    this.fileCount$ = this.files$.pipe(map(files => files.length));
    this.currentFile$ = Rx.combineLatest([this.files$, this.index$]).pipe(
      map(([files, index]) => files[index]),
    );

    this.showDownloadButton$ = this.currentFile$.pipe(
      map(
        driveFile =>
          driveFile.fileType === DriveFileTypeApi.IMAGE ||
          driveFile.fileType === DriveFileTypeApi.VIDEO,
      ),
    );

    this.fileReference$ = this.currentFile$.pipe(
      map(driveFile => ({
        bucket: StorageBucket.FL_DRIVE,
        id: driveFile.id.toString(),
      })),
    );
  }
}

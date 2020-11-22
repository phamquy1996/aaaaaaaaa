import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { DriveFile } from '@freelancer/datastore/collections';
import {
  FileReference,
  FileStorage,
  StorageBucket,
} from '@freelancer/file-storage';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-project-files-preview',
  template: `
    <fl-bit *ngIf="file">
      <fl-bit
        class="ContentContainer"
        *ngIf="fileUrl | async as fileUrl; else loading"
        [ngSwitch]="file.fileType"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-picture
          class="ImagePreview"
          *ngSwitchCase="'image'"
          [src]="fileUrl"
          [alt]="file?.displayName"
          [externalSrc]="true"
          [boundedWidth]="true"
        ></fl-picture>
        <fl-video class="VideoPreview" *ngSwitchCase="'video'" [src]="fileUrl">
        </fl-video>
        <fl-bit
          class="DefaultPreview"
          *ngSwitchDefault
          flTrackingSection="UnsupportedFilePreview"
        >
          <fl-heading
            i18n="File Preview: Unsupported File Text"
            [headingType]="HeadingType.H2"
            [size]="TextSize.MID"
            [weight]="HeadingWeight.NORMAL"
            [flMarginBottom]="Margin.XSMALL"
          >
            No Preview Available
          </fl-heading>
          <fl-file-download
            [fileReference]="fileReference"
            [fileName]="file.displayName"
          ></fl-file-download>
        </fl-bit>
      </fl-bit>
    </fl-bit>
    <fl-bit class="NoPreview" *ngIf="!file">
      <fl-heading
        i18n="File Preview: No Files Text"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [weight]="HeadingWeight.NORMAL"
        [flMarginBottom]="Margin.XSMALL"
      >
        No Preview Available
      </fl-heading>
    </fl-bit>
    <ng-template #loading
      ><fl-spinner
        flTrackingLabel="ProjectFilePreviewModalInitialisationSpinner"
        [overlay]="true"
      ></fl-spinner
    ></ng-template>
  `,
  styleUrls: ['./project-files-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// FIXME: this is an awful duplicate of the `@freelancer/file-storage` file
// preview component that needs to be removed (yes, by you).
export class ProjectFilesPreviewComponent implements OnChanges {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;

  @Input() file: DriveFile;

  fileUrl: Promise<string | undefined>;
  fileReference: FileReference;

  constructor(private fileStorage: FileStorage) {}

  ngOnChanges() {
    this.fileUrl = this.fileStorage
      .getDownloadURL(StorageBucket.FL_DRIVE, this.file.id.toString())
      .then(r => {
        // TODO: Handle error state
        if (r.status === 'success') {
          return r.downloadURL;
        }
      });
    this.fileReference = {
      bucket: StorageBucket.FL_DRIVE,
      id: this.file.id.toString(),
    };
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ContestAttachmentFileType,
  ContestFile,
} from '@freelancer/datastore/collections';
import { FileDownload } from '@freelancer/file-download';
import { ButtonColor } from '@freelancer/ui/button';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { HeadingType, HeadingWeight } from '@freelancer/ui/heading';
import { HoverColor, IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-contest-file-preview-modal',
  template: `
    <ng-container
      *ngIf="file$ | async as file; else loading"
      flTrackingSection="ContestViewPage.FilePreviewModal"
    >
      <fl-heading
        class="Heading"
        [headingType]="HeadingType.H1"
        [weight]="HeadingWeight.NORMAL"
        [size]="TextSize.LARGE"
        [flMarginBottom]="Margin.SMALL"
      >
        {{ file.name }}
      </fl-heading>
      <fl-bit
        class="ContentContainer"
        [ngSwitch]="file.fileType"
        [flMarginBottom]="Margin.SMALL"
      >
        <!-- FIXME: remove after T81325 is done -->
        <ng-container *ngSwitchCase="ContestAttachmentFileType.IMAGE">
          <ng-container *ngFor="let _file of files">
            <fl-picture
              *ngIf="_file.id === file.id"
              class="ImagePreview"
              [src]="file.url"
              [alt]="file.name"
              [alignCenter]="true"
              [externalSrc]="true"
              [boundedWidth]="true"
            ></fl-picture>
          </ng-container>
        </ng-container>
        <!-- FIXME: remove after T81325 is done -->
        <ng-container *ngSwitchCase="ContestAttachmentFileType.VIDEO">
          <ng-container *ngFor="let _file of files">
            <fl-video
              *ngIf="_file.id === file.id"
              class="VideoPreview"
              [src]="file.url"
            ></fl-video>
          </ng-container>
        </ng-container>
        <fl-bit class="DefaultPreview" *ngSwitchDefault>
          <fl-heading
            i18n="File Preview: Unsupported File Text"
            [headingType]="HeadingType.H2"
            [size]="TextSize.MID"
            [weight]="HeadingWeight.NORMAL"
            [flMarginBottom]="Margin.XSMALL"
          >
            No Preview Available
          </fl-heading>
          <fl-button
            i18n="Download File Button"
            flTrackingLabel="DownloadFile"
            flTrackingReferenceType="file_id"
            flTrackingReferenceId="{{ file.id }}"
            [color]="ButtonColor.TRANSPARENT_DARK"
            (click)="downloadFile(file.url, file.name)"
          >
            Download
          </fl-button>
        </fl-bit>
      </fl-bit>
      <fl-grid [vAlign]="VerticalAlignment.VERTICAL_CENTER">
        <fl-col class="FooterColumn" [col]="4" [pull]="'right'">
          <ng-template #navigation let-index="index">
            <fl-bit class="FileIndex">
              <fl-icon
                flTrackingLabel="PreviousFileLink"
                [ngClass]="{ IsHidden: index === 0 }"
                [name]="'ui-arrow-left-alt'"
                [color]="IconColor.DARK"
                [hoverColor]="HoverColor.PRIMARY"
                (click)="nextFile(index - 1)"
              ></fl-icon>
              {{ index + 1 }} / {{ files.length }}
              <fl-icon
                flTrackingLabel="NextFileLink"
                [ngClass]="{ IsHidden: index + 1 === files.length }"
                [name]="'ui-arrow-right-alt'"
                [color]="IconColor.DARK"
                [hoverColor]="HoverColor.PRIMARY"
                (click)="nextFile(index + 1)"
              ></fl-icon>
            </fl-bit>
          </ng-template>
          <ng-container
            *ngTemplateOutlet="navigation; context: { index: index$ | async }"
          ></ng-container>
        </fl-col>
        <fl-col class="FooterDownloadContainer" [col]="4">
          <fl-button
            *ngIf="showDownloadButton$ | async"
            i18n="Download File Button"
            flTrackingLabel="DownloadFile"
            flTrackingReferenceType="file_id"
            flTrackingReferenceId="{{ file.id }}"
            [color]="ButtonColor.TRANSPARENT_DARK"
            (click)="downloadFile(file.url, file.name)"
          >
            Download
          </fl-button>
        </fl-col>
      </fl-grid>
    </ng-container>
    <ng-template #loading>
      <fl-spinner
        flTrackingLabel="ContestFilePreviewModalSpinner"
        [overlay]="true"
      ></fl-spinner>
    </ng-template>
  `,
  styleUrls: [`./contest-file-preview-modal.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestFilePreviewModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  HoverColor = HoverColor;
  IconColor = IconColor;
  Margin = Margin;
  VerticalAlignment = VerticalAlignment;

  ContestAttachmentFileType = ContestAttachmentFileType;

  @Input() files: ReadonlyArray<ContestFile>;
  @Input() selectedFileIndex: number;

  file$: Rx.Observable<Readonly<ContestFile>>;
  index$: Rx.Observable<number>;
  showDownloadButton$: Rx.Observable<boolean>;
  private indexSubject$: Rx.BehaviorSubject<number>;

  constructor(private fileDownload: FileDownload) {}

  ngOnInit() {
    this.indexSubject$ = new Rx.BehaviorSubject<number>(this.selectedFileIndex);
    this.index$ = this.indexSubject$.asObservable();
    this.file$ = this.index$.pipe(map(index => this.files[index]));
    this.showDownloadButton$ = this.file$.pipe(
      map(file => file.fileType),
      map(
        fileType =>
          fileType === ContestAttachmentFileType.IMAGE ||
          fileType === ContestAttachmentFileType.VIDEO,
      ),
      startWith(false),
    );
  }

  downloadFile(fileUrl: string, fileName: string) {
    this.fileDownload.download(fileUrl, fileName);
  }

  nextFile(page: number) {
    this.indexSubject$.next(page);
  }
}

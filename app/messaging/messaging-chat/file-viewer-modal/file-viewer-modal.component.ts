import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileDownload } from '@freelancer/file-download';
import { FileType } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { FontWeight, TextAlign } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit flTrackingSection="messaging_image_viewer">
      <fl-bit class="MainContent" [ngSwitch]="filetype">
        <fl-picture
          class="FilePreview"
          *ngSwitchCase="FileType.IMAGE"
          [alt]="filename"
          [src]="filepath"
          [externalSrc]="true"
          [boundedWidth]="true"
          [alignCenter]="true"
        ></fl-picture>
        <fl-video
          class="FilePreview"
          *ngSwitchCase="FileType.VIDEO"
          [src]="filepath"
        ></fl-video>
        <fl-bit
          class="NoPreview"
          flTrackingSubSection="file_content"
          *ngSwitchDefault
        >
          <fl-picture
            i18n-alt="File unsupported alt text"
            alt="File Unsupported"
            [src]="'messaging/image-placeholder.svg'"
          ></fl-picture>
          <fl-text
            i18n="File unsupported message"
            [textAlign]="TextAlign.CENTER"
            [weight]="FontWeight.BOLD"
          >
            This file cannot be previewed
          </fl-text>
          <fl-text
            class="Filename"
            i18n="Filename and download link label"
            [textAlign]="TextAlign.CENTER"
          >
            {{ filename }}
            <fl-link
              flTrackingLabel="download_image_unsupported"
              (click)="downloadFile()"
            >
              Download
            </fl-link>
          </fl-text>
        </fl-bit>
      </fl-bit>
      <fl-bit class="Footer" flTrackingSubSection="footer">
        <fl-text class="Filename">
          {{ filename }}
        </fl-text>
        <fl-button
          class="DownloadButton"
          i18n="Download button label"
          flTrackingLabel="download_image"
          [color]="ButtonColor.DEFAULT"
          [size]="ButtonSize.MINI"
          (click)="downloadFile()"
        >
          Download
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./file-viewer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileViewerModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FileType = FileType;
  FontWeight = FontWeight;
  TextAlign = TextAlign;

  @Input() filepath: string;
  @Input() filename: string;
  @Input() filetype: FileType;

  constructor(private fileDownload: FileDownload) {}

  downloadFile() {
    this.fileDownload.download(this.filepath, this.filename);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileDownload } from '@freelancer/file-download';
import { ButtonColor } from '@freelancer/ui/button';
import { FileReference } from '../file-storage.model';
import { FileStorage } from '../file-storage.service';

@Component({
  selector: 'fl-file-download',
  template: `
    <fl-button
      i18n="Download File Button"
      flTrackingLabel="FileDownload"
      [color]="ButtonColor.TRANSPARENT_DARK"
      (click)="onDownload()"
    >
      Download
    </fl-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDownloadComponent {
  ButtonColor = ButtonColor;

  @Input() fileReference: FileReference;
  @Input() fileName: string;

  constructor(
    private fileStorage: FileStorage,
    private fileDownload: FileDownload,
  ) {}

  onDownload() {
    this.fileStorage
      .getDownloadURL(this.fileReference.bucket, this.fileReference.id)
      .then(r => {
        // TODO: Handle error state
        if (r.status === 'success') {
          this.fileDownload.download(r.downloadURL, this.fileName);
        }
      });
  }
}

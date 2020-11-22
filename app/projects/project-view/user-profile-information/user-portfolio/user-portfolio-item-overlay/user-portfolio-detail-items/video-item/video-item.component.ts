import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PortfolioItem } from '@freelancer/datastore/collections';
import { FileDownload } from '@freelancer/file-download';
import { VideoFileType } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-video-item',
  template: `
    <fl-bit class="VideoItem">
      <fl-bit
        *ngFor="let videoItem of portfolioItem.files"
        class="VideoItem-content"
      >
        <ng-container
          *ngIf="isValidFileType(videoItem.filename); else invalidFileType"
        >
          <fl-video
            [src]="videoItem.cdnUrl"
            [flMarginBottom]="Margin.MID"
          ></fl-video>
        </ng-container>

        <ng-template #invalidFileType>
          <fl-banner-alert
            bannerTitle="Video playback is not supported for this file format."
            i18n-bannerTitle="Invalid file format title"
            [closeable]="false"
            [type]="BannerAlertType.WARNING"
            [flMarginBottom]="Margin.MID"
          >
            <fl-text [flMarginBottom]="Margin.XSMALL">
              {{ videoItem.filename }}
            </fl-text>

            <fl-button
              flTrackingLabel="DownloadFile"
              i18n="Download file button"
              [color]="ButtonColor.DEFAULT"
              [size]="ButtonSize.SMALL"
              (click)="downloadFile(videoItem.cdnUrl, videoItem.filename)"
            >
              Download
            </fl-button>
          </fl-banner-alert>
        </ng-template>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./video-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoItemComponent {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  HeadingColor = HeadingColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;
  IconSize = IconSize;

  @Input() portfolioItem: PortfolioItem;

  constructor(private fileDownload: FileDownload) {}

  isValidFileType(filename: string): filename is VideoFileType {
    const fileType = filename.split('.').pop();
    // FIXME: https://phabricator.tools.flnltd.com/T136805#2339368
    // this needs any because the types might not match (since this is a guard)
    return fileType
      ? Object.values(VideoFileType).includes(fileType as any)
      : false;
  }

  downloadFile(fileUrl: string, fileName: string) {
    this.fileDownload.download(fileUrl, fileName);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileDownload } from '@freelancer/file-download';
import { FileType } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { FontWeight } from '@freelancer/ui/text';

export interface MessageAttachment {
  name: string;
  path: string;
  messageId: number;
  type: FileType;
}

@Component({
  selector: 'app-messaging-attachment-modal',
  template: `
    <fl-bit class="MessageAttachment" [ngSwitch]="attachment.type">
      <fl-picture
        *ngSwitchCase="FileType.IMAGE"
        [alt]="attachment.name"
        [src]="attachment.path"
        [externalSrc]="true"
        [boundedWidth]="true"
        [alignCenter]="true"
      ></fl-picture>
      <fl-video
        class="MessageAttachment-video"
        *ngSwitchCase="FileType.VIDEO"
        [src]="attachment.path"
      ></fl-video>
      <ng-container *ngSwitchDefault>
        <fl-picture
          i18n-alt="File unsupported alt text"
          alt="File Unsupported"
          [src]="'messaging/image-placeholder.svg'"
        ></fl-picture>
        <fl-text i18n="File unsupported message" [weight]="FontWeight.BOLD">
          This file cannot be previewed
        </fl-text>
      </ng-container>
    </fl-bit>
    <fl-bit
      flTrackingSection="MessageAttachmentModal"
      class="MessageAttachment-footer"
    >
      <fl-text>{{ attachment.name | truncateFilename: 200 }}</fl-text>
      <fl-button
        i18n="Download text"
        flTrackingLabel="DownloadMessageAttachment"
        [color]="ButtonColor.DEFAULT"
        (click)="downloadAttachment()"
      >
        Download
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./messaging-attachment-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingAttachmentModalComponent {
  ButtonColor = ButtonColor;
  FontWeight = FontWeight;

  FileType = FileType;

  @Input() attachment: MessageAttachment;

  constructor(private fileDownload: FileDownload) {}

  downloadAttachment() {
    this.fileDownload.download(this.attachment.path, this.attachment.name);
  }
}

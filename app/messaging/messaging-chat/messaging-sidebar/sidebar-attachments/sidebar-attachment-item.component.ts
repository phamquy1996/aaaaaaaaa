import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MessageAttachment } from '@freelancer/datastore/collections';
import { getFileExtension, isImageFile } from '@freelancer/ui';
import { FileDisplaySize } from '@freelancer/ui/file-display';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import {
  getAttachmentPath,
  getAttachmentThumbnail,
  ImageAttachmentThumbnailHeight,
  ImageAttachmentThumbnailWidth,
} from '../../message-attachment/attachment-helpers';

@Component({
  selector: 'app-sidebar-attachment-item',
  template: `
    <fl-bit class="SidebarAttachment">
      <ng-container
        *ngTemplateOutlet="
          isImageFile && !isGifFile && useThumbnailService
            ? imageThumbnail
            : fileDisplay
        "
      >
      </ng-container>
      <fl-bit class="SidebarAttachment-details">
        <fl-text [size]="TextSize.XSMALL">
          <fl-bit class="SidebarAttachment-fileName">{{ filename }}</fl-bit>
        </fl-text>
        <fl-text
          [size]="TextSize.XXSMALL"
          [color]="FontColor.MID"
          i18n="Messaging inbox file attachment label"
        >
          Uploaded {{ date | date }}
        </fl-text>
      </fl-bit>
    </fl-bit>
    <ng-template #imageThumbnail>
      <fl-picture
        class="SidebarAttachment-icon"
        [src]="imageThumbnailPath"
        [boundedWidth]="true"
        [alt]="filename"
        [externalSrc]="true"
        [flMarginRight]="Margin.XXSMALL"
      ></fl-picture>
    </ng-template>
    <ng-template #fileDisplay>
      <fl-file-display
        class="SidebarAttachment-icon"
        [src]="path"
        [alt]="filename"
        [size]="FileDisplaySize.SMALL"
        [flMarginRight]="Margin.XXSMALL"
      ></fl-file-display>
    </ng-template>
  `,
  styleUrls: ['./sidebar-attachment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarAttachmentItemComponent {
  Margin = Margin;
  FileDisplaySize = FileDisplaySize;
  FontColor = FontColor;
  TextSize = TextSize;
  ImageAttachmentThumbnailHeight = ImageAttachmentThumbnailHeight;
  ImageAttachmentThumbnailWidth = ImageAttachmentThumbnailWidth;

  @Input()
  set attachment(attachment: MessageAttachment) {
    this.filename = attachment.filename;
    this.path = getAttachmentPath(attachment.messageId, attachment.filename);
    this.date = new Date(attachment.timeCreated);
    this.isImageFile = isImageFile(this.filename);
    this.imageThumbnailPath = getAttachmentThumbnail(
      attachment.messageId,
      attachment.filename,
      {
        height: ImageAttachmentThumbnailHeight.ATTACHMENT_SIDEBAR,
        width: ImageAttachmentThumbnailWidth.ATTACHMENT_SIDEBAR,
      },
    );
    this.isGifFile = getFileExtension(attachment.filename) === 'gif';
  }
  // TODO: remove once we release thumbnail support to all users (T88919)
  @Input() useThumbnailService = false;

  filename: string;
  path: string;
  imageThumbnailPath: string;
  date: Date;
  isImageFile: boolean;
  isGifFile: boolean;
}

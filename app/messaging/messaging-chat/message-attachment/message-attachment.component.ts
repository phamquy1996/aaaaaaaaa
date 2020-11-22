import { Component, Input, OnInit } from '@angular/core';
import { FileDownload } from '@freelancer/file-download';
import { Tracking } from '@freelancer/tracking';
import {
  getFileExtension,
  getFileType,
  isImageFile,
  ModalService,
} from '@freelancer/ui';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { ModalSize } from '@freelancer/ui/modal';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { UserAgent } from '@freelancer/user-agent';
import { FileViewerModalComponent } from '../file-viewer-modal/file-viewer-modal.component';
import {
  getAttachmentPath,
  getAttachmentThumbnail,
  ImageAttachmentThumbnailHeight,
  ImageAttachmentThumbnailWidth,
} from './attachment-helpers';

@Component({
  selector: 'app-message-attachment',
  template: `
    <ng-container
      [flTrackingSection]="trackingSection"
      flTrackingSubSection="message_content"
      *ngIf="isImage"
    >
      <fl-button
        class="AttachmentContainer"
        flTrackingLabel="open_image_viewer"
        [flMarginBottom]="Margin.XXXSMALL"
        (click)="openPreviewModal()"
      >
        <fl-picture
          data-uitest-target="chatbox-image-thumbnail"
          class="AttachmentImage"
          [src]="
            useThumbnailService && !isGifFile
              ? imageThumbnailPath
              : attachmentPath
          "
          [externalSrc]="true"
          [boundedWidth]="true"
          [alt]="attachment"
          [objectFit]="PictureObjectFit.COVER"
        ></fl-picture>
      </fl-button>
      <fl-link
        class="AttachmentFile-name"
        flTrackingLabel="open_image_viewer"
        data-uitest-target="chatbox-imagefile-link"
        [color]="fromMe ? LinkColor.LIGHT : LinkColor.DEFAULT"
        [hoverColor]="fromMe ? LinkHoverColor.LIGHT : LinkHoverColor.DEFAULT"
        (click)="openPreviewModal()"
      >
        {{ attachment }}
      </fl-link>
    </ng-container>

    <ng-container *ngIf="!isImage">
      <fl-button
        flTrackingLabel="open_image_viewer"
        [display]="'block'"
        (click)="openPreviewModal()"
      >
        <fl-bit class="AttachmentFile">
          <fl-icon
            class="AttachmentFile-icon"
            [color]="IconColor.MID"
            [size]="IconSize.SMALL"
            [hoverColor]="HoverColor.PRIMARY"
            [name]="'ui-file'"
            i18n-label="Chatbox attachments label"
            label="Download the attachment"
          ></fl-icon>
        </fl-bit>
        <fl-link
          class="AttachmentFile-name"
          flTrackingLabel="open_image_viewer"
          data-uitest-target="chatbox-file-link"
          [color]="fromMe ? LinkColor.LIGHT : LinkColor.DEFAULT"
          [hoverColor]="fromMe ? LinkHoverColor.LIGHT : LinkHoverColor.DEFAULT"
          (click)="openPreviewModal()"
        >
          {{ attachment }}
        </fl-link>
      </fl-button>
    </ng-container>
  `,
  styleUrls: ['./message-attachment.component.scss'],
})
export class MessageAttachmentComponent implements OnInit {
  Margin = Margin;
  IconColor = IconColor;
  IconSize = IconSize;
  ImageAttachmentThumbnailHeight = ImageAttachmentThumbnailHeight;
  ImageAttachmentThumbnailWidth = ImageAttachmentThumbnailWidth;
  HoverColor = HoverColor;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  PictureObjectFit = PictureObjectFit;
  ModalSize = ModalSize;

  @Input() attachment: string;
  @Input() messageId: number;
  @Input() fromMe: boolean;
  @Input() chatBoxMode = true;
  // TODO: remove this input once we release thumbnail support to all users (T88919)
  @Input() useThumbnailService = false;

  attachmentPath: string;
  imageThumbnailPath: string;
  isImage = false;
  isGifFile: boolean;
  trackingSection: string;

  constructor(
    private modalService: ModalService,
    private tracking: Tracking,
    private fileDownload: FileDownload,
    private userAgent: UserAgent,
  ) {}

  ngOnInit() {
    this.isImage = isImageFile(this.attachment);
    this.attachmentPath = getAttachmentPath(this.messageId, this.attachment);
    this.trackingSection = this.chatBoxMode ? 'chatbox' : 'inbox';
    this.imageThumbnailPath = getAttachmentThumbnail(
      this.messageId,
      this.attachment,
      {
        height: ImageAttachmentThumbnailHeight.CHAT_MESSAGE,
        width: ImageAttachmentThumbnailWidth.CHAT_MESSAGE,
        method: 'fit',
      },
    );
    this.isGifFile = getFileExtension(this.attachment) === 'gif';
  }

  /**
   * Open preview of message attachment
   *
   * @remark
   *
   * If the file is being previewed by IE or Edge browser, the file will just
   * download instead of previewing
   *
   * @privateRemark
   *
   * FileViewerModal in IE/Edge needs change in css to look good
   *
   * TODO: Remove condition when css is fixed
   *
   * TODO: Test on latest version of Edge to see if the preview modal now works
   * or not. If it does work, change to `this.userAgent.isBrowserIE()`.
   */
  openPreviewModal() {
    const specialBrowsers = ['IE', 'Edge'];
    const isIEOrEdge = specialBrowsers.includes(
      this.userAgent.getUserAgent().getBrowser().name || '',
    );
    if (isIEOrEdge) {
      this.fileDownload.download(this.attachmentPath, this.attachment);
      return;
    }

    const previewModal = this.modalService.open(FileViewerModalComponent, {
      inputs: {
        filepath: this.attachmentPath,
        filename: this.attachment,
        filetype: getFileType(this.attachment),
      },
      edgeToEdge: true,
      size: ModalSize.XLARGE,
    });

    previewModal
      .afterClosed()
      .toPromise()
      .then(() => {
        this.tracking.track('user_action', {
          section: 'messaging_image_viewer',
          subsection: 'header',
          label: 'close_image_viewer',
        });
      });
  }
}

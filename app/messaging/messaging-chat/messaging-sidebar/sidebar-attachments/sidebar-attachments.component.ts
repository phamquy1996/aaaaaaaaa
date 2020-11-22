import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MessageAttachment } from '@freelancer/datastore/collections';
import { FileDownload } from '@freelancer/file-download';
import { Tracking } from '@freelancer/tracking';
import { getFileType, ModalService } from '@freelancer/ui';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { ModalSize } from '@freelancer/ui/modal';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { UserAgent } from '@freelancer/user-agent';
import { FileViewerModalComponent } from '../../file-viewer-modal/file-viewer-modal.component';
import { getAttachmentPath } from '../../message-attachment/attachment-helpers';

@Component({
  selector: 'app-sidebar-attachments',
  template: `
    <fl-list
      [clickable]="true"
      [padding]="ListItemPadding.XXSMALL"
      [type]="ListItemType.NON_BORDERED"
    >
      <fl-list-item
        *ngFor="let attachment of attachments; trackBy: identifyAttachment"
        flTrackingLabel="open_image_viewer"
        flTrackingReferenceType="thread_id"
        flTrackingReferenceId="{{ attachment.threadId }}"
        (click)="openPreviewModal(attachment)"
      >
        <app-sidebar-attachment-item
          [attachment]="attachment"
          [useThumbnailService]="useThumbnailService"
        ></app-sidebar-attachment-item>
      </fl-list-item>
    </fl-list>
  `,
  styleUrls: ['./sidebar-attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarAttachmentsComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  ModalSize = ModalSize;

  @Input() attachments: ReadonlyArray<MessageAttachment>;
  // TODO: remove once we release thumbnail support to all users (T88919)
  @Input() useThumbnailService = false;

  constructor(
    private modalService: ModalService,
    private tracking: Tracking,
    private fileDownload: FileDownload,
    private userAgent: UserAgent,
  ) {}

  attachmentPath(attachment: MessageAttachment) {
    return getAttachmentPath(attachment.messageId, attachment.filename);
  }

  identifyAttachment(index: number, attachment: MessageAttachment) {
    return attachment.id;
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
  openPreviewModal(attachment: MessageAttachment) {
    const specialBrowsers = ['IE', 'Edge'];
    const isIEOrEdge = specialBrowsers.includes(
      this.userAgent.getUserAgent().getBrowser().name || '',
    );
    if (isIEOrEdge) {
      this.fileDownload.download(
        this.attachmentPath(attachment),
        attachment.filename,
      );
      return;
    }

    const previewModal = this.modalService.open(FileViewerModalComponent, {
      inputs: {
        filepath: this.attachmentPath(attachment),
        filename: attachment.filename,
        filetype: getFileType(attachment.filename),
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

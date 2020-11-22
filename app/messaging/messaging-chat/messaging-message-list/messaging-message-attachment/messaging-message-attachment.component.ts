import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FileType, getFileType } from '@freelancer/ui';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { HighlightColor } from '@freelancer/ui/text';
import { MessageAttachment } from '../../messaging-attachment-modal/messaging-attachment-modal.component';

@Component({
  selector: 'app-messaging-message-attachment',
  template: `
    <!-- TODO: Handle other file types -->
    <fl-button
      *ngIf="fileType === FileType.IMAGE"
      class="Attachment"
      flTrackingLabel="ViewThumbnail"
      [display]="'block'"
      [flMarginBottom]="Margin.XXXSMALL"
      (click)="handleViewAttachment()"
    >
      <fl-picture
        class="AttachmentPicture"
        [src]="path"
        [alt]="attachment"
        [externalSrc]="true"
        [boundedWidth]="true"
        [objectFit]="PictureObjectFit.COVER"
      ></fl-picture>
    </fl-button>
    <fl-link
      flTrackingLabel="OpenFileAttachment"
      [highlightColor]="HighlightColor.BLUE"
      (click)="handleViewAttachment()"
    >
      {{ attachment }}
    </fl-link>
  `,
  styleUrls: ['./messaging-message-attachment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingMessageAttachmentComponent implements OnChanges {
  HighlightColor = HighlightColor;
  Margin = Margin;
  PictureObjectFit = PictureObjectFit;

  FileType = FileType;

  @Input() attachment: string;
  @Input() messageId: number;
  @Output() viewAttachment = new EventEmitter<MessageAttachment>();

  path: string;
  fileType: FileType;

  ngOnChanges(changes: SimpleChanges) {
    if ('attachment' in changes) {
      this.fileType = getFileType(this.attachment);
    }

    if ('attachment' in changes || 'messageId' in changes) {
      this.path = this.getAttachmentPath(this.messageId, this.attachment);
    }
  }

  // FIXME: We're not using freelancerHttp.getBaseServiceUrl here because of domains
  // getBaseServiceUrl returns the url for the .com domain, which we redirect to.
  // If you are cookie-authed into a non-.com domain, the auth won't work on redirect.
  getAttachmentPath(messageId: number, filename: string): string {
    return `/api/messages/0.1/messages/${messageId}/${encodeURIComponent(
      filename,
    )}`;
  }

  handleViewAttachment() {
    this.viewAttachment.emit({
      name: this.attachment,
      messageId: this.messageId,
      path: this.path,
      type: this.fileType,
    });
  }
}

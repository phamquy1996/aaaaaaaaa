import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Thread } from '@freelancer/datastore/collections';
import { UploadStatus } from '@freelancer/file-upload-legacy';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { FontType } from '@freelancer/ui/text';

@Component({
  selector: 'app-attachment-list',
  template: `
    <perfect-scrollbar class="AttachmentList">
      <ng-container *ngIf="attachments">
        <fl-bit
          class="AttachmentItem"
          *ngFor="let attachment of attachments; trackBy: identifyAttachment"
        >
          <fl-icon
            name="ui-file"
            [color]="IconColor.MID"
            [size]="IconSize.SMALL"
            [hoverColor]="HoverColor.PRIMARY"
          ></fl-icon>
          <fl-bit class="AttachmentItem-filename">
            {{ attachment.name }}
          </fl-bit>
          <fl-bit class="AttachmentItem-details">
            <fl-text class="AttachmentItem-filesize" [fontType]="FontType.SPAN">
              {{ attachment.size | fileSize }}
            </fl-text>
            <fl-button
              class="AttachmentItem-close"
              flTrackingLabel="removeAttachment"
              (click)="handleRemoveAttachment(attachment)"
            >
              <fl-icon
                name="ui-close"
                i18n-label="Chatbox attachment list button label"
                label="Remove File"
                [color]="IconColor.MID"
                [size]="IconSize.SMALL"
                [hoverColor]="HoverColor.PRIMARY"
              ></fl-icon>
            </fl-button>
          </fl-bit>
        </fl-bit>
      </ng-container>
      <ng-container *ngIf="uploads">
        <app-attachment-upload
          *ngFor="let upload of uploads"
          [id]="upload.id"
          [progress]="upload.progress$ | async"
          [filename]="upload.filename"
          [failed]="upload.failed"
          (removeFailedUpload)="removeFailedUpload($event)"
        ></app-attachment-upload>
      </ng-container>
    </perfect-scrollbar>
  `,
  styleUrls: ['./attachment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentListComponent {
  FontType = FontType;
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;
  @Input() thread: Thread;
  @Input() attachments: ReadonlyArray<File>;
  @Input() uploads: ReadonlyArray<UploadStatus>;
  @Output() removeAttachment = new EventEmitter<File>();
  @Output() removeUpload = new EventEmitter<string>();

  removeFailedUpload(uploadId: string) {
    this.removeUpload.emit(uploadId);
  }

  handleRemoveAttachment(attachment: File): void {
    this.removeAttachment.emit(attachment);
  }

  identifyAttachment(index: number, attachment: File) {
    return attachment.name;
  }
}

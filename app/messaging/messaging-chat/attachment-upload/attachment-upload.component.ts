import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UploadProgressEvent } from '@freelancer/file-upload-legacy';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { FontType } from '@freelancer/ui/text';

@Component({
  selector: 'app-attachment-upload',
  template: `
    <fl-icon
      name="ui-file"
      [color]="IconColor.MID"
      [size]="IconSize.SMALL"
      [hoverColor]="HoverColor.PRIMARY"
    ></fl-icon>
    <fl-text class="TextLabel" [fontType]="FontType.SPAN">
      {{ filename }}
    </fl-text>
    <fl-bit *ngIf="!failed" class="ProgressBarContainer">
      <fl-bit class="ProgressBar" [style.width]="progressBarWidth"></fl-bit>
    </fl-bit>
    <fl-button
      *ngIf="failed"
      flTrackingLabel="removeAttachment"
      (click)="removeAttachment()"
    >
      <fl-icon
        name="ui-close"
        i18n-label="Chatbox attachment upload icon"
        label="Failed, please re-attach"
        [color]="IconColor.MID"
        [size]="IconSize.SMALL"
        [hoverColor]="HoverColor.PRIMARY"
      ></fl-icon>
    </fl-button>
  `,
  styleUrls: ['./attachment-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentUploadComponent implements OnChanges {
  FontType = FontType;
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;

  @Input() id: string;
  @Input() progress: UploadProgressEvent;
  @Input() filename: string;
  @HostBinding('class.UploadFailed')
  @Input()
  failed: boolean;
  @Output() removeFailedUpload = new EventEmitter<string>();
  progressBarWidth = '0%';

  ngOnChanges(changes: SimpleChanges) {
    if ('progress' in changes) {
      const progress = changes.progress.currentValue;
      this.progressBarWidth = this.getProgressBarWidth(progress);
    }
  }

  removeAttachment() {
    this.removeFailedUpload.emit(this.id);
  }

  private getProgressBarWidth(progress?: UploadProgressEvent) {
    if (
      progress &&
      progress.loaded !== undefined &&
      progress.total !== undefined
    ) {
      const percentageDone = Math.round(
        (100 * progress.loaded) / progress.total,
      );
      return `${percentageDone}%`;
    }

    return '0%';
  }
}

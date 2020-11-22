import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-contest-file-upload-inline-error',
  template: `
    <ng-container [ngSwitch]="errorCode">
      <!-- shouldn't happen since we should validate the file type on the frontend -->
      <fl-text
        *ngSwitchCase="'PATTERN_VALIDATION_FAILED'"
        i18n="Invalid filename/filetype error message"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Invalid file type.
      </fl-text>
      <!-- shouldn't happen since we validate the file size on the frontend -->
      <fl-text
        *ngSwitchCase="'REQUEST_ENTITY_TOO_LARGE'"
        i18n="File is too large error message"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        File size must not exceed {{ MAX_FILE_SIZE | fileSize: 0 }}.
      </fl-text>
      <!-- If this case happens, the file was probably uploaded but was corrupted (?) -->
      <fl-text
        *ngSwitchCase="'TYPE_VALIDATION_FAILED'"
        i18n="Upload failed error message"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Possibly corrupted file. Please try again.
      </fl-text>
      <!-- If this case happens, the file was not uploaded properly (?) -->
      <fl-text
        *ngSwitchCase="'BAD_REQUEST'"
        i18n="Upload failed error message"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Upload failed. Please try again.
      </fl-text>
      <fl-text
        *ngSwitchCase="'INTERNAL_SERVER_ERROR'"
        i18n="Internal server upload error message"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        Server error. Please try again.
      </fl-text>
      <!-- UNKNOWN_ERROR so we're not sure why it failed -->
      <ng-container *ngSwitchDefault>
        <fl-text
          *ngIf="hasRequestId; else noRequestId"
          i18n="Upload failed generic error message"
          [color]="FontColor.ERROR"
          [size]="TextSize.XXSMALL"
        >
          Upload failed. Please try again.
        </fl-text>
        <!-- For errors due to network failure (no request ID) -->
        <ng-template #noRequestId>
          <fl-text
            i18n="Upload failed due to network error message"
            [color]="FontColor.ERROR"
            [size]="TextSize.XXSMALL"
          >
            Possible network error. Please try again.
          </fl-text>
        </ng-template>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestFileUploadInlineErrorComponent {
  FontColor = FontColor;
  TextSize = TextSize;

  readonly MAX_FILE_SIZE = 20971520;

  @Input() errorCode: string;
  @Input() hasRequestId = false;
}

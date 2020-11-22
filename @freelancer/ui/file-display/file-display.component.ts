import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { PictureDisplay } from '@freelancer/ui/picture';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';

export enum FileDisplayType {
  ICON = 'icon',
  THUMBNAIL = 'thumbnail',
}

export enum FileDisplaySize {
  XSMALL = 'xsmall',
  SMALL = 'small',
  MID = 'mid',
}

export enum FileDisplayIconType {
  GENERIC = 'generic',
  SPECIFIC = 'specific',
}

@Component({
  selector: 'fl-file-display',
  template: `
    <ng-container *ngIf="type === FileDisplayType.THUMBNAIL">
      <img
        class="FileDisplay Image"
        *ngIf="isImage"
        [src]="src"
        [alt]="alt"
        [attr.data-size]="size"
      />

      <fl-icon
        class="FileDisplay Icon"
        *ngIf="!isImage"
        [ngClass]="{ IsLarge: size !== FileDisplaySize.XSMALL }"
        [size]="IconSize.MID"
        [color]="IconColor.WHITE"
        [name]="iconName"
      ></fl-icon>
    </ng-container>

    <fl-icon
      *ngIf="type === FileDisplayType.ICON"
      [color]="iconColor"
      [name]="iconName"
      [size]="iconSize"
      [sizeTablet]="iconSizeTablet"
      [sizeDesktop]="iconSizeDesktop"
    ></fl-icon>
  `,
  styleUrls: ['./file-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDisplayComponent implements OnChanges {
  FileDisplaySize = FileDisplaySize;
  FileDisplayType = FileDisplayType;
  IconColor = IconColor;
  IconSize = IconSize;
  PictureDisplay = PictureDisplay;

  @Input() alt: string;
  @Input() src: string;
  @Input() iconColor = IconColor.DARK;
  @Input() iconSize = IconSize.MID;
  @Input() iconSizeTablet?: IconSize;
  @Input() iconSizeDesktop?: IconSize;

  /** Use file specific or generic icon per file type */
  @Input() iconType = FileDisplayIconType.SPECIFIC;

  @HostBinding('attr.data-type')
  @Input()
  type = FileDisplayType.THUMBNAIL;

  // Thumbnail size
  @HostBinding('attr.data-size')
  @Input()
  size = FileDisplaySize.SMALL;

  iconName: string;
  isImage: boolean;

  constructor(@Inject(UI_CONFIG) public uiConfig: UiConfig) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('src' in changes) {
      const fileparts = this.src.split('.');
      const fileType =
        fileparts.length > 1
          ? fileparts[fileparts.length - 1].toLowerCase()
          : '';

      this.isImage = this.isImageFile(fileType);

      if (this.iconType === FileDisplayIconType.SPECIFIC) {
        this.iconName = this.getFileIcon(fileType);
      } else if (this.iconType === FileDisplayIconType.GENERIC) {
        this.iconName = this.getTypeIcon(fileType);
      }
    }
  }

  isAudioFile(fileType: string): boolean {
    return ['aac', 'ogg', 'mp3', 'wma', 'wav'].includes(fileType);
  }

  isCodeFile(fileType: string): boolean {
    return ['html', 'js', 'ts', 'java', 'php', 'py', 'xml'].includes(fileType);
  }

  isImageFile(fileType: string): boolean {
    // these are the image files that can be viewed on all browsers we support
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileType);
  }

  isVideoFile(fileType: string): boolean {
    return ['avi', 'flv', 'mov', 'mpg', 'mp4'].includes(fileType);
  }

  /**
   * Map icon based on file type
   */
  getTypeIcon(fileType: string): string {
    if (this.isAudioFile(fileType)) {
      return 'ui-file-audio';
    }

    if (this.isCodeFile(fileType)) {
      return 'ui-file-code';
    }

    if (this.isImageFile(fileType)) {
      return 'ui-file-img';
    }

    if (this.isVideoFile(fileType)) {
      return 'ui-file-video';
    }

    return 'ui-file';
  }

  /**
   * Map icon based on file extension
   */
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'avi':
        return 'ui-file-avi';
      case 'doc':
      case 'docx':
        return 'ui-file-doc';
      case 'flv':
        return 'ui-file-flv';
      case 'gif':
        return 'ui-file-gif';
      case 'jpg':
      case 'jpeg':
        return 'ui-file-jpg';
      case 'key':
        return 'ui-file-key';
      case 'mp4':
        return 'ui-file-mp4';
      case 'mov':
        return 'ui-file-mov';
      case 'mpg':
        return 'ui-file-mpg';
      case 'pdf':
        return 'ui-file-pdf';
      case 'png':
        return 'ui-file-png';
      case 'pps':
      case 'ppt':
      case 'pptx':
        return 'ui-file-pps';
      case 'rar':
        return 'ui-file-rar';
      case 'rtf':
        return 'ui-file-rtf';
      case 'svg':
        return 'ui-file-svg';
      case 'txt':
        return 'ui-file-txt';
      case 'xls':
      case 'xlsx':
        return 'ui-file-xls';
      case 'zip':
        return 'ui-file-zip';
      default:
        return 'ui-file';
    }
  }
}

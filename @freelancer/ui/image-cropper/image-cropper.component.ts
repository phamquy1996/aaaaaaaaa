import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CropperPosition, ImageCroppedEvent } from 'ngx-image-cropper';

export type ImageCropperFormat = 'png' | 'jpeg' | 'bmp' | 'webp' | 'ico';

export enum ImageCropperAspectRatio {
  SQUARE = 'square',
  PORTRAIT = 'portrait',
  STANDARD = 'standard',
  WIDESCREEN = 'widescreen',
  COVER_PHOTO = 'cover_photo',
  BACKGROUND_COVER_PHOTO = 'background_cover_photo',
}

@Component({
  selector: 'fl-image-cropper',
  template: `
    <image-cropper
      [imageBase64]="image"
      [maintainAspectRatio]="fixedCropperAspectRatio"
      [aspectRatio]="computedCropperAspectRatio"
      [resizeToWidth]="outputWidth"
      [cropperMinWidth]="cropperMinWidth"
      [format]="outputFormat"
      [outputType]="'base64'"
      (imageCropped)="cropImage($event)"
    ></image-cropper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperComponent implements OnInit, OnChanges {
  croppedImage: string | null | undefined;
  computedCropperAspectRatio: number;
  imagePosition: CropperPosition;
  croppedWidth: number;
  croppedHeight: number;

  @Input() cropperAspectRatio = ImageCropperAspectRatio.SQUARE;
  @Input() cropperMinWidth?: number;
  @Input() fixedCropperAspectRatio?: boolean;
  @Input() image: string;
  @Input() outputFormat: ImageCropperFormat = 'png';
  @Input() outputWidth?: number;

  @Output() imageCropped = new EventEmitter<string>();

  ngOnInit() {
    this.computedCropperAspectRatio = this.getAspectRatio(
      this.cropperAspectRatio,
    );
  }

  ngOnChanges() {
    this.computedCropperAspectRatio = this.getAspectRatio(
      this.cropperAspectRatio,
    );
  }

  /**
   * Returns a number equivalent to major aspect ratios
   * (The ratio of width to height of an image).
   */
  getAspectRatio(cropperAspectRatio: ImageCropperAspectRatio | undefined) {
    switch (cropperAspectRatio) {
      case ImageCropperAspectRatio.STANDARD:
        // 3 : 2
        return 3 / 2;
      case ImageCropperAspectRatio.PORTRAIT:
        // 2 : 3
        return 2 / 3;
      case ImageCropperAspectRatio.WIDESCREEN:
        // 16 : 9
        return 16 / 9;
      case ImageCropperAspectRatio.COVER_PHOTO:
        // 588 : 115
        return 588 / 115;
      case ImageCropperAspectRatio.BACKGROUND_COVER_PHOTO:
        // 192 : 55
        return 192 / 55;
      default:
        // 1 : 1
        return 1 / 1;
    }
  }

  cropImage(event: ImageCroppedEvent) {
    this.croppedHeight = event.height;
    this.croppedImage = event.base64;
    this.croppedWidth = event.width;
    this.imagePosition = event.imagePosition;
    if (event.base64) {
      this.imageCropped.emit(event.base64);
    }
  }
}

/**
 * TODO: This needs to be made private. The image cropper should allow the
 * developer to pass any image input type and the component handles the conversion.
 *
 * Takes an image URL and returns the base64 encoded string of the image.
 * Base64 is the required format for passing images into the image cropper.
 *
 * Taken from: https://stackoverflow.com/a/16566198.
 *
 * @param url Image URL to convert to base64 encoding.
 */
export function convertUrlToBase64(url: string): Promise<string | undefined> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(undefined);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL();

      canvas.remove();

      resolve(dataURL);
    };

    img.src = url;
  });
}

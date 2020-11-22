import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Assets } from '../assets';

export enum FlagSize {
  SMALL = 'small',
  MID = 'mid',
}

@Component({
  selector: 'fl-flag',
  template: `
    <img
      alt="Flag of {{ country | uppercase }}"
      class="FlagImage"
      i18n-alt="Flag alt text"
      role="presentation"
      title="{{ country }}"
      [attr.data-size]="size"
      [src]="imagePath"
      (error)="onImageFetchError()"
    />
  `,
  styleUrls: ['./flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlagComponent implements OnChanges {
  private forceUnknown = false;

  imagePath = '';

  @Input() country = 'unknown';
  @Input() size = FlagSize.MID;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private assets: Assets,
  ) {}

  onImageFetchError() {
    if (!this.forceUnknown) {
      // Well this sucks. Show the unknown flag for now.
      this.forceUnknown = true;
      this.imagePath = this.getFlagImage();
      this.changeDetectorRef.markForCheck();
    }
  }

  private getFlagImage() {
    if (this.forceUnknown || !this.country) {
      return this.assets.getUrl('flags/unknown.svg');
    }
    return this.assets.getUrl(`flags/${this.country}.svg`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('country' in changes) {
      // There's a possibility that the new `country` can be a country with an existing flag. Flip
      // forceUnknown to false to check.
      this.forceUnknown = false;
      this.imagePath = this.getFlagImage();
    }
  }
}

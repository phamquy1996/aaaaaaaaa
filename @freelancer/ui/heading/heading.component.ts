import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TextSize } from '@freelancer/ui/text';

export enum HeadingType {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum HeadingColor {
  DARK = 'dark',
  MID = 'mid',
  LIGHT = 'light',
  RECRUITER = 'recruiter',
  INHERIT = 'inherit',
  PRIMARY_PINK = 'primary-pink',
}

export enum HeadingWeight {
  BOLD = 'bold',
  MEDIUM = 'medium',
  NORMAL = 'normal',
  LIGHT = 'light',
  INHERIT = 'inherit',
}

@Component({
  selector: 'fl-heading',
  template: `
    <ng-container [ngSwitch]="headingType">
      <h1
        *ngSwitchCase="HeadingType.H1"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-truncate]="truncate"
        [attr.data-weight]="weight"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </h1>

      <h2
        *ngSwitchCase="HeadingType.H2"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-truncate]="truncate"
        [attr.data-weight]="weight"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </h2>

      <h3
        *ngSwitchCase="HeadingType.H3"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-truncate]="truncate"
        [attr.data-weight]="weight"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </h3>

      <h4
        *ngSwitchCase="HeadingType.H4"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-truncate]="truncate"
        [attr.data-weight]="weight"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </h4>

      <h5
        *ngSwitchCase="HeadingType.H5"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-truncate]="truncate"
        [attr.data-weight]="weight"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </h5>

      <h6
        *ngSwitchCase="HeadingType.H6"
        [attr.data-color]="color"
        [attr.data-size]="size"
        [attr.data-size-tablet]="sizeTablet"
        [attr.data-size-desktop]="sizeDesktop"
        [attr.data-size-desktop-xlarge]="sizeDesktopXLarge"
        [attr.data-truncate]="truncate"
        [attr.data-weight]="weight"
      >
        <ng-container *ngTemplateOutlet="injectedContent"></ng-container>
      </h6>
      <ng-template #injectedContent><ng-content></ng-content></ng-template>
    </ng-container>
  `,
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
  HeadingType = HeadingType;
  TextSize = TextSize;
  HeadingColor = HeadingColor;

  @Input() color = HeadingColor.DARK;

  /** Font size for mobile and above */
  @Input() size: TextSize;

  /** Change the [size] from tablet and above */
  @Input() sizeTablet?: TextSize;

  /** Change the [size] and/or [sizeTablet] from desktop and above */
  @Input() sizeDesktop?: TextSize;

  /** Change the [size], [sizeTablet] and [sizeDesktop] from desktop-xlarge and above */
  @Input() sizeDesktopXLarge?: TextSize;

  @Input() weight = HeadingWeight.BOLD;

  /** Defines the HTML heading node it will use e.g (<h1>, <h2>, etc..)
   *  Note: This is for semantics usage and does not define the size of the heading
   */
  @Input() headingType: HeadingType;

  /**
   * Truncate text node and adds ellipsis where word is cutoff
   * Note: This will truncate mid-word if needed to keep things in a single line
   * since headings are not expected to contain paragraphs.
   */
  @Input() truncate = false;
}

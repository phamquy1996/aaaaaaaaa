import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
} from '@angular/core';
import { HorizontalAlignment, VerticalAlignment } from '@freelancer/ui/grid';
import {
  HeadingColor,
  HeadingType,
  HeadingWeight,
} from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';

export enum SectionFeatureColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SectionFeatureSize {
  SMALL = 'small',
  MEDIUM = 'medium',
}

export enum SectionFeatureAlignment {
  LEFT = 'left',
  RIGHT = 'right',
}

@Component({
  selector: 'fl-section-feature-body',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFeatureBodyComponent {}

@Component({
  selector: 'fl-section-feature-detail',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFeatureDetailComponent {}

@Component({
  selector: 'fl-section-feature-heading',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFeatureHeadingComponent {}

@Component({
  selector: 'fl-section-feature-subheading',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFeatureSubheadingComponent {}

@Component({
  selector: 'fl-section-feature',
  template: `
    <fl-bit
      class="SectionFeature"
      [attr.data-size]="size"
      [attr.data-border-top]="borderTop"
      [attr.data-overlay]="overlay"
      [attr.data-full-width]="fullWidth"
      [attr.data-color]="color"
    >
      <fl-container>
        <fl-grid
          [vAlign]="VerticalAlignment.VERTICAL_CENTER"
          [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER"
        >
          <fl-col
            class="SectionFeature-content"
            [col]="12"
            [colDesktopSmall]="fullWidth ? 8 : 4"
            [colOrder]="alignment === SectionFeatureAlignment.LEFT ? 1 : 2"
            [pull]="fullWidth ? undefined : 'right'"
            [flMarginBottom]="Margin.LARGE"
          >
            <fl-text
              *ngIf="sectionFeatureDetail"
              [color]="
                color === SectionFeatureColor.DARK
                  ? FontColor.DARK
                  : FontColor.LIGHT
              "
              [fontType]="FontType.PARAGRAPH"
              [size]="TextSize.XSMALL"
              [flMarginBottom]="Margin.SMALL"
            >
              <ng-content select="fl-section-feature-detail"></ng-content>
            </fl-text>
            <fl-heading
              *ngIf="sectionFeatureHeading"
              [color]="
                color === SectionFeatureColor.DARK
                  ? HeadingColor.DARK
                  : HeadingColor.LIGHT
              "
              [headingType]="HeadingType.H2"
              [size]="TextSize.XLARGE"
              [flMarginBottom]="Margin.MID"
            >
              <ng-content select="fl-section-feature-heading"></ng-content>
            </fl-heading>
            <fl-heading
              *ngIf="sectionFeatureSubheading"
              [color]="
                color === SectionFeatureColor.DARK
                  ? HeadingColor.DARK
                  : HeadingColor.LIGHT
              "
              [headingType]="HeadingType.H3"
              [size]="TextSize.LARGE"
              [weight]="HeadingWeight.NORMAL"
              [flMarginBottom]="Margin.SMALL"
            >
              <ng-content select="fl-section-feature-subheading"></ng-content>
            </fl-heading>
            <fl-text
              *ngIf="sectionFeatureBody"
              [color]="
                color === SectionFeatureColor.DARK
                  ? FontColor.DARK
                  : FontColor.LIGHT
              "
              [fontType]="FontType.PARAGRAPH"
              [size]="TextSize.SMALL"
            >
              <ng-content select="fl-section-feature-body"></ng-content>
            </fl-text>
          </fl-col>
          <fl-col
            class="SectionFeature-content"
            [col]="12"
            [colDesktopSmall]="fullWidth ? 12 : 6"
            [colOrder]="alignment === SectionFeatureAlignment.LEFT ? 2 : 1"
            [pull]="fullWidth ? undefined : 'right'"
            [flMarginBottom]="Margin.LARGE"
          >
            <figure class="SectionFeature-figure">
              <fl-picture
                [alignCenter]="true"
                [boundedWidth]="true"
                [display]="PictureDisplay.BLOCK"
                [src]="imageSrc"
                [alt]="imageAlt"
              ></fl-picture>
              <figcaption
                class="SectionFeature-figure-caption"
                *ngIf="imageCaption"
              >
                <fl-text
                  [color]="
                    color === SectionFeatureColor.DARK
                      ? FontColor.DARK
                      : FontColor.LIGHT
                  "
                  [size]="TextSize.XXSMALL"
                  [fontType]="FontType.SPAN"
                >
                  {{ imageCaption }}
                </fl-text>
              </figcaption>
            </figure>
          </fl-col>
        </fl-grid>
      </fl-container>
    </fl-bit>
  `,
  styleUrls: ['./section-feature.component.scss'],
})
export class SectionFeatureComponent {
  @Input() alignment: SectionFeatureAlignment;
  @Input() borderTop = false;
  @Input() color: SectionFeatureColor = SectionFeatureColor.DARK;
  @Input() darkBackground = false;
  @Input() imageSrc: string;
  @Input() imageAlt: string;
  @Input() imageCaption?: string;
  /** Stack the content and featured image on top of each other. */
  @Input() fullWidth = false;
  @Input() overlay = false;
  @Input() size: SectionFeatureSize;

  @ContentChild(SectionFeatureDetailComponent)
  sectionFeatureDetail: SectionFeatureDetailComponent;
  @ContentChild(SectionFeatureHeadingComponent)
  sectionFeatureHeading: SectionFeatureHeadingComponent;
  @ContentChild(SectionFeatureSubheadingComponent)
  sectionFeatureSubheading: SectionFeatureSubheadingComponent;
  @ContentChild(SectionFeatureBodyComponent)
  sectionFeatureBody: SectionFeatureBodyComponent;

  Margin = Margin;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  PictureDisplay = PictureDisplay;
  HorizontalAlignment = HorizontalAlignment;
  VerticalAlignment = VerticalAlignment;
  SectionFeatureAlignment = SectionFeatureAlignment;
  SectionFeatureColor = SectionFeatureColor;
}

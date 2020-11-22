import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Inject,
  Input,
} from '@angular/core';
import { HorizontalAlignment } from '@freelancer/ui/grid';
import {
  HeadingColor,
  HeadingType,
  HeadingWeight,
} from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';

export enum SectionHeroContentWidth {
  SMALL = 6,
  MEDIUM = 8,
  LARGE = 10,
}

export enum SectionHeroHeight {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  RESPONSIVE = 'responsive',
}

export enum SectionHeroAlignment {
  LEFT = 'left',
  CENTER = 'center',
}

export enum SectionHeroBackgroundColor {
  DARK = 'dark',
  LIGHT = 'light',
}

@Component({
  selector: 'fl-section-hero-logo',
  template: `
    <ng-content></ng-content>
  `,
})
export class SectionHeroLogoComponent {}

@Component({
  selector: 'fl-section-hero-detail-text',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeroDetailTextComponent {}

@Component({
  selector: 'fl-section-hero-title',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeroTitleComponent {}
@Component({
  selector: 'fl-section-hero-description',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeroDescriptionComponent {}

@Component({
  selector: 'fl-section-hero',
  template: `
    <fl-container>
      <fl-grid
        [hAlign]="
          alignment == SectionHeroAlignment.CENTER
            ? HorizontalAlignment.HORIZONTAL_CENTER
            : undefined
        "
      >
        <fl-col [col]="12" [colTablet]="contentWidth">
          <fl-bit *ngIf="sectionHeroLogo" [flMarginBottom]="Margin.XSMALL">
            <ng-content select="fl-section-hero-logo"></ng-content>
          </fl-bit>
          <fl-heading
            [color]="
              backgroundColor === SectionHeroBackgroundColor.DARK
                ? HeadingColor.LIGHT
                : HeadingColor.DARK
            "
            [headingType]="HeadingType.H1"
            [size]="TextSize.XLARGE"
            [sizeTablet]="TextSize.XXLARGE"
            [sizeDesktop]="TextSize.XXXLARGE"
            [sizeDesktopXLarge]="TextSize.MARKETING_MEGA"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.MID"
          >
            <ng-content select="fl-section-hero-title"></ng-content>
          </fl-heading>
          <fl-heading
            *ngIf="sectionHeroDescription"
            [color]="
              backgroundColor === SectionHeroBackgroundColor.DARK
                ? HeadingColor.LIGHT
                : HeadingColor.DARK
            "
            [headingType]="HeadingType.H2"
            [size]="TextSize.MARKETING_SMALL"
            [sizeTablet]="TextSize.MID"
            [sizeDesktop]="TextSize.LARGE"
            [weight]="HeadingWeight.NORMAL"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.MID"
          >
            <ng-content select="fl-section-hero-description"></ng-content>
          </fl-heading>
          <fl-text
            *ngIf="sectionHeroDetailText"
            [color]="
              backgroundColor === SectionHeroBackgroundColor.DARK
                ? FontColor.LIGHT
                : FontColor.DARK
            "
            [fontType]="FontType.PARAGRAPH"
            [size]="TextSize.SMALL"
            [sizeTablet]="TextSize.XSMALL"
            [sizeDesktop]="TextSize.SMALL"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.MID"
          >
            <ng-content select="fl-section-hero-detail-text"></ng-content>
          </fl-text>
          <ng-content></ng-content>
        </fl-col>
      </fl-grid>
    </fl-container>
  `,
  styleUrls: ['./section-hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeroComponent {
  FontType = FontType;
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  Margin = Margin;
  SectionHeroBackgroundColor = SectionHeroBackgroundColor;

  @HostBinding('attr.data-alignment')
  @Input()
  alignment: SectionHeroAlignment = SectionHeroAlignment.LEFT;

  @HostBinding('attr.data-height')
  @Input()
  height?: SectionHeroHeight;

  @Input() contentWidth: SectionHeroContentWidth =
    SectionHeroContentWidth.SMALL;

  @HostBinding('attr.data-background-color')
  @Input()
  backgroundColor = SectionHeroBackgroundColor.DARK;

  @ContentChild(SectionHeroDescriptionComponent)
  sectionHeroDescription: SectionHeroDescriptionComponent;
  @ContentChild(SectionHeroDetailTextComponent)
  sectionHeroDetailText: SectionHeroDetailTextComponent;
  @ContentChild(SectionHeroLogoComponent)
  sectionHeroLogo: SectionHeroLogoComponent;

  SectionHeroAlignment = SectionHeroAlignment;
  HorizontalAlignment = HorizontalAlignment;

  constructor(@Inject(UI_CONFIG) public uiConfig: UiConfig) {}
}

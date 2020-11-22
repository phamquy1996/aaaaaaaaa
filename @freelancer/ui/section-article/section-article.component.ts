import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
} from '@angular/core';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

export enum SectionArticleAlignment {
  LEFT = 'left',
  CENTER = 'center',
}

export enum SectionArticleColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SectionArticleSize {
  MEDIUM = 'medium',
  LARGE = 'large',
}

@Component({
  selector: 'fl-section-article-title',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArticleTitleComponent {}

@Component({
  selector: 'fl-section-article-description',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArticleDescriptionComponent {}

@Component({
  selector: 'fl-section-article-entry-heading',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArticleEntryHeadingComponent {}

@Component({
  selector: 'fl-section-article-entry-detail',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArticleEntryDetailComponent {}

@Component({
  selector: 'fl-section-article-entry',
  template: `
    <fl-bit [flMarginBottom]="Margin.MID" [flMarginBottomTablet]="Margin.NONE">
      <fl-bit
        *ngIf="pictureSrc"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomTablet]="Margin.MID"
      >
        <fl-picture
          [src]="pictureSrc"
          [alt]="pictureAlt"
          class="Illustration"
        ></fl-picture>
      </fl-bit>
      <fl-heading
        [color]="
          color === SectionArticleColor.DARK
            ? HeadingColor.DARK
            : HeadingColor.LIGHT
        "
        [headingType]="HeadingType.H3"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.XXSMALL"
      >
        <ng-content select="fl-section-article-entry-heading"></ng-content>
      </fl-heading>
      <fl-text
        [color]="
          color === SectionArticleColor.DARK ? FontColor.MID : FontColor.LIGHT
        "
        [size]="TextSize.SMALL"
      >
        <ng-content select="fl-section-article-entry-detail"></ng-content>
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./section-article-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArticleEntryComponent {
  Margin = Margin;
  FontColor = FontColor;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  TextSize = TextSize;
  SectionArticleColor = SectionArticleColor;

  @Input() color: SectionArticleColor = SectionArticleColor.DARK;
  @Input() pictureSrc: string;
  @Input() pictureAlt: string;
}

@Component({
  selector: 'fl-section-article',
  template: `
    <fl-container>
      <fl-grid *ngIf="sectionArticleTitleComponent">
        <fl-col [col]="12" [colTablet]="6">
          <fl-heading
            [color]="
              color === SectionArticleColor.DARK
                ? HeadingColor.DARK
                : HeadingColor.LIGHT
            "
            [headingType]="HeadingType.H3"
            [size]="TextSize.LARGE"
            [sizeTablet]="TextSize.XLARGE"
            [sizeDesktop]="TextSize.XXLARGE"
            [flMarginBottom]="Margin.XXSMALL"
            [flMarginBottomTablet]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.MID"
          >
            <ng-content select="fl-section-article-title"></ng-content>
          </fl-heading>
          <fl-text
            *ngIf="sectionArticleDescriptionComponent"
            [color]="
              color === SectionArticleColor.DARK
                ? FontColor.MID
                : FontColor.LIGHT
            "
            [size]="TextSize.MARKETING_SMALL"
            [sizeDesktop]="TextSize.MID"
            [flMarginBottom]="Margin.LARGE"
          >
            <ng-content select="fl-section-article-description"></ng-content>
          </fl-text>
        </fl-col>
      </fl-grid>
      <fl-grid [attr.data-alignment]="alignment">
        <ng-content></ng-content>
      </fl-grid>
    </fl-container>
  `,
  styleUrls: ['./section-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArticleComponent {
  Margin = Margin;
  FontColor = FontColor;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  TextSize = TextSize;
  SectionArticleColor = SectionArticleColor;

  @Input() alignment: SectionArticleAlignment;

  @HostBinding('attr.data-size')
  @Input()
  size?: SectionArticleSize;

  @Input() color: SectionArticleColor = SectionArticleColor.DARK;

  @ContentChild(SectionArticleTitleComponent)
  sectionArticleTitleComponent: SectionArticleTitleComponent;
  @ContentChild(SectionArticleDescriptionComponent)
  sectionArticleDescriptionComponent: SectionArticleDescriptionComponent;
}

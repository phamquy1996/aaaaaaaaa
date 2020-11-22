import { Component, Input } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingWeight } from '@freelancer/ui/heading';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: `app-bom-tool-ad`,
  template: `
    <fl-card [edgeToEdge]="true" flTrackingSection="BOMAd">
      <fl-bit class="BomAdHeader" flTrackingLabel="BOMAdTop">
        <fl-bit class="BomAdHeader-content">
          <fl-picture
            src="arrow-logo.svg"
            alt="arrow logo"
            i18n-alt="arrow logo"
            [boundedWidth]="true"
          ></fl-picture>
          <fl-text i18n="arrow site name">
            &nbsp;| arrow.com
          </fl-text>
        </fl-bit>
      </fl-bit>
      <fl-bit class="BomAdContent" flTrackingLabel="BOMAdTop">
        <fl-bit class="BomAdContent-heading">
          <fl-text
            class="BomAdContent-heading-large"
            i18n="BOM Ad Heading"
            [size]="fullSize ? TextSize.LARGE : TextSize.MID"
            [weight]="HeadingWeight.BOLD"
          >
            Avoid Design Mistakes
          </fl-text>
          <fl-text
            class="BomAdContent-heading-small"
            i18n="BOM Ad Subheading"
            [size]="fullSize ? TextSize.MID : TextSize.SMALL"
            [color]="FontColor.INHERIT"
          >
            Free BOM Tool with Risk Analysis
          </fl-text>
        </fl-bit>
        <fl-bit class="BomAdContent-graphic">
          <fl-picture
            class="BomAdContent-graphic-image"
            src="bom-ad-graphic/bom-ad-graphic.svg"
            alt="risk scores"
            i18n-alt="risk scores"
            [flMarginRight]="Margin.XSMALL"
          ></fl-picture>

          <fl-bit class="BomAdContent-graphic-list">
            <fl-text
              i18n="Bom Ad List Heading"
              [ngClass]="
                fullSize
                  ? 'BomAdContent-graphic-heading-large'
                  : 'BomAdContent-graphic-heading-small'
              "
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
            >
              Risk Score
            </fl-text>
            <fl-list
              [type]="ListItemType.NON_BORDERED"
              [padding]="
                fullSize ? ListItemPadding.XSMALL : ListItemPadding.XXXSMALL
              "
            >
              <fl-list-item
                ><fl-picture
                  class="BomAdContent-graphic-box"
                  [objectFit]="PictureObjectFit.CONTAIN"
                  [src]="'bom-ad-graphic/red-box.svg'"
                  [flMarginRight]="Margin.XXXSMALL"
                ></fl-picture>
                <fl-text
                  i18n="BOM Ad List Item High"
                  [fontType]="FontType.SPAN"
                  [size]="TextSize.SMALL"
                >
                  High
                </fl-text>
              </fl-list-item>
              <fl-list-item
                ><fl-picture
                  class="BomAdContent-graphic-box"
                  [objectFit]="PictureObjectFit.CONTAIN"
                  [src]="'bom-ad-graphic/yellow-box.svg'"
                  [flMarginRight]="Margin.XXXSMALL"
                ></fl-picture>
                <fl-text
                  i18n="BOM Ad List Item Medium"
                  [fontType]="FontType.SPAN"
                  [size]="TextSize.SMALL"
                >
                  Medium
                </fl-text>
              </fl-list-item>
              <fl-list-item
                ><fl-picture
                  class="BomAdContent-graphic-box"
                  [objectFit]="PictureObjectFit.CONTAIN"
                  [src]="'bom-ad-graphic/green-box.svg'"
                  [flMarginRight]="Margin.XXXSMALL"
                ></fl-picture>
                <fl-text
                  i18n="BOM Ad List Item Low"
                  [fontType]="FontType.SPAN"
                  [size]="TextSize.SMALL"
                >
                  Low
                </fl-text>
              </fl-list-item>
              <fl-list-item
                ><fl-picture
                  class="BomAdContent-graphic-box"
                  [objectFit]="PictureObjectFit.CONTAIN"
                  [src]="'bom-ad-graphic/purple-box.svg'"
                  [flMarginRight]="Margin.XXXSMALL"
                ></fl-picture>
                <fl-text
                  i18n="BOM Ad List Item Unknown"
                  [fontType]="FontType.SPAN"
                  [size]="TextSize.SMALL"
                >
                  Unknown
                </fl-text>
              </fl-list-item>
            </fl-list>
          </fl-bit>
        </fl-bit>
      </fl-bit>
      <fl-bit class="BomAdFooter">
        <fl-button
          i18n="BOM Ad CTA"
          flTrackingLabel="BOMAdCTA"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [display]="'block'"
          [size]="ButtonSize.LARGE"
          [link]="'https://www.arrow.com/en/bom-tool/'"
        >
          Start Here
        </fl-button>
      </fl-bit>
    </fl-card>
  `,
  styleUrls: ['./bom-tool-ad.component.scss'],
})
export class BomToolAdComponent {
  HeadingWeight = HeadingWeight;
  TextSize = TextSize;
  FontColor = FontColor;
  FontType = FontType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  ListItemType = ListItemType;
  FontWeight = FontWeight;
  PictureObjectFit = PictureObjectFit;
  Margin = Margin;
  ListItemPadding = ListItemPadding;

  @Input() fullSize = true;
}

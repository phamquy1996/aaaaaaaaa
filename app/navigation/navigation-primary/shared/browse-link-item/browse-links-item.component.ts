import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  HeadingColor,
  HeadingType,
  HeadingWeight,
} from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-browse-links-item',
  template: `
    <fl-link
      class="LinkItem"
      [color]="LinkColor.DARK"
      [flTrackingLabel]="trackingLabel"
      [link]="link"
      [underline]="LinkUnderline.NEVER"
    >
      <fl-bit class="LinkItem-container">
        <fl-icon
          [color]="IconColor.INHERIT"
          [flMarginRight]="Margin.XXSMALL"
          [label]="iconLabel"
          [name]="icon"
        ></fl-icon>
        <fl-bit class="LinkItem-text" [flMarginRight]="Margin.XXSMALL">
          <fl-heading
            [color]="HeadingColor.INHERIT"
            [headingType]="HeadingType.H4"
            [size]="TextSize.SMALL"
            [weight]="HeadingWeight.NORMAL"
          >
            {{ title }}
          </fl-heading>
          <fl-text [color]="FontColor.MID" [size]="TextSize.XXSMALL">
            {{ description }}
          </fl-text>
        </fl-bit>
        <fl-icon
          class="LinkItem-arrow"
          i18n-label="Right Arrow"
          label="Right Arrow"
          [name]="'ui-arrow-right-alt'"
          [size]="IconSize.XSMALL"
        ></fl-icon>
      </fl-bit>
    </fl-link>
  `,
  styleUrls: ['./browse-links-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseLinksItemComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  HeadingWeight = HeadingWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkUnderline = LinkUnderline;
  Margin = Margin;

  @Input() description: string;
  @Input() icon: string;
  @Input() iconLabel: string;
  @Input() link: string;
  @Input() trackingLabel: string;
  @Input() title: string;
}

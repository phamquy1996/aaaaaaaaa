import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { HoverColor, IconColor } from '@freelancer/ui/icon';

export enum SocialButtonColor {
  LIGHT = 'white',
  DARK = 'mid',
}

@Component({
  selector: 'fl-social-buttons-arrow',
  template: `
    <a
      class="FacebookButton IconContainer"
      (click)="handleClick('facebook')"
      [href]="socialUrls['facebook']"
      target="_blank"
    >
      <fl-icon
        [color]="color"
        [hoverColor]="HoverColor.CURRENT"
        [name]="'ui-facebook'"
      >
      </fl-icon>
    </a>
    <a
      class="TwitterButton IconContainer"
      [href]="socialUrls['twitter']"
      target="_blank"
      (click)="handleClick('twitter')"
    >
      <fl-icon
        [color]="color"
        [hoverColor]="HoverColor.CURRENT"
        [name]="'ui-twitter'"
      >
      </fl-icon>
    </a>
    <a
      class="YoutubeButton IconContainer"
      [href]="socialUrls['youtube']"
      target="_blank"
      (click)="handleClick('youtube')"
    >
      <fl-icon
        [color]="color"
        [hoverColor]="HoverColor.CURRENT"
        [name]="'ui-youtube'"
      >
      </fl-icon>
    </a>
    <a
      class="LinkedInButton IconContainer"
      [href]="socialUrls['linkedin']"
      target="_blank"
      (click)="handleClick('linkedin')"
    >
      <fl-icon
        [color]="color"
        [hoverColor]="HoverColor.CURRENT"
        [name]="'ui-linkedin'"
      >
      </fl-icon>
    </a>
  `,
  styleUrls: ['./social-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialButtonsArrowComponent {
  HoverColor = HoverColor;

  @Input() color: IconColor.WHITE | IconColor.MID = IconColor.MID;

  /** Maximize the width of the parent container */
  @HostBinding('attr.data-fluid')
  @Input()
  fluid?: boolean;

  socialUrls: { [key: string]: string } = {
    facebook: 'https://facebook.com/ArrowDotCom',
    twitter: 'https://twitter.com/Arrow_Dot_Com',
    youtube: 'https://youtube.com/c/ArrowDotCom',
    linkedin: 'https://linkedin.com/company/arrow-electronics',
  };

  // Tracking could be added here later if required.
  handleClick(platform: string) {
    // Empty
  }
}

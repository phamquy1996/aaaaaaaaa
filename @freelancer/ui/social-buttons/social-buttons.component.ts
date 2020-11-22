import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Clipboard } from '@freelancer/clipboard';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { ToastAlertService, ToastAlertType } from '@freelancer/ui/toast-alert';

export enum SocialButtonColor {
  LIGHT = 'light',
  DARK = 'dark',
  COLORED = 'colored',
}

export enum SocialButtonType {
  ICON = 'icon',
  BUTTON = 'button',
}

export type SocialButtonSize = IconSize.SMALL | IconSize.MID;

@Component({
  selector: 'fl-social-buttons',
  template: `
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-button
        class="SocialButton SocialButton--facebook"
        [attr.data-type]="type"
        [attr.data-theme]="color"
        [link]="shareUrl ? shareUrls['facebook'] : socialUrls['facebook']"
        [color]="shareUrl ? ButtonColor.CUSTOM : null"
        [size]="shareUrl ? ButtonSize.MINI : null"
        (click)="handleClick('facebook')"
      >
        <fl-icon
          *ngIf="shareUrl"
          aria-label="Share on Facebook"
          i18n-aria-label="Share link on Facebook social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-facebook'"
          [size]="size"
        ></fl-icon>
        <fl-icon
          *ngIf="!shareUrl"
          aria-label="Facebook"
          i18n-aria-label="Facebook social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-facebook'"
          [size]="size"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-button
        class="SocialButton SocialButton--twitter"
        [attr.data-type]="type"
        [attr.data-theme]="color"
        [link]="shareUrl ? shareUrls['twitter'] : socialUrls['twitter']"
        [color]="shareUrl ? ButtonColor.CUSTOM : null"
        [size]="shareUrl ? ButtonSize.MINI : null"
        (click)="handleClick('twitter')"
      >
        <fl-icon
          *ngIf="shareUrl"
          aria-label="Share on Twitter"
          i18n-aria-label="Share link on Twitter social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-twitter'"
          [size]="size"
        ></fl-icon>
        <fl-icon
          *ngIf="!shareUrl"
          aria-label="Twitter"
          i18n-aria-label="Facebook social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-twitter'"
          [size]="size"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      *ngIf="!shareUrl"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-button
        class="SocialButton SocialButton--youtube"
        [attr.data-type]="type"
        [attr.data-theme]="color"
        [link]="socialUrls['youtube']"
        (click)="handleClick('youtube')"
      >
        <fl-icon
          aria-label="YouTube"
          i18n-aria-label="YouTube social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-youtube'"
          [size]="size"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      *ngIf="!shareUrl"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-button
        class="SocialButton SocialButton--instagram"
        [attr.data-type]="type"
        [attr.data-theme]="color"
        [link]="socialUrls['instagram']"
        (click)="handleClick('instagram')"
      >
        <fl-icon
          aria-label="Instagram"
          i18n-aria-label="Instagram social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-instagram'"
          [size]="size"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      *ngIf="shareUrl"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-button
        class="SocialButton SocialButton--linkedin"
        [attr.data-type]="type"
        [attr.data-theme]="color"
        [link]="shareUrls['linkedin']"
        [color]="ButtonColor.CUSTOM"
        [size]="ButtonSize.MINI"
        (click)="handleClick('linkedin')"
      >
        <fl-icon
          aria-label="Share on LinkedIn"
          i18n-aria-label="Share link on LinkedIn social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-linkedin'"
          [size]="size"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      *ngIf="shareUrl"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-button
        class="SocialButton SocialButton--pinterest"
        [attr.data-type]="type"
        [attr.data-theme]="color"
        [link]="shareUrls['pinterest']"
        [color]="ButtonColor.CUSTOM"
        [size]="ButtonSize.MINI"
        (click)="handleClick('pinterest')"
      >
        <fl-icon
          aria-label="Share on Pinterest"
          i18n-aria-label="Share link on Pinterest social button"
          [color]="IconColor.INHERIT"
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-pinterest'"
          [size]="size"
        ></fl-icon>
      </fl-button>
    </fl-bit>
    <fl-bit
      class="SocialButtonItem"
      role="listitem"
      *ngIf="shareUrl"
      [flMarginRight]="Margin.XXXSMALL"
    >
      <fl-tooltip
        i18n-message="Copy to clipboard tooltip message"
        message="Copy Link"
      >
        <fl-button
          class="SocialButton SocialButton--copyLink"
          [attr.data-type]="type"
          [attr.data-theme]="color"
          [color]="ButtonColor.CUSTOM"
          [size]="ButtonSize.MINI"
          (click)="copyToClipboard(shareUrl || '')"
        >
          <fl-icon
            aria-label="Copy link to clipboard"
            i18n-aria-label="Copy link to clipboard social button"
            [color]="IconColor.INHERIT"
            [hoverColor]="HoverColor.CURRENT"
            [name]="'ui-link'"
            [size]="size"
          ></fl-icon>
        </fl-button>
      </fl-tooltip>
    </fl-bit>
    <fl-toast-alert
      [type]="ToastAlertType.ERROR"
      [id]="'copy-to-clipboard-error'"
    >
      Copy to clipboard failed, please refresh this page to adjust your
      permission.
    </fl-toast-alert>
    <fl-toast-alert
      [type]="ToastAlertType.SUCCESS"
      [id]="'copy-to-clipboard-success'"
    >
      Copied to clipboard.
    </fl-toast-alert>
  `,
  styleUrls: ['./social-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialButtonsComponent implements OnChanges, OnInit {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  IconColor = IconColor;
  HoverColor = HoverColor;
  Margin = Margin;
  ToastAlertType = ToastAlertType;

  @Input() color: SocialButtonColor = SocialButtonColor.DARK;
  @Input() shareUrl?: string;
  @Input() shareText?: string;
  @Input() size: SocialButtonSize = IconSize.MID;

  /** Maximize the width of the parent container */
  @HostBinding('attr.data-fluid')
  @Input()
  fluid?: boolean;

  @HostBinding('attr.data-type')
  type: SocialButtonType;

  @HostBinding('attr.role')
  role = 'list';

  shareUrls: { [key: string]: string } = {};
  socialUrls: { [key: string]: string } = {
    facebook: 'https://facebook.com/fansoffreelancer',
    twitter: 'https://twitter.com/freelancer',
    youtube: 'https://youtube.com/freelancerchannel',
    instagram: 'https://instagram.com/freelancerofficial',
  };

  constructor(
    private toastAlertService: ToastAlertService,
    private clipboard: Clipboard,
  ) {}

  ngOnChanges() {
    this.setType();
    this.createShareUrls();
  }

  ngOnInit() {
    this.setType();
  }

  setType() {
    this.type = this.shareUrl ? SocialButtonType.BUTTON : SocialButtonType.ICON;
  }

  createShareUrls() {
    const text = (this.shareText || '').split(' ').join('+');

    if (!this.shareUrl) {
      return;
    }

    this.shareUrls.facebook = `http://www.facebook.com/share.php?u=${this.shareUrl}`;
    this.shareUrls.twitter = `https://twitter.com/intent/tweet?text=${text}: ${this.shareUrl} via @freelancer Community`;
    this.shareUrls.linkedin = `http://www.linkedin.com/shareArticle?mini=true&url=${this.shareUrl}&title=${text}&source=https://www.freelancer.com/community`;
    this.shareUrls.pinterest = `https://pinterest.com/pin/create/bookmarklet/?url=${this.shareUrl}`;
    this.shareUrls.copyLink = this.shareUrl;
  }

  copyToClipboard(url: string) {
    if (this.clipboard.copy(url)) {
      this.toastAlertService.open('copy-to-clipboard-success');
    } else {
      this.toastAlertService.open('copy-to-clipboard-error');
    }
  }

  // Tracking could be added here later if required.
  handleClick(platform: string) {
    // Empty
  }
}

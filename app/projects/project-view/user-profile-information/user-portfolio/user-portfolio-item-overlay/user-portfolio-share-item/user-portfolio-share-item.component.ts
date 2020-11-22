import { Component, Input, OnChanges } from '@angular/core';
import {
  PortfolioItem,
  ProfileViewUser,
} from '@freelancer/datastore/collections';
import { Location } from '@freelancer/location';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor } from '@freelancer/ui/text';

@Component({
  selector: 'app-user-portfolio-share-item',
  template: `
    <fl-bit class="ShareItemContainer">
      <fl-text
        i18n="Share portfolio item"
        [color]="FontColor.MID"
        [flMarginRight]="Margin.SMALL"
      >
        Share:
      </fl-text>
      <fl-link
        flTrackingLabel="SharePortfolioItemViaFacebook"
        [flMarginRight]="Margin.SMALL"
        [link]="shareUrls.facebook.href"
      >
        <fl-icon
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-facebook'"
        ></fl-icon>
      </fl-link>
      <fl-link
        flTrackingLabel="SharePortfolioItemViaTwitter"
        [flMarginRight]="Margin.SMALL"
        [link]="shareUrls.twitter.href"
      >
        <fl-icon
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-twitter'"
        ></fl-icon>
      </fl-link>
      <fl-link
        flTrackingLabel="SharePortfolioItemViaLinkedIn"
        [flMarginRight]="Margin.SMALL"
        [link]="shareUrls.linkedIn.href"
      >
        <fl-icon
          [hoverColor]="HoverColor.CURRENT"
          [name]="'ui-linkedin'"
        ></fl-icon>
      </fl-link>
    </fl-bit>
  `,
  styleUrls: ['./user-portfolio-share-item.component.scss'],
})
export class UserPortfolioShareItemComponent implements OnChanges {
  FontColor = FontColor;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;

  @Input() portfolioItem: PortfolioItem;
  @Input() user: ProfileViewUser;

  portfolioShareUrl: string;
  shareUrls: { [key: string]: URL } = {};
  socialShareUrls: { [key: string]: string } = {
    facebook: 'https://www.facebook.com/share.php?&u=',
    twitter: 'https://twitter.com/intent/tweet?text=',
    linkedIn: 'https://www.linkedin.com/shareArticle?mini=true&url=',
  };

  constructor(private location: Location) {}

  ngOnChanges() {
    this.setPortfolioItemUrl();
    this.setShareUrls();
  }

  setShareUrls() {
    const shareText = `${encodeURIComponent(this.portfolioItem.title)}: `;

    this.shareUrls.facebook = new URL(
      `${this.socialShareUrls.facebook}${this.portfolioShareUrl}`,
    );
    this.shareUrls.twitter = new URL(
      `${this.socialShareUrls.twitter}${shareText}${this.portfolioShareUrl}`,
    );
    this.shareUrls.linkedIn = new URL(
      `${this.socialShareUrls.linkedIn}${this.portfolioShareUrl}`,
    );
  }

  setPortfolioItemUrl() {
    this.portfolioShareUrl = `${this.location.origin}/u/${this.user.username}/portfolio/${this.portfolioItem.seoTitle}`;
  }
}

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Showcase,
  ShowcaseFileThumbnail,
  ShowcaseItem,
} from '@freelancer/datastore/collections';
import { isAudioFile, isImageFile, isPlayableVideoFile } from '@freelancer/ui';
import { CalloutPlacement } from '@freelancer/ui/callout';
import { CardBorderRadius } from '@freelancer/ui/card';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-discover-portfolio-item-card',
  template: `
    <fl-bit
      *ngIf="showcase; else loadingPortfolio"
      class="PortfolioItemCard"
      [flTrackingSection]="'PortfolioItemCard'"
    >
      <fl-button
        class="PortfolioItemCard-file"
        [flTrackingLabel]="
          subsection ? subsection + '-ShowcaseLink' : 'ShowcaseLink'
        "
        [flTrackingReferenceType]="'showcase_id'"
        [flTrackingReferenceId]="showcase.id"
        [link]="link"
      >
        <fl-bit *ngIf="isImage; else nonImage">
          <fl-picture
            class="PortfolioItemCard-file-image"
            alt="Portfolio item image"
            i18n-alt="Portfolio image alt text"
            [ngClass]="{ 'PortfolioItemCard-file-image-hidden': !ready }"
            [fixedAspectRatio]="true"
            [fullWidth]="true"
            [lazyLoad]="lazyLoad"
            [externalSrc]="true"
            [src]="mobileThumbnail"
            [srcTablet]="nonMobileThumbnail"
            (imageLoaded)="ready = true"
            (onError)="isImageError = true"
          ></fl-picture>
          <fl-bit *ngIf="!ready" class="PortfolioItemCard">
            <fl-loading-text
              class="PortfolioItemCard-loading"
              [padded]="false"
            ></fl-loading-text>
          </fl-bit>
        </fl-bit>
        <ng-template #nonImage>
          <fl-bit class="PortfolioItemCard-file-nonImage">
            <fl-icon
              [name]="iconName"
              [color]="IconColor.LIGHT"
              [size]="IconSize.XXLARGE"
              [sizeTablet]="IconSize.XXLARGE"
            ></fl-icon>
          </fl-bit>
        </ng-template>
        <fl-bit [flShowDesktop]="true" class="PortfolioItemCard-file-info">
          <fl-bit class="PortfolioItemCard-file-info-content">
            <fl-text
              [color]="FontColor.DARK"
              [size]="TextSize.XSMALL"
              [weight]="FontWeight.MEDIUM"
            >
              {{ showcase.title }}
            </fl-text>
            <fl-text
              *ngIf="username"
              i18n="Owner label"
              [color]="FontColor.MID"
              [size]="TextSize.XSMALL"
            >
              by {{ username }}
            </fl-text>
          </fl-bit>
        </fl-bit>
      </fl-button>
    </fl-bit>
    <ng-template #loadingPortfolio>
      <fl-bit>
        <fl-bit class="PortfolioItemCard">
          <fl-loading-text
            class="PortfolioItemCard-loading"
            [padded]="false"
          ></fl-loading-text>
        </fl-bit>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./discover-portfolio-item-card.component.scss'],
})
export class DiscoverPortfolioItemCardComponent implements OnInit, OnChanges {
  CalloutPlacement = CalloutPlacement;
  CardBorderRadius = CardBorderRadius;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;
  FontColor = FontColor;
  FontWeight = FontWeight;
  TextSize = TextSize;
  IconColor = IconColor;
  IconSize = IconSize;

  isImage: boolean;
  iconName = 'ui-file';
  mobileThumbnail: string;
  nonMobileThumbnail: string;

  ready = false;
  isImageError = false;

  @Input() showcase: Showcase;
  @Input() username: string | undefined;
  @Input() subsection = '';
  @Input() lazyLoad = true;

  link: string;

  ngOnInit() {
    if (this.showcase) {
      this.link = `/portfolio-items/${this.showcase.portfolioItemPageSeoUrl}`;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('showcase' in changes && this.showcase) {
      if (this.showcase.coverItem) {
        const file = this.showcase.coverItem.itemFile.filename;
        this.isImage =
          isImageFile(file) ||
          this.showcase.coverItem.coverThumbnailUrl !== undefined;
        this.iconName = isPlayableVideoFile(file)
          ? 'ui-file-video'
          : isAudioFile(file)
          ? 'ui-file-audio'
          : 'ui-file';

        if (
          this.showcase.coverItem.coverThumbnailUrl &&
          isPlayableVideoFile(file)
        ) {
          this.mobileThumbnail = this.showcase.coverItem.coverThumbnailUrl;
          this.nonMobileThumbnail = this.showcase.coverItem.coverThumbnailUrl;
        } else {
          this.mobileThumbnail = this.getThumbnail(
            this.showcase.coverItem,
            true,
          );
          this.nonMobileThumbnail = this.getThumbnail(
            this.showcase.coverItem,
            false,
          );
        }
      }
    }
  }

  getThumbnail(showcaseItem: ShowcaseItem, isMobile: boolean = false) {
    if (
      isImageFile(showcaseItem.itemFile.filename) &&
      showcaseItem.itemFile.thumbnails
    ) {
      let thumbnail;
      if (isMobile) {
        thumbnail = this.pickMobileThumbnail(showcaseItem.itemFile.thumbnails);
      } else {
        thumbnail = this.pickNonMobileThumbnail(
          showcaseItem.itemFile.thumbnails,
        );
      }

      return thumbnail && thumbnail.cdnUrl
        ? thumbnail.cdnUrl
        : showcaseItem.itemFile.url;
    }
    return showcaseItem.itemFile.url;
  }

  pickMobileThumbnail(thumbnails: {
    readonly [type: string]: ShowcaseFileThumbnail;
  }): ShowcaseFileThumbnail | null {
    return (
      thumbnails.story || thumbnails.quotemodal || thumbnails.blog_cover || null
    );
  }

  // Non-mobile thumbnails are smaller because cards are tiled on the page. See T163317 for values
  pickNonMobileThumbnail(thumbnails: {
    readonly [type: string]: ShowcaseFileThumbnail;
  }): ShowcaseFileThumbnail | null {
    return (
      thumbnails.blog_category ||
      thumbnails.quote ||
      thumbnails.blog_homepage ||
      thumbnails.story ||
      thumbnails.quotemodal ||
      thumbnails.blog_cover ||
      null
    );
  }
}

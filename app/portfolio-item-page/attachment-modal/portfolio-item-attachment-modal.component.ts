import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import {
  Showcase,
  ShowcaseCollection,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { CarouselArrowPosition } from '@freelancer/ui/carousel';
import { HorizontalAlignment } from '@freelancer/ui/grid';
import { HeadingType } from '@freelancer/ui/heading';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import {
  LinkColor,
  LinkHoverColor,
  LinkUnderline,
  LinkWeight,
} from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { StickyBehaviour, StickyPosition } from '@freelancer/ui/sticky';
import {
  FontColor,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { CarouselScrollModes } from '../carousel/portfolio-carousel.types';
import { MediaViewItem } from '../media-view/portfolio-item-media-view.component';

@Component({
  template: `
    <fl-bit
      *ngIf="showcase$ | async as showcase"
      class="PortfolioItemAttachmentModal"
      flTrackingSection="PortfolioItemAttachmentModal"
    >
      <fl-bit
        class="PortfolioItemAttachmentModal-header"
        [flMarginRight]="Margin.NONE"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-bit class="PortfolioItemAttachmentModal-header-close">
          <fl-icon
            class="PortfolioItemAttachmentModal-closeIcon"
            label="Close Modal"
            i18n-label="Label for close attachment modal"
            [name]="'ui-close'"
            [size]="IconSize.SMALL"
            [color]="IconColor.MID"
            [hoverColor]="HoverColor.LIGHT"
            [flHideMobile]="true"
            [flMarginRight]="Margin.SMALL"
            [flMarginRightDesktop]="Margin.XLARGE"
            [flTrackingLabel]="'Header-CloseButton'"
            (click)="closeModal()"
          ></fl-icon
        ></fl-bit>
        <fl-grid [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER">
          <fl-col [col]="12" [colTablet]="10">
            <fl-grid class="PortfolioItemAttachmentModal-header-grid">
              <fl-col
                class="PortfolioItemAttachmentModal-header-info"
                [col]="12"
                [colTablet]="6"
                pull="left"
              >
                <fl-bit
                  class="PortfolioItemInfo"
                  [flMarginBottom]="
                    showcase.showcaseItems.length > 1
                      ? Margin.XSMALL
                      : Margin.NONE
                  "
                  [flMarginBottomTablet]="Margin.NONE"
                >
                  <fl-icon
                    class="PortfolioItemInfo-logo"
                    [name]="'ui-bird'"
                    [size]="IconSize.XXLARGE"
                    [color]="IconColor.LIGHT"
                    [flHideMobile]="true"
                    [flMarginRight]="Margin.SMALL"
                  ></fl-icon>
                  <fl-bit class="PortfolioItemInfo-details">
                    <fl-text
                      class="PortfolioItemInfo-details-title"
                      [color]="FontColor.LIGHT"
                      [size]="TextSize.MID"
                      [sizeDesktop]="TextSize.LARGE"
                      [weight]="FontWeight.LIGHT"
                    >
                      {{ showcase.title }}
                    </fl-text>
                    <fl-bit
                      *ngIf="owner$ | async as owner"
                      class="PortfolioItemInfo-details-user"
                    >
                      <fl-text
                        i18n="Byline text"
                        [color]="FontColor.LIGHT"
                        [size]="TextSize.SMALL"
                        [weight]="FontWeight.NORMAL"
                      >
                        by&nbsp;
                      </fl-text>
                      <fl-link
                        i18n="Portfolio item owner username"
                        [color]="LinkColor.LIGHT"
                        [size]="TextSize.SMALL"
                        [weight]="LinkWeight.BOLD"
                        [link]="'/u/' + owner.username"
                        [hoverColor]="LinkHoverColor.INHERIT"
                        [flTrackingLabel]="'Header-Username'"
                        [flTrackingReferenceId]="owner.id"
                        [flTrackingReferenceType]="'user_id'"
                      >
                        {{ owner.username }}
                      </fl-link>
                    </fl-bit>
                  </fl-bit>
                </fl-bit>
                <fl-bit>
                  <fl-icon
                    class="PortfolioItemAttachmentModal-closeIcon"
                    label="Close Modal"
                    i18n-label="Label for close attachment modal"
                    [name]="'ui-close'"
                    [size]="IconSize.SMALL"
                    [color]="IconColor.MID"
                    [hoverColor]="HoverColor.LIGHT"
                    [flHideTablet]="true"
                    [flHideDesktop]="true"
                    [flTrackingLabel]="'Header-CloseButton'"
                    (click)="closeModal()"
                  ></fl-icon>
                </fl-bit>
              </fl-col>
              <fl-col
                *ngIf="showcase.showcaseItems.length > 1"
                class="PortfolioItemCarousel"
                [col]="12"
                [colTablet]="6"
                [colDesktopLarge]="5"
                pull="right"
              >
                <app-portfolio-carousel
                  [flHideTablet]="true"
                  [flHideDesktopLarge]="true"
                  [currentIndex$]="currentIndex$"
                  [edgeShadows]="true"
                  [haveLoadingState]="false"
                  [numberOfElements]="4"
                  [padding]="4"
                  [selectedBorderWidth]="2"
                  [showcaseDoc]="showcaseDocument"
                  [sliderMode]="CarouselScrollModes.BOTHSIDEHALF"
                  [iconSizeTablet]="IconSize.MID"
                  [iconSizeDesktop]="IconSize.XLARGE"
                  [subsection]="'Header'"
                  (indexChange)="changeIndex($event)"
                ></app-portfolio-carousel>
                <app-portfolio-carousel
                  [flShowTablet]="true"
                  [currentIndex$]="currentIndex$"
                  [edgeShadows]="true"
                  [haveLoadingState]="false"
                  [iconSizeDesktop]="IconSize.XLARGE"
                  [iconSizeTablet]="IconSize.MID"
                  [itemAlignment]="TextAlign.RIGHT"
                  [numberOfElements]="4"
                  [padding]="4"
                  [selectedBorderWidth]="2"
                  [showcaseDoc]="showcaseDocument"
                  [sliderMode]="CarouselScrollModes.BOTHSIDEHALF"
                  [subsection]="'Header'"
                  (indexChange)="changeIndex($event)"
                ></app-portfolio-carousel>
                <app-portfolio-carousel
                  [flShowDesktopLarge]="true"
                  [currentIndex$]="currentIndex$"
                  [edgeShadows]="true"
                  [haveLoadingState]="false"
                  [iconSizeDesktop]="IconSize.XLARGE"
                  [iconSizeTablet]="IconSize.MID"
                  [itemAlignment]="TextAlign.RIGHT"
                  [numberOfElements]="5"
                  [padding]="4"
                  [selectedBorderWidth]="2"
                  [showcaseDoc]="showcaseDocument"
                  [sliderMode]="CarouselScrollModes.BOTHSIDEHALF"
                  [subsection]="'Header'"
                  (indexChange)="changeIndex($event)"
                ></app-portfolio-carousel>
              </fl-col>
            </fl-grid>
          </fl-col>
        </fl-grid>
      </fl-bit>
      <fl-hr
        class="PortfolioItemAttachmentModal-divider"
        [flMarginBottom]="Margin.SMALL"
      ></fl-hr>
      <fl-bit class="PortfolioItemAttachmentModal-body">
        <fl-bit
          *ngFor="let mediaViewItem of mediaViewItems; let i = index"
          class="PortfolioItemAttachmentModal-media"
          [flHide]="!((currentIndex$ | async) === i)"
        >
          <perfect-scrollbar
            *ngIf="
              mediaViewItem.isImage &&
                !(errorImageIds.indexOf(mediaViewItem.id) > -1);
              else nonSupported
            "
          >
            <fl-grid
              class="PortfolioItemAttachmentModal-body-grid"
              [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER"
            >
              <fl-col
                class="PortfolioItemAttachmentModal-body-grid-col"
                [col]="12"
                [colTablet]="10"
              >
                <app-portfolio-item-media-view-page
                  class="PortfolioItemAttachmentModal-media-item"
                  [mediaViewItem]="mediaViewItem"
                  [currentIndex$]="currentIndex$"
                  [portfolioItemPageSeoUrl]="
                    (showcase$ | async)?.portfolioItemPageSeoUrl
                  "
                  [includeDownload]="true"
                  [subsection]="'MediaView'"
                  (onImageError)="handleImageError($event)"
                  (onImageRefresh)="handleImageRefresh($event)"
                ></app-portfolio-item-media-view-page>
              </fl-col>
            </fl-grid>
          </perfect-scrollbar>
          <ng-template #nonSupported>
            <fl-grid
              class="PortfolioItemAttachmentModal-body-grid"
              [hAlign]="HorizontalAlignment.HORIZONTAL_CENTER"
            >
              <fl-col
                class="PortfolioItemAttachmentModal-body-grid-col"
                [col]="12"
                [colTablet]="10"
              >
                <app-portfolio-item-media-view-page
                  class="PortfolioItemAttachmentModal-media-item"
                  [mediaViewItem]="mediaViewItem"
                  [currentIndex$]="currentIndex$"
                  [portfolioItemPageSeoUrl]="
                    (showcase$ | async)?.portfolioItemPageSeoUrl
                  "
                  [subsection]="'MediaView'"
                  (onImageError)="handleImageError($event)"
                  (onImageRefresh)="handleImageRefresh($event)"
                ></app-portfolio-item-media-view-page>
              </fl-col>
            </fl-grid>
          </ng-template>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./portfolio-item-attachment-modal.component.scss'],
})
export class PortfolioItemAttachmentModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  IconSize = IconSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  TextSize = TextSize;
  TextAlign = TextAlign;
  HeadingType = HeadingType;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkWeight = LinkWeight;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  PictureObjectFit = PictureObjectFit;
  PictureDisplay = PictureDisplay;
  StickyPosition = StickyPosition;
  StickyBehaviour = StickyBehaviour;
  CarouselArrowPosition = CarouselArrowPosition;
  IconColor = IconColor;
  HoverColor = HoverColor;
  HorizontalAlignment = HorizontalAlignment;
  CarouselScrollModes = CarouselScrollModes;

  @Input() showcaseDocument: DatastoreDocument<ShowcaseCollection>;
  @Input() index: number;
  @Input() mediaViewItems: ReadonlyArray<MediaViewItem>;

  private currentIndexSubject$ = new Rx.BehaviorSubject<number>(0);
  currentIndex$ = this.currentIndexSubject$.asObservable();

  showcase$: Rx.Observable<Showcase>;
  showcaseId$: Rx.Observable<number>;

  owner$: Rx.Observable<User>;
  ownerId$: Rx.Observable<number>;

  errorImageIds: ReadonlyArray<Number> = [];

  constructor(
    private datastore: Datastore,
    private modalRef: ModalRef<PortfolioItemAttachmentModalComponent>,
  ) {}

  ngOnInit() {
    this.showcase$ = this.showcaseDocument.valueChanges();
    this.showcaseId$ = this.showcase$.pipe(map(showcase => showcase.id));
    this.ownerId$ = this.showcase$.pipe(map(showcase => showcase.userId));
    this.currentIndexSubject$.next(this.index);
    this.owner$ = this.datastore
      .document<UsersCollection>('users', this.ownerId$)
      .valueChanges();

    this.currentIndexSubject$.next(this.index);
  }

  @HostListener('document:keyup.arrowleft', ['$event'])
  keyLeft(event: KeyboardEvent) {
    const nextIndex = this.currentIndexSubject$.getValue() - 1;
    if (nextIndex >= 0) {
      this.changeIndex(nextIndex);
    }
  }

  @HostListener('document:keyup.arrowright', ['$event'])
  keyRight(event: KeyboardEvent) {
    const nextIndex = this.currentIndexSubject$.getValue() + 1;
    if (nextIndex < this.mediaViewItems.length) {
      this.changeIndex(nextIndex);
    }
  }

  @HostListener('document:keyup.escape', ['$event'])
  escape(event: KeyboardEvent) {
    this.closeModal();
  }

  closeModal() {
    this.modalRef.close(this.index);
  }

  changeIndex(index: number) {
    this.currentIndexSubject$.next(index);
    this.index = index;
  }

  handleImageError(id: number) {
    this.errorImageIds = [...this.errorImageIds, id];
  }

  handleImageRefresh(id: number) {
    this.errorImageIds = this.errorImageIds.filter(itemId => itemId !== id);
  }
}

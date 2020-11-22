import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  BackendSuccessResponse,
  BackendUpdateResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  CartsCollection,
  ContestEntryAction,
  ContestViewContest,
  ContestViewEntriesCollection,
  ContestViewEntry,
  User,
} from '@freelancer/datastore/collections';
import {
  PartialPaymentsCartItem,
  PaymentsCart,
} from '@freelancer/payments-cart';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import {
  RibbonColor,
  RibbonOrientation,
  RibbonPlacement,
} from '@freelancer/ui/ribbon';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { ThumbnailViewerImage } from '@freelancer/ui/thumbnail-viewer';
import { EntryStatusApi } from 'api-typings/contests/contests';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';

@Component({
  selector: 'app-contest-multi-award-modal',
  template: `
    <fl-bit
      class="MultiAwardModal"
      flTrackingSection="ContestViewPage.MultiAwardModal"
    >
      <fl-heading
        i18n="Multi award modal title"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Award these Entries
      </fl-heading>

      <fl-thumbnail-viewer
        class="MultiAwardThumbnails"
        [images]="thumbnails"
        [currentIndex]="currentEntryIndex"
        [slidesToShow]="THUMBNAIL_LIMIT"
        [flMarginBottom]="Margin.SMALL"
        (slideChange)="onSlideChange($event)"
      ></fl-thumbnail-viewer>

      <ng-container *ngIf="entries[currentEntryIndex] as entry">
        <ng-container *ngIf="freelancers[currentEntryIndex] as freelancer">
          <fl-bit class="ModalEntryDetails" [flMarginBottom]="Margin.SMALL">
            <fl-text
              i18n="Multi award modal entry number"
              [flMarginRight]="Margin.XXXSMALL"
            >
              #{{ entry.number }}
            </fl-text>
            <fl-username
              displayName=""
              flTrackingLabel="GoToFreelancerProfile"
              flTrackingReferenceType="freelancer_id"
              flTrackingReferenceId="{{ freelancer?.id }}"
              [link]="freelancer?.profileUrl"
              [newTab]="true"
              [username]="freelancer?.username"
            ></fl-username>
          </fl-bit>

          <fl-bit class="EntryImageContainer" [flMarginBottom]="Margin.XSMALL">
            <fl-ribbon
              class="Card-ribbon"
              *ngIf="currentEntryIndex === 0"
              iconLabel="Awarded"
              [color]="RibbonColor.SECONDARY"
              [icon]="'ui-trophy'"
              [orientation]="RibbonOrientation.VERTICAL"
              [placement]="RibbonPlacement.LEFT"
            ></fl-ribbon>
            <fl-ribbon
              *ngIf="currentEntryIndex !== 0"
              [placement]="RibbonPlacement.LEFT"
              [color]="RibbonColor.QUATERNARY"
            >
              {{
                entry?.sellPrice || contest?.prize
                  | flCurrency: contest?.currency.code:false:false
              }}
            </fl-ribbon>
            <fl-picture
              alt="Entry image"
              i18n-alt="Alt text for an contest entry thumbnail"
              class="EntryImageContainer-image"
              [boundedWidth]="true"
              [display]="PictureDisplay.BLOCK"
              [externalSrc]="true"
              [src]="entry.files[0]?.thumbnail900Url"
              [objectFit]="PictureObjectFit.SCALE_DOWN"
            ></fl-picture>
          </fl-bit>
        </ng-container>
      </ng-container>

      <fl-text
        i18n="Multi award modal total price"
        [weight]="FontWeight.BOLD"
        [flMarginBottom]="Margin.SMALL"
      >
        Total: {{ totalPrice | flCurrency: contest?.currency.code }}
      </fl-text>

      <fl-text
        i18n="Multi award modal information text"
        [color]="FontColor.MID"
        [size]="TextSize.XXSMALL"
        [flMarginBottom]="Margin.XSMALL"
      >
        You will be redirected to process this payment.
      </fl-text>

      <fl-button
        i18n="Multi award modal award button label"
        flTrackingLabel="MultiAwardEntries"
        flTrackingReferenceType="contest_id"
        flTrackingReferenceId="{{ contest.id }}"
        flTrackingConversion="Award Contest Entries"
        [flMarginBottom]="Margin.XSMALL"
        [color]="ButtonColor.PRIMARY_PINK"
        [display]="'block'"
        [busy]="
          (awardEntryPromise && !(awardEntryPromise | async)) ||
          (buyEntriesPromise && !(buyEntriesPromise | async))
        "
        (click)="onMultiAwardEntries()"
      >
        Award Entries
      </fl-button>

      <fl-bit
        [flHide]="
          !awardEntryPromise ||
          (awardEntryPromise &&
            !((awardEntryPromise | async)?.status === 'error'))
        "
      >
        <ng-container *ngIf="awardEntryPromise | async as response">
          <app-entry-update-error
            *ngIf="response.status !== 'success'"
            [response]="response"
            [source]="ContestEntryAction.AWARD"
            [entry]="awardedEntry"
          ></app-entry-update-error>
        </ng-container>
      </fl-bit>

      <!-- Hide buy errors when there's both buy and award errors to make sure only one error message displays -->
      <fl-bit
        [flHide]="
          (awardEntryPromise &&
            !!((awardEntryPromise | async)?.status === 'error')) ||
          !buyEntriesPromise ||
          (buyEntriesPromise &&
            !((buyEntriesPromise | async)?.status === 'error'))
        "
      >
        <ng-container *ngIf="buyEntriesPromise | async as response">
          <app-entry-update-error
            *ngIf="response.status !== 'success'"
            [response]="response"
            [source]="ContestEntryAction.BUY"
          ></app-entry-update-error>
        </ng-container>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./contest-multi-award-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestMultiAwardModalComponent implements OnInit {
  ButtonColor = ButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;
  RibbonColor = RibbonColor;
  RibbonOrientation = RibbonOrientation;
  RibbonPlacement = RibbonPlacement;

  ContestEntryAction = ContestEntryAction;

  @Input() contest: ContestViewContest;
  @Input() entries: ReadonlyArray<ContestViewEntry>;
  @Input() freelancers: ReadonlyArray<User>;

  readonly THUMBNAIL_LIMIT = 5;

  currentEntryIndex = 0;
  totalPrice = 0;
  thumbnails: ReadonlyArray<ThumbnailViewerImage> = [];
  awardedEntry: ContestViewEntry;
  buyEntriesDetails: ReadonlyArray<{
    entry: ContestViewEntry;
    sellPrice: number;
  }>;
  awardEntryPromise: Promise<
    BackendUpdateResponse<ContestViewEntriesCollection>
  >;
  buyEntriesPromise: Promise<
    BackendSuccessResponse | BackendUpdateResponse<CartsCollection>
  >;

  constructor(private datastore: Datastore, private cart: PaymentsCart) {}

  ngOnInit() {
    let buyEntries: ReadonlyArray<ContestViewEntry>;

    // The first entry on the list is awarded, the rest of the entries are bought
    [this.awardedEntry, ...buyEntries] = this.entries;

    this.buyEntriesDetails = buyEntries.map(entry => {
      let amount = 0;

      if (entry.sellPrice) {
        amount = entry.sellPrice;
      } else if (this.contest.prize) {
        amount = this.contest.prize;
      }

      return { entry, sellPrice: amount };
    });

    this.thumbnails = this.getThumbnails();
    this.totalPrice = this.getTotalPrice();
  }

  getThumbnails() {
    return this.entries.map(entry => ({
      src: entry.files[0].thumbnail80Url || '',
      alt: ' ',
    }));
  }

  getTotalPrice() {
    return this.buyEntriesDetails
      .map(entryDetails => entryDetails.sellPrice)
      .reduce((totalAmount, entrySellPrice) => totalAmount + entrySellPrice);
  }

  onMultiAwardEntries() {
    if (!this.contest.isPrizeAutodistributed) {
      const entryDoc = this.datastore.document<ContestViewEntriesCollection>(
        'contestViewEntries',
        this.awardedEntry.id,
      );

      this.awardEntryPromise = entryDoc
        .update({
          status: EntryStatusApi.WON,
        })
        .catch(e => ({
          status: 'error',
          errorCode: 'UNKNOWN_ERROR',
          ...e,
        }));

      this.awardEntryPromise
        .then(awardResponse => {
          if (awardResponse.status !== 'success') {
            throw awardResponse;
          }
          return this.buyEntriesDetails.map(entryDetails =>
            this.transformEntryToCartItem(
              entryDetails.entry,
              entryDetails.sellPrice,
            ),
          );
        })
        .then(
          cartItems =>
            (this.buyEntriesPromise = this.cart.handle(
              `Multiaward for  ${this.contest.id}`,
              {
                destination: DestinationApi.CONTEST_VIEW_PAGE,
                payload: `${this.contest.id}`,
              },
              cartItems,
            )),
        );
    }
  }

  transformEntryToCartItem(
    entry: ContestViewEntry,
    amount: number,
  ): PartialPaymentsCartItem {
    return {
      contextType: ContextTypeApi.CONTEST_ENTRY_BUY,
      contextId: `${entry.id}`,
      description: `Buy Entry #${entry.number}`,
      currencyId: this.contest.currency.id,
      amount,
    };
  }

  onSlideChange(index: number) {
    this.currentEntryIndex = index;
  }
}

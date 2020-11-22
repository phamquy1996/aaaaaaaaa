import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  BackendPushResponse,
  BackendSuccessResponse,
} from '@freelancer/datastore';
import {
  CartsCollection,
  ContestEntryAction,
  ContestEntryOffer,
  ContestViewContest,
  ContestViewEntry,
  CONTEST_ENTRY_AWARD_STATUSES,
  User,
} from '@freelancer/datastore/collections';
import { PaymentsCart } from '@freelancer/payments-cart';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { RibbonColor, RibbonPlacement } from '@freelancer/ui/ribbon';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { EntryStatusApi } from 'api-typings/contests/contests';
import { ContextTypeApi, DestinationApi } from 'api-typings/payments/payments';
import { ContestBuyModalResponse } from './contest-buy-modal.types';

@Component({
  selector: 'app-contest-buy-modal',
  template: `
    <fl-bit class="BuyModal" flTrackingSection="ContestViewPage.BuyModal">
      <fl-heading
        i18n="Buy modal title"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Buy this Entry
      </fl-heading>

      <fl-bit class="ModalEntryDetails" [flMarginBottom]="Margin.SMALL">
        <fl-text
          i18n="Buy modal entry number"
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
          [placement]="RibbonPlacement.LEFT"
          [color]="RibbonColor.QUATERNARY"
        >
          {{ sellPrice | flCurrency: contest.currency.code:false:false }}
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

      <fl-text
        i18n="Buy modal total price"
        [weight]="FontWeight.BOLD"
        [flMarginBottom]="Margin.SMALL"
      >
        Total: {{ sellPrice | flCurrency: contest.currency.code }}
      </fl-text>

      <fl-text
        i18n="Buy modal information text"
        [color]="FontColor.MID"
        [size]="TextSize.XXSMALL"
        [flMarginBottom]="Margin.XSMALL"
      >
        You will be redirected to process this payment.
      </fl-text>

      <fl-button
        i18n="Buy modal buy button label"
        flTrackingLabel="BuyEntry"
        flTrackingReferenceType="entry_id"
        flTrackingReferenceId="{{ entry.id }}"
        [color]="ButtonColor.PRIMARY_PINK"
        [display]="'block'"
        [flMarginBottom]="Margin.XSMALL"
        [busy]="buyPromise && (buyPromise | async) === null"
        [disabled]="!canBuyEntry"
        (click)="onBuyEntry()"
      >
        Buy Entry
      </fl-button>

      <ng-container *ngIf="buyPromise | async as response">
        <app-entry-update-error
          *ngIf="response.status !== 'success' && response.errorCode"
          [response]="response"
          [source]="ContestEntryAction.BUY"
          [entry]="entry"
        ></app-entry-update-error>
      </ng-container>

      <fl-bit *ngIf="!hasContestAwardedEntry" class="ErrorMessageContainer">
        <fl-icon
          [name]="'ui-warning-v2'"
          [color]="IconColor.ERROR"
          [size]="IconSize.SMALL"
          [flMarginRight]="Margin.XXXSMALL"
        ></fl-icon>
        <fl-text
          i18n="Contest not awarded error message"
          [color]="FontColor.ERROR"
        >
          You must award a winner before you can buy additional entries.
          <fl-link
            flTrackingLabel="AwardEntry"
            flTrackingReferenceType="entry_id"
            flTrackingReferenceId="{{ entry.id }}"
            (click)="onAwardEntry()"
          >
            Award this entry as winner?
          </fl-link>
        </fl-text>
      </fl-bit>

      <fl-bit *ngIf="isEntryBought" class="ErrorMessageContainer">
        <fl-icon
          [name]="'ui-warning-v2'"
          [color]="IconColor.ERROR"
          [size]="IconSize.SMALL"
          [flMarginRight]="Margin.XXXSMALL"
        ></fl-icon>
        <fl-text
          i18n="Entry is already bought error message"
          [color]="FontColor.ERROR"
        >
          You have already bought this entry
        </fl-text>
      </fl-bit>

      <fl-bit *ngIf="isEntryAwarded" class="ErrorMessageContainer">
        <fl-icon
          [name]="'ui-warning-v2'"
          [color]="IconColor.ERROR"
          [size]="IconSize.SMALL"
          [flMarginRight]="Margin.XXXSMALL"
        ></fl-icon>
        <fl-text
          i18n="Entry is already awarded error message"
          [color]="FontColor.ERROR"
        >
          You have already awarded this entry as the winner
        </fl-text>
      </fl-bit>

      <fl-bit
        *ngIf="this.currentOffer && !this.currentOffer?.accepted && canBuyEntry"
        class="ErrorMessageContainer"
      >
        <fl-icon
          [name]="'ui-warning-alt-v2'"
          [color]="IconColor.CONTEST"
          [size]="IconSize.SMALL"
          [flMarginRight]="Margin.XXXSMALL"
        ></fl-icon>
        <fl-text i18n="Entry already has an offer" [color]="FontColor.WARNING">
          You have a pending offer on this entry for
          {{
            currentOffer?.priceOffer
              | flCurrency: contest.currency.code:false:false
          }}.

          <fl-link
            flTrackingLabel="ChatWithFreelancer"
            flTrackingReferenceType="entry_id"
            flTrackingReferenceId="{{ entry.id }}"
            (click)="onChatWithFreelancer()"
          >
            Chat with {{ freelancer?.displayName }}
          </fl-link>
        </fl-text>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./contest-buy-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestBuyModalComponent implements OnInit {
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
  RibbonPlacement = RibbonPlacement;

  ContestEntryAction = ContestEntryAction;
  EntryStatusApi = EntryStatusApi;

  @Input() contest: ContestViewContest;
  @Input() entry: ContestViewEntry;
  @Input() freelancer: User;
  @Input() hasContestAwardedEntry: boolean;
  @Input() currentOffer?: ContestEntryOffer;

  buyPromise: Promise<
    BackendSuccessResponse | BackendPushResponse<CartsCollection>
  >;

  sellPrice: number | null;
  isEntryBought: boolean;
  isEntryAwarded: boolean;
  canBuyEntry: boolean;

  constructor(
    private cart: PaymentsCart,
    private modalRef: ModalRef<ContestBuyModalComponent>,
  ) {}

  ngOnInit() {
    const entryPrice = this.entry.sellPrice || this.contest.prize;
    if (entryPrice) {
      this.sellPrice = entryPrice;
    } else {
      this.sellPrice = null;
    }

    this.isEntryBought = this.entry.status === EntryStatusApi.BOUGHT;
    this.isEntryAwarded = CONTEST_ENTRY_AWARD_STATUSES.includes(
      this.entry.status,
    );

    this.canBuyEntry =
      !this.isEntryBought &&
      !this.isEntryAwarded &&
      this.hasContestAwardedEntry;
  }

  onBuyEntry() {
    if (!this.sellPrice) {
      throw new Error(`Invalid amount for buying entry ${this.entry.id}`);
    }

    this.buyPromise = this.cart.handle(
      `Buy entry ${this.entry.id} from contest ${this.contest.id}`,
      {
        destination: DestinationApi.CONTEST_ENTRY_HANDOVER_PAGE,
        payload: `${this.entry.id}`,
      },
      [
        {
          contextType: ContextTypeApi.CONTEST_ENTRY_BUY,
          contextId: `${this.entry.id}`,
          description: `Entry #${this.entry.number}`,
          currencyId: this.contest.currency.id,
          amount: this.sellPrice,
        },
      ],
    );
  }

  onAwardEntry() {
    this.modalRef.close(ContestBuyModalResponse.AWARD_ENTRY);
  }

  onChatWithFreelancer() {
    this.modalRef.close(ContestBuyModalResponse.START_CHAT);
  }
}

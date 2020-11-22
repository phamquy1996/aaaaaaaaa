import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  BackendPushResponse,
  BackendUpdateResponse,
  Datastore,
} from '@freelancer/datastore';
import {
  ContestBudgetRange,
  ContestEntryOffer,
  ContestEntryOffersCollection,
  ContestViewContest,
  ContestViewEntry,
  User,
} from '@freelancer/datastore/collections';
import { FreelancerCurrencyPipe } from '@freelancer/pipes';
import { ModalRef } from '@freelancer/ui';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import {
  maxValue,
  minValue,
  required,
  wholeNumber,
} from '@freelancer/ui/validators';
import { toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-contest-make-offer-modal',
  template: `
    <fl-bit class="MakeOfferModal" flTrackingSection="MakeOfferModal">
      <fl-heading
        i18n="Make offer modal title"
        [headingType]="HeadingType.H2"
        [size]="TextSize.MID"
        [flMarginBottom]="Margin.SMALL"
      >
        Make Offer
      </fl-heading>
      <fl-grid [flMarginBottom]="Margin.MID">
        <fl-col
          [col]="12"
          [colTablet]="6"
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.NONE"
        >
          <fl-bit
            class="MakeOfferModal-entryDetails"
            [flMarginBottom]="Margin.XXXSMALL"
          >
            <fl-text
              i18n="Make offer modal entry number"
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
          <fl-bit class="EntryImageContainer">
            <fl-picture
              alt="Entry image"
              i18n-alt="Alt text for a contest entry thumbnail"
              class="EntryImageContainer-image"
              [boundedWidth]="true"
              [display]="PictureDisplay.BLOCK"
              [externalSrc]="true"
              [src]="entry.files[0]?.thumbnail900Url"
              [objectFit]="PictureObjectFit.SCALE_DOWN"
            ></fl-picture>
          </fl-bit>
        </fl-col>
        <fl-col [col]="12" [colTablet]="6">
          <fl-text
            i18n="Make offer modal description"
            [flMarginBottom]="Margin.SMALL"
          >
            Make an offer from
            <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
              {{
                contestBudgetRange.minimum
                  | flCurrency: contest?.currency.code:false:false
              }}
            </fl-text>
            to
            <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD">
              {{
                contest?.prize | flCurrency: contest?.currency.code:false:false
              }}
            </fl-text>
            or buy this entry from
            <fl-link
              flTrackingLabel="GoToFreelancerProfile"
              flTrackingReferenceType="freelancer_id"
              flTrackingReferenceId="{{ freelancer?.id }}"
              [link]="freelancer?.profileUrl"
            >
              @{{ freelancer?.username }}
            </fl-link>
          </fl-text>

          <fl-input
            i18n-placeholder="Make offer price placeholder"
            placeholder="0.00"
            flTrackingLabel="MakeOfferPrice"
            [flMarginBottom]="Margin.XXXSMALL"
            [control]="offerPriceControl"
            [type]="InputType.NUMBER"
            [beforeLabel]="contest?.currency.sign"
            [afterLabel]="contest?.currency.code"
          ></fl-input>

          <fl-text
            i18n="Make offer price input description"
            [flMarginBottom]="Margin.SMALL"
            [color]="
              offerPriceControl.invalid ? FontColor.ERROR : FontColor.MID
            "
          >
            Enter an amount from
            {{
              contestBudgetRange.minimum
                | flCurrency: contest?.currency.code:false:false
            }}
            -
            {{
              contest?.prize | flCurrency: contest?.currency.code:false:false
            }}
          </fl-text>

          <fl-heading
            i18n="Make offer message title"
            [headingType]="HeadingType.H2"
            [size]="TextSize.SMALL"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Message
          </fl-heading>
          <fl-textarea
            i18n-placeholder="Make offer message placeholder text"
            placeholder="Enter a message"
            flTrackingLabel="MakeOfferMessage"
            [rows]="5"
            [control]="messageControl"
          ></fl-textarea>
        </fl-col>
      </fl-grid>
      <fl-bit class="MakeOfferModal-ctas">
        <fl-button
          i18n="Cancel button"
          flTrackingLabel="ClickCancelButton"
          [color]="ButtonColor.DEFAULT"
          [size]="ButtonSize.SMALL"
          [flMarginRight]="Margin.SMALL"
          (click)="handleCancelClick()"
        >
          Cancel
        </fl-button>
        <fl-button
          i18n="Make offer button"
          flTrackingLabel="ClickMakeOfferButton"
          [busy]="makeOfferResponse$ && (makeOfferResponse$ | async) === null"
          [disabled]="offerPriceControl.invalid"
          [color]="ButtonColor.PRIMARY_PINK"
          [size]="ButtonSize.SMALL"
          (click)="handleMakeOfferClick()"
        >
          Make Offer
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./contest-make-offer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestMakeOfferModalComponent implements OnInit, OnDestroy {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  InputType = InputType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;
  TextSize = TextSize;

  @Input() entry: ContestViewEntry;
  @Input() freelancer: User;
  @Input() contest: ContestViewContest;
  @Input() contestBudgetRange: ContestBudgetRange;
  @Input() currentOffer?: ContestEntryOffer;

  offerPriceControl: FormControl;
  messageControl: FormControl;
  makeOfferResponse$: Promise<
    | BackendPushResponse<ContestEntryOffersCollection>
    | BackendUpdateResponse<ContestEntryOffersCollection>
  >;
  offerPriceControlSubscription?: Rx.Subscription;

  constructor(
    private modalRef: ModalRef<ContestMakeOfferModalComponent>,
    private datastore: Datastore,
    private currencyPipe: FreelancerCurrencyPipe,
  ) {}

  ngOnInit() {
    this.messageControl = new FormControl();

    this.offerPriceControl = new FormControl(
      this.currentOffer
        ? this.currentOffer.priceOffer
        : this.entry.sellPrice
        ? this.entry.sellPrice
        : this.contestBudgetRange.minimum,
      Validators.compose([
        required(''),
        wholeNumber(''),
        minValue(this.contestBudgetRange.minimum, ''),
        maxValue(
          this.contest.prize
            ? this.contest.prize
            : this.contestBudgetRange.maximum,
          '',
        ),
      ]),
    );

    const offerPrice$ = this.offerPriceControl.valueChanges.pipe(
      startWith(this.offerPriceControl.value),
      map(price => toNumber(price)),
    );

    this.offerPriceControlSubscription = offerPrice$.subscribe(price => {
      if (price && (!this.messageControl.dirty || !this.messageControl.value)) {
        this.messageControl.reset(this.getOfferMessage(price));
      }
    });
  }

  handleCancelClick() {
    this.modalRef.close();
  }

  handleMakeOfferClick() {
    const price = parseFloat(this.offerPriceControl.value);
    if (!/\S/.test(this.messageControl.value)) {
      this.messageControl.setValue(this.getOfferMessage(price));
    }

    if (this.currentOffer) {
      this.makeOfferResponse$ = this.datastore
        .document<ContestEntryOffersCollection>(
          'contestEntryOffers',
          this.currentOffer.id,
        )
        .update({
          ...this.currentOffer,
          priceOffer: price,
          extraForPostAndUpdate: {
            message: this.messageControl.value,
          },
        });
    } else {
      this.makeOfferResponse$ = this.datastore
        .collection<ContestEntryOffersCollection>('contestEntryOffers')
        .push({
          entryId: this.entry.id,
          priceOffer: price,
          extraForPostAndUpdate: {
            message: this.messageControl.value,
          },
        });
    }
    this.makeOfferResponse$.then(res => {
      if (res.status === 'success') {
        this.modalRef.close();
      }
    });
  }

  getOfferMessage(price: number) {
    const formattedOffer = this.currencyPipe.transform(
      price,
      this.contest.currency.code,
      false,
      false,
    );
    return this.currentOffer
      ? `I'm changing my offer to ${formattedOffer} for Entry #${this.entry.number}. Do you accept?`
      : `Hi, I'd like to buy your Entry ${this.entry.number} on my contest for ${formattedOffer}. We can discuss further on chat.`;
  }

  ngOnDestroy() {
    if (this.offerPriceControlSubscription) {
      this.offerPriceControlSubscription.unsubscribe();
    }
  }
}

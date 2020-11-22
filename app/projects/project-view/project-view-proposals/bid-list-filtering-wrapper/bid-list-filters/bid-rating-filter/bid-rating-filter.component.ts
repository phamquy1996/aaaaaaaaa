import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { RatingType } from '@freelancer/ui/rating';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import { BidListFilters } from '../../bid-list-filtering-wrapper.types';

@Component({
  selector: 'app-bid-rating-filter',
  template: `
    <fl-bit [flMarginBottom]="Margin.MID">
      <fl-grid
        [flMarginBottom]="Margin.XXSMALL"
        [flMarginBottomTablet]="Margin.NONE"
      >
        <fl-col [col]="8" [colTablet]="6">
          <fl-text
            i18n="Bid rating text"
            [weight]="FontWeight.MEDIUM"
            [size]="TextSize.SMALL"
            [flMarginBottomTablet]="Margin.XXXSMALL"
          >
            Your bid rating
          </fl-text>
          <fl-text
            i18n="Bid rating text filter"
            [color]="FontColor.MID"
            [flHideMobile]="true"
          >
            Display bids according to the rating you provided.
          </fl-text>
        </fl-col>
        <fl-col [col]="4" [colTablet]="6">
          <fl-bit class="BidRatingFilter">
            <fl-rating
              *ngIf="isFormControl(control)"
              flTrackingLabel="BidRating"
              [control]="control"
              [hideValue]="true"
              [type]="RatingType.TICKS"
              [size]="IconSize.LARGE"
              (click)="filterChanged.emit()"
            ></fl-rating>
          </fl-bit>
        </fl-col>
      </fl-grid>
      <fl-text
        i18n="Bid rating text filter"
        [color]="FontColor.MID"
        [flShowMobile]="true"
      >
        Display bids according to the rating you provided.
      </fl-text>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bid-rating-filter.component.scss'],
})
export class BidRatingFilterComponent implements OnInit {
  BidListFilters = BidListFilters;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconSize = IconSize;
  isFormControl = isFormControl;
  Margin = Margin;
  RatingType = RatingType;
  TextSize = TextSize;

  @Input() group: FormGroup;
  @Output() filterChanged = new EventEmitter();

  control: AbstractControl;

  ngOnInit() {
    const control = this.group.get(BidListFilters.BID_RATING);
    if (!control) {
      throw new Error('Bid Rating not found');
    }
    this.control = control;
  }
}

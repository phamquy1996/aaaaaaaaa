import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { SliderLabelPosition } from '@freelancer/ui/slider';
import { FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import {
  BidListFilters,
  UserReviewsSlider,
} from '../../bid-list-filtering-wrapper.types';

@Component({
  selector: 'app-bid-reviews-filter',
  template: `
    <fl-grid [flMarginBottom]="Margin.MID">
      <fl-col [col]="12" [colTablet]="6">
        <fl-text
          i18n="Bid reviews filter"
          [weight]="FontWeight.MEDIUM"
          [size]="TextSize.SMALL"
        >
          Reviews received
        </fl-text>
      </fl-col>
      <fl-col [col]="12" [colTablet]="6">
        <fl-slider
          *ngIf="isFormControl(minControl)"
          class="BidReviewsFilter-slider"
          flTrackingLabel="BidReviewsFilterSlider"
          [minValue]="userReviewsSlider?.minValue"
          [maxValue]="userReviewsSlider?.maxValue"
          [minControl]="minControl"
          [labelPosition]="SliderLabelPosition.NONE"
          (mousedown)="filterChanged.emit()"
        ></fl-slider>
        <fl-text [textAlign]="TextAlign.CENTER" [size]="TextSize.SMALL">
          <ng-container
            *ngIf="
              minControl.value > userReviewsSlider?.minValue;
              else anyReviewsLabel
            "
            i18n="Reviews slider label"
          >
            {{ minControl.value
            }}{{
              minControl.value === userReviewsSlider?.maxValue
                ? minControl.value === 1
                  ? ' Review'
                  : ' Reviews'
                : '+ Reviews'
            }}
          </ng-container>
          <ng-template #anyReviewsLabel>
            <ng-container i18n="Any reviews label">
              Any
            </ng-container>
          </ng-template>
        </fl-text>
      </fl-col>
    </fl-grid>

    <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bid-reviews-filter.component.scss'],
})
export class BidReviewsFilterComponent implements OnInit {
  BidListFilters = BidListFilters;
  FontWeight = FontWeight;
  isFormControl = isFormControl;
  Margin = Margin;
  SliderLabelPosition = SliderLabelPosition;
  TextAlign = TextAlign;
  TextSize = TextSize;

  @Input() group: FormGroup;
  @Input() userReviewsSlider: UserReviewsSlider;
  @Output() filterChanged = new EventEmitter();

  minControl: AbstractControl;

  ngOnInit() {
    const minControl = this.group.get(BidListFilters.USER_REVIEWS_MIN);
    if (!minControl) {
      throw new Error('Min Control not found');
    }
    this.minControl = minControl;
  }
}

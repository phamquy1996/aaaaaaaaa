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
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { ToggleSize } from '@freelancer/ui/toggle';
import { isFormControl } from '@freelancer/utils';
import { BidListFilters } from '../../bid-list-filtering-wrapper.types';

@Component({
  selector: 'app-bid-freelancer-portfolio-filter',
  template: `
    <fl-bit [flMarginBottom]="Margin.MID">
      <fl-grid
        [flMarginBottom]="Margin.XXSMALL"
        [flMarginBottomTablet]="Margin.NONE"
      >
        <fl-col [col]="8" [colTablet]="6">
          <fl-text
            i18n="Bid freelancer portfolio filter"
            [weight]="FontWeight.MEDIUM"
            [size]="TextSize.SMALL"
            [flMarginBottomTablet]="Margin.XXXSMALL"
          >
            Freelancer has portfolio
          </fl-text>
          <fl-text
            i18n="Bid freelancer portfolio text filter"
            [color]="FontColor.MID"
            [flHideMobile]="true"
          >
            Display freelancers with examples of their work on their profile.
          </fl-text>
        </fl-col>
        <fl-col [col]="4" [colTablet]="6">
          <fl-bit class="BidFreelancerPortfolioFilter">
            <fl-toggle
              *ngIf="isFormControl(control)"
              flTrackingLabel="BidFreelancerPortfolioToggle"
              [forListItem]="true"
              [size]="ToggleSize.MID"
              [control]="control"
              (click)="filterChanged.emit()"
            ></fl-toggle>
          </fl-bit>
        </fl-col>
      </fl-grid>
      <fl-text
        i18n="Bid freelancer portfolio text filter"
        [color]="FontColor.MID"
        [flShowMobile]="true"
      >
        Display freelancers with examples of their work on their profile.
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./bid-freelancer-portfolio-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidFreelancerPortfolioFilterComponent implements OnInit {
  BidListFilters = BidListFilters;
  FontColor = FontColor;
  FontWeight = FontWeight;
  isFormControl = isFormControl;
  Margin = Margin;
  TextSize = TextSize;
  ToggleSize = ToggleSize;

  @Input() group: FormGroup;
  @Output() filterChanged = new EventEmitter();

  control: AbstractControl;

  ngOnInit() {
    const control = this.group.get(BidListFilters.USER_PORTFOLIO);
    if (!control) {
      throw new Error('Control not found');
    }
    this.control = control;
  }
}

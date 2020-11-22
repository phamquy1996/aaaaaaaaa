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
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { ToggleSize } from '@freelancer/ui/toggle';
import { isFormControl } from '@freelancer/utils';
import { BidListFilters } from '../../bid-list-filtering-wrapper.types';

@Component({
  selector: 'app-bid-online-offline-filter',
  template: `
    <fl-grid [flMarginBottom]="Margin.MID">
      <fl-col [col]="8" [colTablet]="6">
        <fl-text
          i18n="Bid online offline filter"
          [weight]="FontWeight.MEDIUM"
          [size]="TextSize.SMALL"
        >
          Online right now
        </fl-text>
      </fl-col>
      <fl-col [col]="4" [colTablet]="6">
        <fl-bit class="BidOnlineOfflineFilter">
          <fl-toggle
            *ngIf="isFormControl(control)"
            flTrackingLabel="BidOnlineOfflineFilter"
            [forListItem]="true"
            [size]="ToggleSize.MID"
            [control]="control"
            (click)="filterChanged.emit()"
          ></fl-toggle>
        </fl-bit>
      </fl-col>
    </fl-grid>
  `,
  styleUrls: ['./bid-online-offline-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidOnlineOfflineFilterComponent implements OnInit {
  BidListFilters = BidListFilters;
  FontWeight = FontWeight;
  isFormControl = isFormControl;
  Margin = Margin;
  TextSize = TextSize;
  ToggleSize = ToggleSize;

  @Input() group: FormGroup;
  @Output() filterChanged = new EventEmitter();

  control: AbstractControl;

  ngOnInit() {
    const control = this.group.get(BidListFilters.USER_ONLINE);
    if (!control) {
      throw new Error('Control not found');
    }
    this.control = control;
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CheckboxSize } from '@freelancer/ui/checkbox';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-country-filter-list-item',
  template: `
    <fl-bit
      class="CountryListItem-content"
      flTrackingLabel="CountryFilterOption"
      [ngClass]="{ HasHoverState: true }"
      (click)="onClick()"
    >
      <fl-bit class="CountryListItem-content-checkbox">
        <fl-checkbox
          flTrackingLabel="CountryFilterOptionCheckbox"
          [control]="control"
          [forListItem]="true"
          [size]="CheckboxSize.LARGE"
        ></fl-checkbox>
      </fl-bit>

      <fl-bit class="CountryListItem-content-label">
        <fl-text
          [flMarginRightTablet]="Margin.XXXSMALL"
          [size]="TextSize.SMALL"
        >
          {{ country }}
        </fl-text>
        <fl-text [flHideMobile]="true" [size]="TextSize.SMALL">
          ({{ count }})
        </fl-text>
        <fl-text [flShowMobile]="true" [size]="TextSize.SMALL">
          {{ count }}
        </fl-text>
      </fl-bit>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./country-filter-list-item.component.scss'],
})
export class CountryFilterListItemComponent {
  CheckboxSize = CheckboxSize;
  Margin = Margin;
  TextSize = TextSize;

  @Input() control: FormControl;
  @Input() country: string;
  @Input() count: number;

  onClick() {
    this.control.setValue(!this.control.value);
    this.control.markAsDirty();
  }
}

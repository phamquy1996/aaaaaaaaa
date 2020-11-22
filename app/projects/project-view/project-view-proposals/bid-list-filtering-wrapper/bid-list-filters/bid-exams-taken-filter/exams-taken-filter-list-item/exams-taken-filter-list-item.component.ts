import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CheckboxSize } from '@freelancer/ui/checkbox';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-exams-taken-filter-list-item',
  template: `
    <fl-bit
      class="ExamsTakenListItem-content"
      flTrackingLabel="CountryFilterOption"
      [ngClass]="{ HasHoverState: true }"
      (click)="onClick()"
    >
      <fl-bit class="ExamsTakenListItem-content-checkbox">
        <fl-checkbox
          flTrackingLabel="BidListFilter.USER_EXAM_TAKEN"
          [control]="control"
          [forListItem]="true"
          [size]="CheckboxSize.LARGE"
        ></fl-checkbox>
      </fl-bit>

      <fl-bit class="ExamsTakenListItem-content-label">
        <fl-text [size]="TextSize.SMALL">
          {{ examName }}
          <fl-text
            [fontType]="FontType.SPAN"
            [flHideMobile]="true"
            [size]="TextSize.SMALL"
          >
            ({{ count }})
          </fl-text>
        </fl-text>
        <fl-text [flShowMobile]="true" [size]="TextSize.SMALL">
          {{ count }}
        </fl-text>
      </fl-bit>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./exams-taken-filter-list-item.component.scss'],
})
export class ExamsTakenFilterListItemComponent {
  CheckboxSize = CheckboxSize;
  FontType = FontType;
  Margin = Margin;
  TextSize = TextSize;

  @Input() control: FormControl;
  @Input() examName: string;
  @Input() count: number;

  onClick() {
    this.control.setValue(!this.control.value);
    this.control.markAsDirty();
  }
}

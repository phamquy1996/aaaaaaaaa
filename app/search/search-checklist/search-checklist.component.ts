import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { ChecklistOption } from '../search-checklist-filter/search-checklist-filter.component';

@Component({
  selector: 'app-search-checklist',
  template: `
    <fl-bit
      *ngFor="let option of options$ | async; trackBy: trackByOptionId"
      [flMarginBottom]="Margin.XXSMALL"
    >
      <ng-container *ngIf="formGroup.get(option.id) as control">
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="ChecklistItem"
          [control]="control"
          [label]="option.displayValue"
        >
        </fl-checkbox>
      </ng-container>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchChecklistComponent {
  isFormControl = isFormControl;
  Margin = Margin;

  @Input() formGroup: FormGroup;
  @Input() options$: Rx.Observable<ReadonlyArray<ChecklistOption>>;

  trackByOptionId(index: number, option: ChecklistOption): string {
    return option.id;
  }
}

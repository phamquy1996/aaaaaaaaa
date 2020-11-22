import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  RichMessageCheckboxInput,
  RichMessagePayload,
} from '@freelancer/datastore/collections';
import { isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-checkbox-input',
  template: `
    <ng-container *ngFor="let value of element.values">
      <ng-container *ngIf="formGroup.get(value.value) as control">
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="rich-message-checkbox"
          [control]="control"
          [label]="value.text"
        ></fl-checkbox>
      </ng-container>
    </ng-container>
    <fl-bit *ngIf="currErrText" class="Error">{{ currErrText }}</fl-bit>
  `,
  styleUrls: ['./checkbox-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent implements OnInit, OnDestroy {
  isFormControl = isFormControl;

  @Input() element: RichMessageCheckboxInput;
  @Input() disabled: boolean;

  @Input() richMessageValues: RichMessagePayload = {};
  @Output() richMessageValuesChange = new EventEmitter<RichMessagePayload>();

  currErrText: string;
  formGroup = new FormGroup({});
  formSubscription?: Rx.Subscription;

  ngOnInit() {
    // Init checkbox items as false.
    this.element.values.forEach(value => {
      this.richMessageValues[value.value] = false;
      this.formGroup.addControl(value.value, new FormControl(false));
    });

    // TODO: Improve how we set rich message values. Ref T72661
    this.formSubscription = this.formGroup.valueChanges.subscribe(
      formValues => {
        Object.entries(formValues).forEach((entry: [string, any]) => {
          const [value, checked] = entry;
          this.richMessageValues[value] = checked;
        });
      },
    );
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}

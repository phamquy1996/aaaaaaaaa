import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FontColor, TextSize } from '../text';

@Component({
  selector: 'fl-validation-error',
  template: `
    <fl-text
      *ngIf="
        (status$ | async) &&
        control.invalid &&
        (control.touched || control.dirty)
      "
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ status$ | async }}
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrorComponent implements OnChanges {
  FontColor = FontColor;
  TextSize = TextSize;

  status$: Rx.Observable<string>;

  @Input() control: FormControl;

  ngOnChanges(changes: SimpleChanges) {
    if ('control' in changes) {
      this.status$ = this.control.statusChanges.pipe(
        startWith(this.control.status),
        map(() => {
          const [error]: string[] = Object.values(this.control.errors || {});
          return error;
        }),
      );
    }
  }
}

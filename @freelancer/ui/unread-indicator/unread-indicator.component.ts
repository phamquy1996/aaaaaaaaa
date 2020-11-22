import { transition, trigger, useAnimation } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { pulse } from '@freelancer/animations';

export enum UnreadIndicatorSize {
  SMALL = 'small',
  MID = 'mid',
}

@Component({
  selector: 'fl-unread-indicator',
  template: `
    <fl-bit
      class="UnreadIndicator"
      [attr.aria-label]="ariaLabel"
      [attr.data-counter]="counter"
      [attr.data-size]="size"
      [@pulseAnimation]="counter"
    >
      <span
        *ngIf="counter"
        class="UnreadIndicator-counter"
        [attr.aria-hidden]="ariaLabel !== undefined ? true : false"
      >
        <ng-container *ngIf="counter <= countLimit">
          {{ counter }}
        </ng-container>
        <ng-container *ngIf="counter > countLimit">
          {{ countLimit }}+
        </ng-container>
      </span>
    </fl-bit>
  `,
  styleUrls: ['./unread-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('pulseAnimation', [
      transition(':enter, :increment, :decrement', [useAnimation(pulse)]),
    ]),
  ],
})
export class UnreadIndicatorComponent {
  countLimit = 99;

  @Input() ariaLabel: string;

  /**
   * Accepts 'placeholder' to display the indicator
   * the same size as the counter
   * */
  @HostBinding('attr.data-counter')
  @Input()
  counter: number | 'placeholder';

  @HostBinding('attr.data-size')
  @Input()
  size = UnreadIndicatorSize.MID;
}

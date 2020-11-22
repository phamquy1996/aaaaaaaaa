import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DurationFormat, DurationPipe } from '@freelancer/pipes';
import { Timer } from '@freelancer/time-utils';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { LocalizedDateFns } from '../localized-date-fns.service';
import { RelativeTime } from './relative-time.service';

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

@Component({
  selector: 'fl-relative-time',
  template: `
    <fl-text
      [color]="color"
      [fontType]="FontType.SPAN"
      [size]="size"
      [weight]="weight"
    >
      <ng-container *ngIf="showJustNowString" i18n="Recent relative date"
        >just now</ng-container
      >
      <ng-container *ngIf="!showJustNowString">{{
        relativeTime | async
      }}</ng-container>
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelativeTimeComponent implements OnInit, OnChanges, OnDestroy {
  FontType = FontType;

  relativeTime: Promise<string>;
  timeoutId: Timer;
  tick: () => void;

  @Input()
  set date(date: Date | string | number) {
    this._date = new Date(date);
    this.hasTimePassed = false;
  }
  _date: Date;
  private hasTimePassed: boolean;

  @Input() live = true;
  @Input() includeSeconds = true;
  @Input() suffix = true;
  @Input() strict = false;
  /** Display a secondary unit (eg. 1 hour, 1 minute). Can only display as if `strict` was on */
  @Input() secondaryUnit = false;
  /** Allow time to tick down after it has passed */
  @Input() continueAfterTimePassed = true;

  @Input() color = FontColor.MID;
  @Input() size = TextSize.XXSMALL;
  @Input() weight = FontWeight.NORMAL;

  @Output() timePassed = new EventEmitter<undefined>();

  showJustNowString = false;

  constructor(
    private dateFns: LocalizedDateFns,
    private changeDetectorRef: ChangeDetectorRef,
    private durationPipe: DurationPipe,
    private relativeTimeService: RelativeTime,
  ) {
    this.tick = (): void => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      const now = Date.now();
      this.render(now);
      if (!this.live) {
        return;
      }

      const then = this._date.getTime();
      const seconds = Math.round((then - now) / 1000);

      if (!this.hasTimePassed && seconds <= 0) {
        this.hasTimePassed = true;
        this.timePassed.emit();
        if (!this.continueAfterTimePassed) {
          return;
        }
      }

      // figure out how long to wait before recalculating
      // eg. if it says "4 hours" we know it won't be different in 1 minute, so we can wait longer.
      let period =
        Math.abs(seconds) < 2 * MINUTE
          ? 1000
          : seconds < 2 * HOUR
          ? 1000 * 2 * MINUTE
          : seconds < 2 * DAY
          ? 1000 * HOUR
          : 1000 * DAY;

      if (this.secondaryUnit) {
        // if we show secondaryUnit, we want to check more often because we display more units
        period =
          Math.abs(seconds) < HOUR + MINUTE
            ? 1000
            : seconds < DAY + HOUR
            ? 1000 * MINUTE
            : 1000 * HOUR;
      }

      this.timeoutId = this.relativeTimeService.scheduleTick(this.tick, period);
    };
  }

  ngOnInit() {
    this.tick();
  }

  ngOnChanges() {
    // Re-render and reset timer
    this.tick();
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }

  private render(now: number) {
    // show "just now" as a string because date-fns doesn't support these two options together
    this.showJustNowString =
      this.strict &&
      !this.includeSeconds &&
      now - this._date.getTime() < MINUTE * 1000;
    if (this.showJustNowString) {
      return;
    }

    // otherwise use date-fns to format
    if (this.secondaryUnit) {
      const diff = Math.abs(now - this._date.getTime());
      this.relativeTime = this.durationPipe.transform(
        diff,
        DurationFormat.LONG,
      );
    } else if (this.strict) {
      this.relativeTime = this.dateFns.formatDistanceStrict(
        this._date,
        new Date(),
        {
          includeSeconds: this.includeSeconds,
          addSuffix: this.suffix,
        },
      );
    } else {
      this.relativeTime = this.dateFns.formatDistance(this._date, new Date(), {
        includeSeconds: this.includeSeconds,
        addSuffix: this.suffix,
      });
    }
    this.changeDetectorRef.markForCheck();
  }
}

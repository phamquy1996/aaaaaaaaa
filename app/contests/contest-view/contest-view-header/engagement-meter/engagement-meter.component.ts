import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ContestEngagement,
  ContestViewContest,
} from '@freelancer/datastore/collections';
import { CalloutPlacement, CalloutSize } from '@freelancer/ui/callout';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { ContestStatusApi } from 'api-typings/contests/contests';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

export enum EngagementLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Component({
  selector: 'app-engagement-meter',
  template: `
    <ng-container *ngIf="displayEngagementLevel$ | async">
      <fl-callout
        *ngIf="engagement$ | async as engagement"
        [hover]="true"
        [placement]="CalloutPlacement.BOTTOM"
        [size]="CalloutSize.SMALL"
      >
        <fl-callout-trigger class="EngagementMeter">
          <fl-icon
            [name]="'ui-pulse'"
            [color]="iconColor$ | async"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-icon>
          <fl-text [color]="FontColor.LIGHT" [size]="TextSize.SMALL">
            {{ engagement.engagementRatio }}%
          </fl-text>
        </fl-callout-trigger>
        <fl-callout-content>
          <app-engagement-meter-tooltip
            [level]="engagementLevel$ | async"
            [unratedEntries]="engagement.unratedEntries"
          >
          </app-engagement-meter-tooltip>
        </fl-callout-content>
      </fl-callout>
    </ng-container>
  `,
  styleUrls: [`./engagement-meter.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementMeterComponent implements OnInit {
  CalloutPlacement = CalloutPlacement;
  CalloutSize = CalloutSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconColor = IconColor;
  Margin = Margin;

  engagementLevel$: Rx.Observable<EngagementLevel>;
  iconColor$: Rx.Observable<IconColor>;
  displayEngagementLevel$: Rx.Observable<boolean>;

  @Input() engagement$: Rx.Observable<ContestEngagement>;
  @Input() contest$: Rx.Observable<ContestViewContest>;

  ngOnInit() {
    this.engagementLevel$ = this.engagement$.pipe(
      map(engagement => {
        if (engagement.engagementRatio > 70) {
          return EngagementLevel.HIGH;
        }
        if (engagement.engagementRatio > 35) {
          return EngagementLevel.MEDIUM;
        }
        return EngagementLevel.LOW;
      }),
    );

    this.iconColor$ = this.engagementLevel$.pipe(
      map(level => {
        switch (level) {
          case EngagementLevel.HIGH:
            return IconColor.SUCCESS;
          case EngagementLevel.MEDIUM:
            return IconColor.CONTEST;
          case EngagementLevel.LOW:
            return IconColor.ERROR;
          default:
            return IconColor.ERROR;
        }
      }),
    );

    this.displayEngagementLevel$ = Rx.combineLatest([
      this.engagement$,
      this.contest$,
    ]).pipe(
      map(
        ([engagement, contest]) =>
          contest.status !== ContestStatusApi.CLOSED &&
          engagement.totalEngageableEntries > 0,
      ),
    );
  }
}

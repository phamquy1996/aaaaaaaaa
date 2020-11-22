import { Component, Input } from '@angular/core';
import {
  FontColor,
  FontType,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { TimeUnitApi } from 'api-typings/common/common';

@Component({
  selector: 'app-membership-duration',
  template: `
    <fl-text
      [color]="FontColor.INHERIT"
      [fontType]="FontType.SPAN"
      [ngSwitch]="duration"
      [size]="TextSize.INHERIT"
      [textTransform]="textTransform"
      [weight]="FontWeight.INHERIT"
    >
      {{ cycle }}
      <ng-container *ngSwitchCase="TimeUnitApi.DAY">
        <ng-container
          *ngIf="cycle > 1; else singleDay"
          i18n="Membership Duration Day plural"
          >days</ng-container
        >
        <ng-template #singleDay>
          <ng-container i18n="Membership Duration Day singular"
            >day</ng-container
          >
        </ng-template>
      </ng-container>
      <ng-container *ngSwitchCase="TimeUnitApi.WEEK">
        <ng-container
          *ngIf="cycle > 1; else singleWeek"
          i18n="Membership Duration Week plural"
          >weeks</ng-container
        >
        <ng-template #singleWeek>
          <ng-container i18n="Membership Duration Week singular"
            >week</ng-container
          >
        </ng-template>
      </ng-container>
      <ng-container *ngSwitchCase="TimeUnitApi.MONTH">
        <ng-container
          *ngIf="cycle > 1; else singleMonth"
          i18n="Membership Duration Month plural"
          >months</ng-container
        >
        <ng-template #singleMonth>
          <ng-container i18n="Membership Duration Month singular"
            >month</ng-container
          >
        </ng-template>
      </ng-container>
      <ng-container *ngSwitchCase="TimeUnitApi.YEAR">
        <ng-container
          *ngIf="cycle > 1; else singleYear"
          i18n="Membership Duration Year plural"
          >years</ng-container
        >
        <ng-template #singleYear>
          <ng-container i18n="Membership Duration Year singular"
            >year</ng-container
          >
        </ng-template>
      </ng-container>
    </fl-text>
  `,
})
export class MembershipDurationComponent {
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  TextSize = TextSize;
  TimeUnitApi = TimeUnitApi;

  @Input() cycle: number;
  @Input() duration: TimeUnitApi;
  @Input() textTransform?: TextTransform;
}

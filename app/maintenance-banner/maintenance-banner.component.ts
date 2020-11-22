import { Component, Inject, Input, OnInit } from '@angular/core';
import { SITE_NAME } from '@freelancer/config';
import { Datastore } from '@freelancer/datastore';
import { UserInteractionsCollection } from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ContainerSize } from '@freelancer/ui/container';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance-banner',
  template: `
    <fl-banner-announcement
      *ngIf="isBeforeMaintenance && (isBannerOpen$ | async)"
      i18n="Verification banner message"
      bannerTitle="Scheduled maintenance"
      i18n-bannerTitle="Scheduled maintenance banner"
      [icon]="'ui-info-v2'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      {{ siteName }} will undergo a scheduled maintenance at
      {{ timestamp | date: 'shortTime' }} on
      {{ timestamp | date: 'mediumDate' }}. It will last for approximately 1
      hour and the site will be inaccessible during this time.
    </fl-banner-announcement>
  `,
})
export class MaintenanceBannerComponent implements OnInit {
  BannerAnnouncementType = BannerAnnouncementType;

  readonly CLOSE_EVENT_NAME = 'maintenance-banner-close';

  /**
   * IMPORTANT: if you modify this, update user-session.ts in the e2e tests
   * to disable the banner for all test users as well
   */
  // 12am UTC on November 2, 2020
  timestamp = Date.UTC(2020, 10, 2, 0);
  isBeforeMaintenance = Date.now() < this.timestamp;

  /** If the user hasn't closed the banner yet */
  isBannerOpen$: Rx.Observable<boolean>;

  @Input() containerSize: ContainerSize;

  constructor(
    @Inject(SITE_NAME) public siteName: string,
    private datastore: Datastore,
  ) {}

  ngOnInit() {
    this.isBannerOpen$ = this.datastore
      .collection<UserInteractionsCollection>('userInteractions', query =>
        query
          .where('eventName', '==', this.CLOSE_EVENT_NAME)
          // raw millisecond timestamp is too large to store properly
          .where('eventId', '==', this.timestamp / 1000),
      )
      .valueChanges()
      .pipe(map(events => events.length === 0));
  }

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      {
        eventName: this.CLOSE_EVENT_NAME,
        eventId: this.timestamp / 1000,
      },
    );
  }
}

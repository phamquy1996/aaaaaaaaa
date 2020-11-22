import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Datastore,
  DatastoreCollection,
  WebSocketService,
} from '@freelancer/datastore';
import {
  isNotificationEntry,
  NotificationEntry,
  NotificationsCollection,
  NotificationsPreferenceEntry,
  NotificationsPreferencesCollection,
  ProjectFeedCollection,
  ProjectFeedEntry,
  ProjectFeedFailingContestsCollection,
  ProjectFeedFailingProjectsCollection,
} from '@freelancer/datastore/collections';
import { LocalStorage } from '@freelancer/local-storage';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { isDefined, toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationUpdatesView } from './updates.model';

@Component({
  selector: 'app-updates',
  template: `
    <app-updates-list
      *ngIf="view === NavigationUpdatesView.LIST"
      flTrackingSection="NavigationPrimary"
      [hideHeading]="hideHeading"
      [hasPreferences]="hasPreferences$ | async"
      [updates]="updates$ | async"
      (clickSettings)="handleChangeView($event)"
    ></app-updates-list>
    <app-updates-settings
      *ngIf="
        view === NavigationUpdatesView.SETTINGS &&
        (notificationsPreferences$ | async) as filters
      "
      flTrackingSection="NavigationPrimary"
      [hideHeading]="hideHeading"
      [filters]="filters"
      (clickBack)="handleChangeView($event)"
      (settingsUpdate)="handleSettingsUpdate($event)"
    ></app-updates-settings>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesComponent implements OnInit, OnDestroy {
  NavigationUpdatesView = NavigationUpdatesView;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;

  @Input() hideHeading = false;

  @Output() unreadCount = new EventEmitter<number>();

  hasPreferences$: Rx.Observable<boolean>;
  notifications$: Rx.Observable<ReadonlyArray<NotificationEntry>>;
  notificationsPreferences$: Rx.Observable<
    ReadonlyArray<NotificationsPreferenceEntry>
  >;
  projectFeed$: Rx.Observable<ReadonlyArray<ProjectFeedEntry>>;
  rawNotificationsPreferencesCollection: DatastoreCollection<
    NotificationsPreferencesCollection
  >;
  updates$: Rx.Observable<ReadonlyArray<NotificationEntry | ProjectFeedEntry>>;
  view = NavigationUpdatesView.LIST;

  private websocketChannelSubscription?: Rx.Subscription;
  private unreadCountSubscription?: Rx.Subscription;
  private readStatusSubscription?: Rx.Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private datastore: Datastore,
    private webSocketService: WebSocketService,
    private localStorage: LocalStorage,
  ) {}

  @HostListener('click')
  @HostListener('mouseenter')
  handleReadAction() {
    this.localStorage.set('navUpdatesLastReadTime', Date.now());
  }

  ngOnInit() {
    this.rawNotificationsPreferencesCollection = this.datastore.collection<
      NotificationsPreferencesCollection
    >('notificationsPreferences');

    const jobPreferences$ = this.rawNotificationsPreferencesCollection
      .valueChanges()
      .pipe(
        map(preferences =>
          preferences.filter(preference =>
            preference.channel.startsWith('job_'),
          ),
        ),
      );

    this.websocketChannelSubscription = jobPreferences$.subscribe(preferences =>
      this.webSocketService.setChannels(
        preferences
          .filter(preference => preference.enabled)
          .map(preference => toNumber(preference.channel.split('_')[1])),
      ),
    );

    this.notificationsPreferences$ = jobPreferences$.pipe(
      map(preferences =>
        preferences.filter(
          preference => preference.notificationType === 'live',
        ),
      ),
    );

    this.hasPreferences$ = this.notificationsPreferences$.pipe(
      map(preferences => preferences.length > 0),
    );

    this.notifications$ = this.datastore
      .collection<NotificationsCollection>('notifications')
      .valueChanges()
      .pipe(map(notifications => notifications.filter(isNotificationEntry)));

    const jobIdsToNotify$ = jobPreferences$.pipe(
      map(preferences =>
        preferences
          .filter(preference => preference.enabled)
          .map(preference => {
            const preferenceSplitArray = preference.channel.split('_');
            if (preferenceSplitArray.length >= 2) {
              return toNumber(preferenceSplitArray[1]);
            }

            return undefined;
          })
          .filter(isDefined),
      ),
    );

    this.projectFeed$ = Rx.combineLatest([
      this.datastore
        .collection<ProjectFeedCollection>('projectFeed', query =>
          query.where('jobIds', 'intersects', jobIdsToNotify$),
        )
        .valueChanges(),
      this.datastore
        .collection<ProjectFeedFailingProjectsCollection>(
          'projectFeedFailingProjects',
          query => query.where('jobIds', 'intersects', jobIdsToNotify$),
        )
        .valueChanges(),
      this.datastore
        .collection<ProjectFeedFailingContestsCollection>(
          'projectFeedFailingContests',
          query => query.where('jobIds', 'intersects', jobIdsToNotify$),
        )
        .valueChanges(),
    ]).pipe(
      map(([list, projects, contests]) => [...list, ...projects, ...contests]),
    );

    this.updates$ = Rx.combineLatest([
      this.notifications$,
      this.projectFeed$,
    ]).pipe(
      map(([notifications, projectFeed]) =>
        [...notifications, ...projectFeed].sort((a, b) => b.time - a.time),
      ),
    );

    // TODO: T42812 Add read or not read inside notifications

    this.unreadCountSubscription = Rx.combineLatest([
      this.updates$,
      this.localStorage.get('navUpdatesLastReadTime'),
    ])
      .pipe(
        map(([updates, lastReadTime]) =>
          updates.filter(update => update.time > (lastReadTime || 0)),
        ),
      )
      .subscribe(unread => this.unreadCount.emit(unread.length));
  }

  ngOnDestroy() {
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
    if (this.readStatusSubscription) {
      this.readStatusSubscription.unsubscribe();
    }
    if (this.websocketChannelSubscription) {
      this.websocketChannelSubscription.unsubscribe();
    }
  }

  handleChangeView(view: NavigationUpdatesView) {
    this.view = view;
    this.changeDetectorRef.markForCheck();
  }

  handleSettingsUpdate(settings: ReadonlyArray<NotificationsPreferenceEntry>) {
    settings.map(setting =>
      this.rawNotificationsPreferencesCollection.set(setting.id, setting),
    );
    this.changeDetectorRef.markForCheck();
  }
}

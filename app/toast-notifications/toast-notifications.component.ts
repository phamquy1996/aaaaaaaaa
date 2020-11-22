import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Datastore, notEmpty } from '@freelancer/datastore';
import {
  NotificationsPreferencesCollection,
  ToastNotificationItem,
  ToastNotificationsCollection,
} from '@freelancer/datastore/collections';
import { MessagingChat } from '@freelancer/messaging-chat';
import { Margin } from '@freelancer/ui/margin';
import * as Rx from 'rxjs';
import { distinctUntilChanged, filter, map, scan } from 'rxjs/operators';

// Here for convenience to work with a combination of ProjectFeedEntry and
// NotificationEntry and handling adding/removing items off the visible toast
// list.
interface ToastItemOperation {
  type: 'add' | 'remove';
  item: ToastNotificationItem;
}

@Component({
  selector: 'app-toast-notifications',
  template: `
    <app-toast-container
      [flShowDesktop]="true"
      flTrackingSection="ToastNotification"
      *ngIf="toastNotificationsEnabled$ | async"
      (mouseover)="handleToastContainerMouseover()"
      (mouseout)="handleToastContainerMouseout()"
    >
      <app-toast-item
        class="ToastItem"
        [flMarginBottom]="Margin.SMALL"
        *ngFor="let toastItem of toastItems$ | async"
        [@fadeInOut]="'in'"
        [timer]="toastTimer"
        [paused]="isToastRemovalPaused"
        [event]="toastItem"
        (hide)="handleToastItemHide(toastItem)"
      ></app-toast-item>
    </app-toast-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(200)]),
      transition(':leave', [animate(200, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ToastNotificationsComponent implements OnInit {
  toastItems$: Rx.Observable<ReadonlyArray<ToastNotificationItem>>;

  Margin = Margin;
  isToastRemovalPaused = false;
  toastNotificationsEnabled$: Rx.Observable<boolean>;

  readonly toastTimer = 5000;

  private _toastRemovalSubject$ = new Rx.Subject<ToastNotificationItem>();

  constructor(
    private datastore: Datastore,
    private messagingChat: MessagingChat,
  ) {}

  ngOnInit() {
    const notificationsPreferencesCollection = this.datastore.collection<
      NotificationsPreferencesCollection
    >('notificationsPreferences');

    const showNewBids$ = notificationsPreferencesCollection.valueChanges().pipe(
      map(preferences => {
        const preference = preferences.find(
          p => p.notificationType === 'notification' && p.channel === 'bids',
        );
        return preference ? preference.enabled : true;
      }),
      distinctUntilChanged(),
    );

    const showNewContestEntries$ = notificationsPreferencesCollection
      .valueChanges()
      .pipe(
        map(preferences => {
          const preference = preferences.find(
            p =>
              p.notificationType === 'notification' &&
              p.channel === 'contestEntrys',
          );
          return preference ? preference.enabled : true;
        }),
        distinctUntilChanged(),
      );

    this.toastNotificationsEnabled$ = notificationsPreferencesCollection
      .valueChanges()
      .pipe(
        map(preferences => {
          const preference = preferences.find(
            p => p.notificationType === 'both' && p.channel === 'popups',
          );
          return preference ? preference.enabled : true;
        }),
        distinctUntilChanged(),
      );

    /**
     * This observable maintains an array containing the toast notifications
     * that are/will be shown on the screen. The observable handles operations
     * to add or remove items from the toast notifications.
     */
    this.toastItems$ = Rx.merge(
      Rx.combineLatest([
        this.datastore
          // Start off by grabbing a list of toast notifications from the datastore.
          .collection<ToastNotificationsCollection>(
            'toastNotifications',
            query => query.limit(1),
          )
          .valueChanges()
          .pipe(
            notEmpty(),
            map(items => items[items.length - 1]),
          ),
        showNewBids$,
        showNewContestEntries$,
        this.messagingChat.isToastDisabled$,
      ]).pipe(
        filter(([item, newBidsSetting, newEntriesSetting, isDisabled]) => {
          if (isDisabled) {
            return false;
          }

          // Filter out notifications that are bids and contest entries depending
          // on the notification preferences of the user.
          if ('parent_type' in item) {
            if (item.parent_type === 'notifications' && item.type === 'bid') {
              return newBidsSetting;
            }

            if (
              item.parent_type === 'notifications' &&
              item.type === 'contestEntry'
            ) {
              return newEntriesSetting;
            }
          }
          return true;
        }),
        map(([item]) => item),
        // All of these notifications from the datastore counts as adding to the
        // list of toast notifications to show.
        map<ToastNotificationItem, ToastItemOperation>(toastItem => ({
          type: 'add',
          item: toastItem,
        })),
      ),
      // Merge this with the subject that handles removing toast notifications
      // currently displayed.
      this._toastRemovalSubject$.pipe(
        map<ToastNotificationItem, ToastItemOperation>(toastItem => ({
          type: 'remove',
          item: toastItem,
        })),
      ),
    ).pipe(
      // At this stage, both streams return operations to add or remove from a
      // list maintained in the observable. If the operation is add, add it to
      // the list, otherwise if the operation is remove then remove it from the
      // array.
      scan<ToastItemOperation, ReadonlyArray<ToastNotificationItem>>(
        (toastItems, toastItemOperation) => {
          // only add if there aren't already two toasts.
          // any extra toasts with 2 visible will be ignored
          if (toastItemOperation.type === 'add' && toastItems.length < 2) {
            return [...toastItems, toastItemOperation.item];
          }

          if (toastItemOperation.type === 'remove') {
            return toastItems.filter(
              item => item.id !== toastItemOperation.item.id,
            );
          }

          return toastItems;
        },
        [],
      ),
    );
  }

  handleToastItemHide(notification: ToastNotificationItem) {
    this._toastRemovalSubject$.next(notification);
  }

  handleToastContainerMouseover() {
    this.isToastRemovalPaused = true;
  }

  handleToastContainerMouseout() {
    this.isToastRemovalPaused = false;
  }
}

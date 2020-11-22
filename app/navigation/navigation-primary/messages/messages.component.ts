import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Datastore } from '@freelancer/datastore';
import {
  OnlineOfflineCollection,
  OnlineOfflineUserStatus,
  Thread,
  ThreadsCollection,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { IconSize } from '@freelancer/ui/icon';
import { LinkIconPosition } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import {
  FontWeight,
  TextAlign,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { flatten } from '@freelancer/utils';
import { FolderApi } from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  template: `
    <fl-bit>
      <fl-bit class="Heading">
        <fl-text
          i18n="Recent Messages heading"
          [flMarginRight]="Margin.MID"
          [size]="TextSize.XXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          Recent Messages
        </fl-text>
        <fl-link
          flTrackingLabel="Messages-ViewAll"
          i18n="Recent Messages view all"
          [iconName]="'ui-arrow-right'"
          [iconPosition]="LinkIconPosition.RIGHT"
          [iconSize]="IconSize.XSMALL"
          [link]="'/messages'"
          [size]="TextSize.XXSMALL"
        >
          View All
        </fl-link>
      </fl-bit>

      <app-messaging-threads
        *ngIf="isNewNavMessagesInQueryParams$ | async; else oldNav"
        [isNav$]="isNewNavMessagesInQueryParams$"
      ></app-messaging-threads>

      <ng-template #oldNav>
        <ng-container
          *ngIf="{
            threads: threads$ | async,
            users: users$ | async
          } as navData"
        >
          <fl-bit
            class="List"
            *ngIf="
              navData.threads &&
                navData.threads.length > 0 &&
                navData.users &&
                navData.users.length > 0;
              else noMessages
            "
          >
            <app-message-item
              *ngFor="let thread of navData.threads; trackBy: trackById"
              [thread]="thread"
              [users]="navData.users"
              [onlineOfflineStatuses$]="onlineOfflineStatuses$"
            ></app-message-item>
          </fl-bit>
        </ng-container>
      </ng-template>
    </fl-bit>

    <ng-template #noMessages>
      <fl-bit class="Empty">
        <fl-picture
          class="EmptyImg"
          alt="Empty Messages Image"
          i18n-alt="Empty Messages Image"
          [alignCenter]="true"
          [display]="PictureDisplay.BLOCK"
          [flMarginBottom]="Margin.SMALL"
          [src]="'navigation/messages/empty-inbox.svg'"
        >
        </fl-picture>
        <fl-text
          i18n="Messages empty messages"
          [size]="TextSize.XXSMALL"
          [textAlign]="TextAlign.CENTER"
        >
          No messages yet? Connect with people
        </fl-text>
        <fl-text
          i18n="Messages create message"
          [size]="TextSize.XXSMALL"
          [textAlign]="TextAlign.CENTER"
        >
          by
          <fl-link
            flTrackingLabel="Messages-PostProject"
            [link]="'/post-project'"
            [size]="TextSize.XXSMALL"
          >
            creating
          </fl-link>
          <ng-container *flFeature="Feature.SEARCH_POOLS">
            or
            <fl-link
              flTrackingLabel="Messages-BrowseProject"
              [link]="'/search/projects/'"
              [size]="TextSize.XXSMALL"
            >
              bidding
            </fl-link>
            on
          </ng-container>
          a project
        </fl-text>
      </fl-bit>
    </ng-template>
  `,
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit, OnDestroy {
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkIconPosition = LinkIconPosition;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  TextTransform = TextTransform;
  Feature = Feature;

  isNewNavMessagesInQueryParams$: Rx.Observable<boolean>;
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  threads$: Rx.Observable<ReadonlyArray<Thread>>;
  users$: Rx.Observable<ReadonlyArray<User>>;
  isNewNavSubscription?: Rx.Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private datastore: Datastore,
  ) {}

  ngOnInit() {
    this.isNewNavMessagesInQueryParams$ = this.activatedRoute.queryParams.pipe(
      map(queryParams => convertToParamMap(queryParams).has('newNavMessages')),
      distinctUntilChanged(),
    );

    this.isNewNavSubscription = this.isNewNavMessagesInQueryParams$.subscribe(
      isNewNav => {
        if (!isNewNav) {
          // Show threads that are not archived
          this.threads$ = this.datastore
            .collection<ThreadsCollection>('threads', query =>
              query
                .where('folder', 'in', [
                  FolderApi.FREELANCER,
                  FolderApi.INBOX,
                  FolderApi.SENT,
                ])
                .limit(5),
            )
            .valueChanges()
            .pipe(
              map(threads =>
                [...threads].sort((a, b) => b.timeUpdated - a.timeUpdated),
              ),
            );

          const userIds$ = this.threads$.pipe(
            map(threads => flatten(threads.map(thread => thread.members))),
          );

          this.users$ = this.datastore
            .collection<UsersCollection>('users', userIds$)
            .valueChanges();

          this.onlineOfflineStatuses$ = this.datastore
            .collection<OnlineOfflineCollection>('onlineOffline', userIds$)
            .valueChanges();
        }
      },
    );
  }

  trackById(index: number, thread: Thread) {
    return thread.id;
  }

  ngOnDestroy() {
    if (this.isNewNavSubscription) {
      this.isNewNavSubscription.unsubscribe();
    }
  }
}

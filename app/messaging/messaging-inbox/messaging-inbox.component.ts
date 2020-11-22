import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import {
  ThreadsCollection,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { LocalStorage } from '@freelancer/local-storage';
import { ChatViewState, MessagingChat } from '@freelancer/messaging-chat';
import { toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { MESSAGING_THREADS_DEFAULT_LIMIT } from '../messaging.component';

const hideMobileNewMessageToastKey = 'hideMobileNewMessageToast';

@Component({
  selector: 'app-messaging-inbox',
  template: `
    <fl-bit class="InboxContainer">
      <app-messaging-contacts
        class="ThreadlistSidebar"
        [inboxMode]="true"
        [currentUser]="currentUserDoc.valueChanges() | async"
        [inCall$]="inCall$"
        [flHideMobile]="
          (selectedThreadId$ | async) !== undefined ||
          (hasThreads$ | async) === false ||
          (isNewThread$ | async)
        "
        [selectedThreadId]="selectedThreadId$ | async"
        (makingCall)="setInCall($event)"
      ></app-messaging-contacts>
      <router-outlet></router-outlet>
    </fl-bit>
  `,
  styleUrls: ['./messaging-inbox.component.scss'],
})
export class MessagingInboxComponent implements OnInit, OnDestroy {
  currentUserDoc: DatastoreDocument<UsersCollection>;
  private inCallSubject$ = new Rx.BehaviorSubject<boolean>(false);
  inCall$ = this.inCallSubject$.asObservable();
  hasThreads$: Rx.Observable<boolean>;
  isNewThread$: Rx.Observable<boolean>;

  selectedThreadId$: Rx.Observable<number | undefined>;
  mobileNewMessageToastSubscription?: Rx.Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: Auth,
    private datastore: Datastore,
    private localStorage: LocalStorage,
    private messagingChat: MessagingChat,
  ) {}

  ngOnInit() {
    const chatViewState$ = this.messagingChat.getViewState();
    const hideMobileNewMessageToast$ = this.localStorage.get(
      hideMobileNewMessageToastKey,
    );

    // Hide the mobile new message toast once the user enters inbox mode
    this.mobileNewMessageToastSubscription = Rx.combineLatest([
      hideMobileNewMessageToast$,
      chatViewState$,
    ]).subscribe(([isToastHidden, chatViewState]) => {
      if (chatViewState === ChatViewState.NONE && !isToastHidden) {
        this.localStorage.set(hideMobileNewMessageToastKey, true);
      }
    });

    const currentUserId$ = this.auth.getUserId();
    this.currentUserDoc = this.datastore.document<UsersCollection>(
      'users',
      currentUserId$,
    );

    // the `id` is a param of the `/thread/:id` child of this route
    // this child does not always exist, so we can't just subscribe to `firstChild.params`
    // instead, we have to refetch the id from the child (if it exists) each time we navigate
    this.selectedThreadId$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(undefined),
      map(() =>
        this.route.firstChild
          ? toNumber(this.route.firstChild.snapshot.params.id)
          : undefined,
      ),
    );

    const threadsCollection = this.datastore.collection<ThreadsCollection>(
      'threads',
      query => query.limit(MESSAGING_THREADS_DEFAULT_LIMIT),
    );

    this.hasThreads$ = threadsCollection
      .valueChanges()
      .pipe(map(threads => threads.length > 0));

    this.isNewThread$ = this.route.url.pipe(
      map(_ => this.router.url.split('?')[0] === '/messages/new'),
    );
  }

  setInCall(state: boolean) {
    this.inCallSubject$.next(state);
  }

  ngOnDestroy() {
    if (this.mobileNewMessageToastSubscription) {
      this.mobileNewMessageToastSubscription.unsubscribe();
    }
  }
}

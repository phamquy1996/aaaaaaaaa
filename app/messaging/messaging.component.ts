import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import { UsersCollection } from '@freelancer/datastore/collections';
import { LocalStorage } from '@freelancer/local-storage';
import { ChatViewState, MessagingChat } from '@freelancer/messaging-chat';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

export const MESSAGING_THREADS_DEFAULT_LIMIT = 100;

const threadListMinimiseKey = 'webappThreadListMinimise';

@Component({
  selector: 'app-messaging',
  template: `
    <ng-container
      *ngIf="
        (isLoggedIn$ | async) && (chatViewState$ | async) !== ChatViewState.NONE
      "
    >
      <app-messaging-chat
        [adminChatsOnly]="hideMessaging"
        [inCall$]="inCall$"
        [clickedOutside$]="clickedOutside$"
        (makingCall)="setInCall($event)"
      ></app-messaging-chat>
      <ng-container *ngIf="!hideMessaging">
        <app-messaging-contacts
          *ngIf="
            !(isNewInboxWidgetInQueryParams$ | async);
            else displayNewInboxWidget
          "
          data-uitest-target="contactlist-new"
          [currentUser]="currentUserDoc.valueChanges() | async"
          [inCall$]="inCall$"
          [isCompact]="(chatViewState$ | async) === ChatViewState.COMPACT"
          [isMinimised]="isMinimised$ | async"
          (makingCall)="setInCall($event)"
          (minimise)="setMinimise($event)"
        >
        </app-messaging-contacts>
        <ng-template #displayNewInboxWidget>
          <app-messaging-inbox-widget></app-messaging-inbox-widget>
        </ng-template>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./messaging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent implements OnInit {
  ChatViewState = ChatViewState;

  @Input() hideMessaging: boolean;
  currentUserDoc: DatastoreDocument<UsersCollection>;

  chatViewState$: Rx.Observable<ChatViewState>;
  isLoggedIn$: Rx.Observable<boolean>;

  private _isMinimisedSubject$ = new Rx.ReplaySubject<boolean>(1);
  isMinimised$: Rx.Observable<boolean>;

  private _inCallSubject$ = new Rx.BehaviorSubject<boolean>(false);
  inCall$ = this._inCallSubject$.asObservable();

  private clickedOutsideSubject$ = new Rx.BehaviorSubject<boolean>(false);
  clickedOutside$ = this.clickedOutsideSubject$.asObservable();

  isNewInboxWidgetInQueryParams$: Rx.Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private elref: ElementRef<HTMLElement>,
    private datastore: Datastore,
    private auth: Auth,
    private messagingChat: MessagingChat,
    private localStorage: LocalStorage,
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.authState$.pipe(map(state => !!state));

    const currentUserId$ = this.auth.getUserId();
    this.currentUserDoc = this.datastore.document<UsersCollection>(
      'users',
      currentUserId$,
    );

    this.chatViewState$ = this.messagingChat.getViewState();

    const initialMinimisedState$ = this.localStorage
      .get(threadListMinimiseKey)
      .pipe(
        take(1),
        map(state => state || false),
      );
    this.isMinimised$ = Rx.combineLatest([
      Rx.concat(initialMinimisedState$, this._isMinimisedSubject$),
      this.chatViewState$,
    ]).pipe(
      map(
        ([isMinimised, viewState]) =>
          isMinimised && viewState === ChatViewState.COMPACT,
      ),
    );

    this.isNewInboxWidgetInQueryParams$ = this.activatedRoute.queryParams.pipe(
      map(queryParams => convertToParamMap(queryParams).has('newInboxWidget')),
      distinctUntilChanged(),
    );
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: Element) {
    const clickedOn = this.elref.nativeElement.contains(target);
    this.clickedOutsideSubject$.next(!clickedOn);
  }

  @HostListener('window:blur', ['$event.target'])
  onBlur(target: Element) {
    this.clickedOutsideSubject$.next(true);
  }

  setInCall(state: boolean) {
    this._inCallSubject$.next(state);
  }

  setMinimise(state: boolean) {
    this.localStorage.set(threadListMinimiseKey, state);
    this._isMinimisedSubject$.next(state);
  }
}

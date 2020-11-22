import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  Agent,
  AgentsCollection,
  AgentSessionsCollection,
  Contest,
  ContestsCollection,
  Message,
  MessagesCollection,
  OnlineOfflineCollection,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  ThreadProject,
  ThreadProjectsCollection,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { isDefined, toNumber } from '@freelancer/utils';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { AgentStateApi, SourceTypeApi } from 'api-typings/support/support';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  tap,
} from 'rxjs/operators';
import { ThreadLoadingState } from '../messaging-thread-view/messaging-thread-view.component';

@Component({
  selector: 'app-messaging-chat-box',
  template: `
    <fl-bit class="ChatBox" flTrackingSection="Chatbox">
      <app-messaging-header
        [contextObject]="contextObject$ | async"
        [loggedInUser]="loggedInUser$ | async"
        [membersActivityStatus]="membersActivityStatus$ | async"
        [otherMembers]="activeOtherMembers$ | async"
        [supportAgent]="supportAgent$ | async"
        [thread]="thread$ | async"
      ></app-messaging-header>
      <app-messaging-thread-view
        class="Chatbox-threadView"
        [allChatMembers$]="allChatMembers$"
        [canLoadMoreMessages$]="canLoadMoreMessages$"
        [loading$]="messageListLoading$"
        [loadingState$]="loadingState$"
        [membersActivityStatus$]="membersActivityStatus$"
        [messages$]="sortedMessages$"
        (loadMoreMessage)="handleLoadMoreMessage()"
      ></app-messaging-thread-view>
    </fl-bit>
  `,
  styleUrls: ['./messaging-chat-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingChatBoxComponent implements OnInit {
  @Input() team$: Rx.Observable<Team>;
  @Input() thread$: Rx.Observable<Thread>;

  loggedInUser$: Rx.Observable<User>;
  isLoggedInUserSupportAgent$: Rx.Observable<boolean>;
  allChatMembers$: Rx.Observable<ReadonlyArray<User>>;
  activeOtherMembers$: Rx.Observable<ReadonlyArray<User>>;
  membersActivityStatus$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  contextObject$: Rx.Observable<ThreadProject | Contest | undefined>;

  supportAgent$: Rx.Observable<Agent | undefined>;

  readonly MESSAGE_LIST_INCREMENT = 50;
  readonly MESSAGE_LIST_LIMIT_MAX = 5000;
  private _messagesLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.MESSAGE_LIST_INCREMENT,
  );
  messagesLimit$ = this._messagesLimitSubject$.asObservable();
  sortedMessages$: Rx.Observable<ReadonlyArray<Message>>;
  messageListLoading$: Rx.Observable<boolean>;
  canLoadMoreMessages$: Rx.Observable<boolean>;

  private _loadingStateSubject$ = new Rx.BehaviorSubject<ThreadLoadingState>(
    ThreadLoadingState.LOAD_THREAD,
  );
  loadingState$ = this._loadingStateSubject$.asObservable();

  constructor(private auth: Auth, private datastore: Datastore) {}

  ngOnInit() {
    const loggedInUserId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));

    this.allChatMembers$ = this.datastore
      .collection<UsersCollection>(
        'users',
        this.thread$.pipe(map(t => [...t.inactiveMembers, ...t.members])),
      )
      .valueChanges();

    this.loggedInUser$ = Rx.combineLatest([
      this.allChatMembers$,
      loggedInUserId$,
    ]).pipe(
      map(([allChatMembers, loggedInUserId]) =>
        allChatMembers.find(member => member.id === loggedInUserId),
      ),
      filter(isDefined),
    );

    this.activeOtherMembers$ = Rx.combineLatest([
      this.thread$,
      this.allChatMembers$,
    ]).pipe(
      map(([thread, allMembers]) =>
        allMembers.filter(member => thread.otherMembers.includes(member.id)),
      ),
    );

    this.membersActivityStatus$ = this.datastore
      .collection<OnlineOfflineCollection>(
        'onlineOffline',
        this.thread$.pipe(map(t => t.members)),
      )
      .valueChanges();

    const agentSessionCollection = this.datastore.collection<
      AgentSessionsCollection
    >('agentSessions', query =>
      query.where(
        'sessionId',
        '==',
        this.thread$.pipe(
          map(t =>
            t.context.type === ContextTypeApi.SUPPORT_SESSION
              ? t.context.id
              : undefined,
          ),
          filter(isDefined),
        ),
      ),
    );

    const agentSession$ = agentSessionCollection.valueChanges().pipe(
      map(sessions => sessions[0]),
      // There should be a session here however there is an issue with the
      // agent session API which wont return sessions that you don't own.
      // See: https://phabricator.tools.flnltd.com/T76418
      filter(isDefined),
    );

    const supportAgentMembers$ = this.datastore
      .collection<AgentsCollection>('agents', query =>
        query
          .where('userId', 'in', this.thread$.pipe(map(t => t.members)))
          .where('state', 'in', [
            // exclude disabled agent state
            AgentStateApi.AVAILABLE,
            AgentStateApi.AWAY,
            AgentStateApi.UNAVAILABLE,
          ]),
      )
      .valueChanges();

    this.isLoggedInUserSupportAgent$ = Rx.combineLatest([
      loggedInUserId$,
      supportAgentMembers$,
    ]).pipe(
      map(([loggedInUserId, agents]) =>
        agents.map(agent => agent.userId).includes(loggedInUserId),
      ),
    );

    this.supportAgent$ = Rx.combineLatest([
      agentSession$.pipe(startWith(undefined)),
      this.isLoggedInUserSupportAgent$,
      this.activeOtherMembers$,
      this.loggedInUser$,
      supportAgentMembers$,
    ]).pipe(
      map(
        ([
          agentSession,
          isSupportAgent,
          otherMembers,
          currentUser,
          supportAgents,
        ]) => {
          if (supportAgents.length === 0) {
            return undefined;
          }

          return isSupportAgent
            ? supportAgents.find(agent =>
                // If the thread is associated with a support session then only return
                // the agent which is of the same support type as the agent session.
                agentSession
                  ? agent.userId === currentUser.id &&
                    agent.type === agentSession.type
                  : agent.userId === currentUser.id,
              )
            : supportAgents.find(agent =>
                otherMembers.map(member => member.id).includes(agent.userId),
              );
        },
      ),
    );

    const messagesCollection = this.datastore.collection<MessagesCollection>(
      'messages',
      query =>
        this.thread$.pipe(
          tap(() => {
            // Reset the message limit whenever the thread updates
            this._loadingStateSubject$.next(ThreadLoadingState.LOAD_THREAD);
            this._messagesLimitSubject$.next(this.MESSAGE_LIST_INCREMENT);
          }),
          filter(thread => !thread.isFake && thread.id > 0),
          map(thread => thread.id),
          distinctUntilChanged(),
          map(threadId =>
            query
              .where('threadId', '==', threadId)
              .limit(
                this.messagesLimit$.pipe(
                  map(limit =>
                    Math.min(limit + 1, this.MESSAGE_LIST_LIMIT_MAX),
                  ),
                ),
              ),
          ),
        ),
    );

    const messages$ = messagesCollection.valueChanges();

    this.messageListLoading$ = messagesCollection.status$.pipe(
      map(messages => !messages.ready),
    );

    // FIXME: T213899 show a banner if user has reached max number
    // of messages that can be loaded
    this.canLoadMoreMessages$ = Rx.combineLatest([
      messages$,
      this.messagesLimit$,
    ]).pipe(
      map(
        ([messages, messagesLimit]) =>
          messages.length > messagesLimit &&
          messages.length < this.MESSAGE_LIST_LIMIT_MAX,
      ),
    );

    this.sortedMessages$ = Rx.combineLatest([
      messages$,
      this.messagesLimit$,
    ]).pipe(
      map(([messages, messagesLimit]) => messages.slice(0, messagesLimit)),
      // TODO: Combine with queued and error messages
      map(messages => {
        // Mark rich message duplicates (same category field).
        const seen: { [index: string]: boolean } = {};
        return messages
          .sort((a, b) =>
            a.timeCreated === b.timeCreated
              ? a.id - b.id
              : a.timeCreated - b.timeCreated,
          )
          .reduceRight((acc, msg) => {
            const message = JSON.parse(JSON.stringify(msg));
            if (message.richMessage) {
              if (seen[message.richMessage.category]) {
                message.richMessage.disabled = true;
              }
              seen[message.richMessage.category] = true;
            }
            return [message, ...acc];
          }, [] as Message[]);
      }),
    );

    const projectId$ = Rx.merge(
      this.thread$.pipe(
        map(t =>
          t.context.type === ContextTypeApi.PROJECT ? t.context.id : undefined,
        ),
        filter(isDefined),
      ),
      agentSession$.pipe(
        // Project from agent session with source type `project`
        filter(
          agentSession =>
            agentSession.sessionSourceType === SourceTypeApi.PROJECT,
        ),
        map(agentSession => agentSession.sessionSourceId),
      ),
    );

    const projectDocument = this.datastore.document<ThreadProjectsCollection>(
      'threadProjects',
      projectId$,
    );

    const contestDocument = this.datastore.document<ContestsCollection>(
      'contests',
      this.thread$.pipe(
        map(t =>
          t.context.type === ContextTypeApi.CONTEST ? t.context.id : undefined,
        ),
        filter(isDefined),
      ),
    );

    this.contextObject$ = Rx.merge(
      projectDocument.valueChanges(),
      contestDocument.valueChanges(),
    ).pipe();
  }

  handleLoadMoreMessage() {
    this._loadingStateSubject$.next(ThreadLoadingState.LOAD_MORE_MESSAGES);
    this._messagesLimitSubject$.next(
      Math.min(
        this._messagesLimitSubject$.getValue() + this.MESSAGE_LIST_INCREMENT,
        this.MESSAGE_LIST_LIMIT_MAX,
      ),
    );
  }
}

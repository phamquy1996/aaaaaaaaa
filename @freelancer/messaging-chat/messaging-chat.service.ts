import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ThreadContext, ThreadType } from '@freelancer/datastore/collections';
import { DraftMessage, LocalStorage } from '@freelancer/local-storage';
import { Location } from '@freelancer/location';
import { FreelancerBreakpoints } from '@freelancer/ui/breakpoints';
import { isDefined, objectFilter } from '@freelancer/utils';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';
import { map, take } from 'rxjs/operators';

const chatDraftExpiryDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface Chat {
  /** Users in the chat. Does not need to include the current user. */
  userIds: ReadonlyArray<number>;
  threadType: ThreadType;
  origin: string;
  context?: ThreadContext;
  threadId?: number;
  focus?: boolean;
}

export enum ChatViewState {
  NONE = 'none',
  COMPACT = 'compact',
  FULL = 'full',
}

export enum InboxViewState {
  PAGE = 'page',
  COLUMN = 'column',
}

type LiveChatHandler = (chat: Chat) => void;

@Injectable({
  providedIn: 'root',
})
export class MessagingChat {
  private liveChatHandler?: LiveChatHandler;

  private disableToastNotificationsSubject$ = new Rx.BehaviorSubject(false);
  isToastDisabled$ = this.disableToastNotificationsSubject$.asObservable();

  constructor(
    private location: Location,
    private localStorage: LocalStorage,
    private breakpointObserver: BreakpointObserver,
  ) {}

  canStartChat(): boolean {
    return isDefined(this.liveChatHandler);
  }

  /*
   * Use that to start a new chat session
   */
  startChat({
    userIds,
    threadType,
    origin,
    context,
    threadId,
    focus = true,
    // By default the user gets redirected to the Inbox when the live chat
    // isn't loaded. Use that flag to disable that.
    doNotRedirect = false,
  }: Chat & { doNotRedirect?: boolean }): void {
    // If the live chat isn't loaded, redirect to the Inbox to start a chat
    if (!this.liveChatHandler) {
      if (doNotRedirect) {
        return;
      }
      if (threadId) {
        this.location.navigateByUrl(`/messages/thread/${threadId}`);
      } else {
        const url = new URL(`${window.location.origin}/messages/new`);
        const params = url.searchParams;

        params.append('thread_type', threadType);

        if (context) {
          params.append('context_type', context.type);
          if (context.type !== ContextTypeApi.NONE) {
            params.append('context_id', context.id.toString());
          }
        }

        userIds.forEach(uid => {
          params.append('members', uid.toString());
        });
        this.location.navigateByUrl(`${url.pathname}${url.search}`);
      }
    } else {
      this.liveChatHandler({
        userIds,
        threadType,
        origin,
        context,
        threadId,
        focus,
      });
    }
  }

  /*
   * This allows the on-page live chat to register itself, when it's loaded,
   * e.g. it might not be loaded on mobile/small screens or high-conversion
   * pages.
   *
   * It should not be used by anyone but the live chat component itself.
   */
  registerLiveChat(liveChatHandler: LiveChatHandler) {
    this.liveChatHandler = liveChatHandler;
  }

  /**
   * This allows the live chat component to unregister itself when becoming hidden.
   * It should not be used by anyone but the live chat component itself.
   */
  unregisterLiveChat() {
    this.liveChatHandler = undefined;
  }

  disableToastNotifications() {
    this.disableToastNotificationsSubject$.next(true);
  }

  enableToastNotifications() {
    this.disableToastNotificationsSubject$.next(false);
  }

  cleanStoredDraftMessages() {
    this.localStorage
      .get('webappChatDraftMessages')
      .pipe(take(1))
      .toPromise()
      .then(draftMessagesObject => {
        if (!draftMessagesObject) {
          return;
        }

        const cleanedDraftMsgsObject = objectFilter(
          draftMessagesObject,
          (key: string, dm: DraftMessage | null) => {
            if (!dm || !dm.lastUpdated) {
              return false;
            }
            if (Date.now() - dm.lastUpdated > chatDraftExpiryDuration) {
              return false;
            }
            return true;
          },
        );

        this.localStorage.set(
          'webappChatDraftMessages',
          cleanedDraftMsgsObject,
        );
      });
  }

  getDimensionLimits() {
    return {
      min: { height: 210, width: 260 }, // No smaller than the original chatbox size.
      max: { height: window.innerHeight - (64 + 50) - 40, width: 620 },
    };
  }

  /**
   * Given dimensions for a chatbox resize, return the constrained dimensions
   */
  constrainChatboxDimensions(dims: {
    height: number;
    width: number;
  }): { height: number; width: number } {
    const limits = this.getDimensionLimits();

    const newDims = { height: dims.height, width: dims.width };

    if (dims.height > limits.max.height) {
      newDims.height = limits.max.height;
    } else if (dims.height < limits.min.height) {
      newDims.height = limits.min.height;
    }

    if (dims.width > limits.max.width) {
      newDims.width = limits.max.width;
    } else if (dims.width < limits.min.width) {
      newDims.width = limits.min.width;
    }

    return newDims;
  }

  /**
   * Given dimensions for a chatbox resize, return whether or not it's valid
   */
  isValidChatboxDimensions(dims: { height: number; width: number }): boolean {
    const limits = this.getDimensionLimits();

    return !(
      dims.height > limits.max.height ||
      dims.height < limits.min.height ||
      dims.width > limits.max.width ||
      dims.width < limits.min.width
    );
  }

  /**
   * Returns the view state for messaging
   * - `NONE` = no messaging (mobiles and mobile viewports)
   * - `COMPACT` = small contact list (tablet to desktop-xxl)
   * - `FULL` = full-height contact list (desktop-xxl and up)
   */
  getViewState(): Rx.Observable<ChatViewState> {
    return this.breakpointObserver
      .observe([
        FreelancerBreakpoints.TABLET,
        FreelancerBreakpoints.DESKTOP_XXLARGE,
      ])
      .pipe(
        map(state => {
          if (!state.breakpoints[FreelancerBreakpoints.TABLET]) {
            return ChatViewState.NONE;
          }
          if (!state.breakpoints[FreelancerBreakpoints.DESKTOP_XXLARGE]) {
            return ChatViewState.COMPACT;
          }
          return ChatViewState.FULL;
        }),
      );
  }

  /**
   * Returns the view state for the messaging inbox
   * - `PAGE` = thread list and chats are separate pages (mobile)
   * - `COLUMN` = thread list and chats are columns on the same page (tablet+)
   */
  getInboxViewState(): Rx.Observable<InboxViewState> {
    return this.breakpointObserver
      .observe(FreelancerBreakpoints.TABLET)
      .pipe(
        map(state =>
          state.matches ? InboxViewState.COLUMN : InboxViewState.PAGE,
        ),
      );
  }

  /**
   * Given a list of chats with widths, filters it
   * to only include ones that would fit on-screen.
   */
  fitChatsToScreen<T extends { width: number }>(
    chats: T[],
    { offset = 0, gap = 0 } = {},
  ): T[] {
    let currentLeftPos = offset;
    return chats.filter(chat => {
      // add chat size and check if it would still fit on-screen
      currentLeftPos += chat.width + gap;
      return currentLeftPos < window.innerWidth;
    });
  }
}

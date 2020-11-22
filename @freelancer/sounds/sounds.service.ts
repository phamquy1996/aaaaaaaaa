import { Injectable } from '@angular/core';
import { Assets } from '@freelancer/ui/assets';

interface NotificationState {
  master?: number;
  registeredTabs: ReadonlyArray<number>;
}

@Injectable({ providedIn: 'root' })
export class Sounds {
  tabId: number;
  storageKey = 'sound_service_0.0.1';
  lastNotified: number;
  messageSound: HTMLAudioElement;
  readonly notificationWaitPeriod = 1000;
  readonly millisecondsInADay = 24 * 60 * 60 * 1000;

  constructor(private assets: Assets) {
    this.tabId = Date.now() + window.performance.now();
    this.lastNotified = 0;
    window.addEventListener('focus', e => this.handleEvent(e));
    window.addEventListener('unload', e => this.handleEvent(e));
    this.initialiseAsMaster();
    this.messageSound = new Audio(this.assets.getUrl('sounds/message.mp3'));
    if (this.messageSound) {
      this.messageSound.load();
    }
  }

  initialiseAsMaster() {
    const state = this.getState();
    if (!state.master || state.master === undefined || document.hasFocus()) {
      state.master = this.tabId;
    }
    // filter out old registeredTabs that may be left over for more than 24 hours
    state.registeredTabs = state.registeredTabs.filter(
      tabId => tabId > this.tabId - this.millisecondsInADay,
    );
    state.registeredTabs = [...state.registeredTabs, this.tabId];
    this.setState(state);
  }

  handleEvent(event: Event) {
    if (event.type === 'focus') {
      const state = this.getState();
      state.master = this.tabId;
      this.setState(state);
    } else if (event.type === 'unload') {
      const state = this.getState();
      state.registeredTabs = state.registeredTabs.filter(
        tabId => tabId !== this.tabId,
      );
      if (state.master === this.tabId) {
        state.master = undefined;
      }
      this.setState(state);
    }
  }

  handleNotification(type: string) {
    const state = this.getState();
    if (state.master === undefined) {
      state.master = this.tabId;
      this.setState(state);
    }
    if (
      this.lastNotified > Date.now() - this.notificationWaitPeriod ||
      state.master !== this.tabId
    ) {
      return;
    }
    if (type === 'message' && this.messageSound) {
      this.messageSound
        .play()
        .then(() => {
          this.lastNotified = Date.now();
        })
        .catch(error => {
          // Autoplay was prevented.
          console.warn(error);
        });
    }
  }

  getState(): NotificationState {
    const notificationState = localStorage.getItem(this.storageKey);
    const initialState = { master: undefined, registeredTabs: [] };

    try {
      return notificationState ? JSON.parse(notificationState) : initialState;
    } catch (e) {
      return initialState;
    }
  }

  setState(newState: NotificationState) {
    if (localStorage) {
      localStorage.setItem(this.storageKey, JSON.stringify(newState));
    }
  }

  /**
   * Checks if the browser can play audio
   *
   * @privateRemarks
   *
   * TODO: Apply this check to other methods in the `Sounds` service to prevent
   * the service from running on incompatible browsers
   *
   * FIXME: The browser having audio capabilities does not guarantee a sound to
   * be played/playable; we should improve that check and/or find a way to
   * handle those play() errors nicely.
   */
  isAudioCapable(): boolean {
    return !!window.AudioContext || !!window.webkitAudioContext;
  }
}

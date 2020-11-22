import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  NotificationsPreferenceEntry,
  NotificationsPreferencesCollection,
} from '@freelancer/datastore/collections';
import { LocalStorage } from '@freelancer/local-storage';
import { Margin } from '@freelancer/ui/margin';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

const threadListMinimiseKey = 'webappThreadListMinimise';

@Component({
  selector: 'app-messaging-inbox-widget',
  template: `
    <fl-bit
      class="MessagingInboxWidget"
      [ngClass]="{
        'MessagingInboxWidget--minimized': isMinimised$ | async
      }"
    >
      <app-messaging-inbox-widget-header
        [chatSoundSetting]="chatSoundSetting$ | async"
        [isMinimised]="isMinimised$ | async"
        (shouldMinimise)="toggleMinimise($event)"
        (toggleChatSound)="toggleChatSound($event)"
      ></app-messaging-inbox-widget-header>
      <app-messaging-threads class="MessagingInboxWidgetThreads">
      </app-messaging-threads>
    </fl-bit>
  `,
  styleUrls: ['./messaging-inbox-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingInboxWidgetComponent implements OnInit {
  Margin = Margin;

  readonly THREADS_LIMIT_INCREMENT = 15;

  chatSoundSetting$: Rx.Observable<NotificationsPreferenceEntry | undefined>;
  isMinimised$: Rx.Observable<boolean>;
  notificationSettingsCollection: DatastoreCollection<
    NotificationsPreferencesCollection
  >;

  constructor(
    private datastore: Datastore,
    private localStorage: LocalStorage,
  ) {}

  ngOnInit() {
    this.notificationSettingsCollection = this.datastore.collection<
      NotificationsPreferencesCollection
    >('notificationsPreferences');

    this.chatSoundSetting$ = this.notificationSettingsCollection
      .valueChanges()
      .pipe(
        map(notificationSettings => {
          const settings = notificationSettings.filter(
            notificationSetting =>
              notificationSetting.notificationType === 'messages' &&
              notificationSetting.channel === 'chat_sound',
          );
          return settings.length > 0 ? settings[0] : undefined;
        }),
      );

    this.isMinimised$ = this.localStorage
      .get(threadListMinimiseKey)
      .pipe(map(state => state || false));
  }

  toggleMinimise(state: boolean) {
    this.localStorage.set(threadListMinimiseKey, state);
  }

  toggleChatSound(chatSetting: NotificationsPreferenceEntry) {
    this.notificationSettingsCollection.set('chat_sound', chatSetting);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Thread, ThreadType } from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import { ContextTypeApi, FolderApi } from 'api-typings/messages/messages_types';

interface NewMessageOptions {
  thread_type: ThreadType;
  context_type: ContextTypeApi;
  context_id?: number;
  members: ReadonlyArray<number>;
}

@Component({
  selector: 'app-settings-overlay-content',
  template: `
    <!-- the fact that this doesn't all go in one list is probably bad -->
    <fl-list
      [bottomBorder]="true"
      [clickable]="true"
      [padding]="ListItemPadding.XXSMALL"
      [type]="ListItemType.DEFAULT"
    >
      <fl-list-item
        *ngIf="chatBoxMode"
        flTrackingLabel="settingsInbox"
        (click)="inboxRedirect()"
      >
        <fl-icon
          [color]="IconColor.PRIMARY"
          [size]="IconSize.SMALL"
          [flMarginRight]="Margin.XSMALL"
          [name]="'ui-inbox'"
        >
        </fl-icon>
        <fl-text
          [size]="TextSize.XSMALL"
          [fontType]="FontType.SPAN"
          i18n="Chatbox settings content item"
          >Open this chat in your inbox
        </fl-text>
      </fl-list-item>
    </fl-list>
    <fl-list [type]="ListItemType.CHECKBOX" [padding]="ListItemPadding.XXSMALL">
      <ng-container *ngIf="formGroup.get('archive') as control">
        <fl-list-item
          *ngIf="isFormControl(control)"
          flTrackingLabel="settingsArchive"
          [control]="control"
          (click)="handleArchiveClick()"
        >
          <fl-bit class="SettingListItem">
            <fl-text
              [size]="TextSize.XSMALL"
              i18n="Chatbox settings content item"
            >
              Archive
            </fl-text>
            <fl-text
              [color]="FontColor.MID"
              [size]="TextSize.XXSMALL"
              i18n="Chatbox settings content description"
            >
              Hide this chat from your active chats. You will still receive
              notifications.
            </fl-text>
          </fl-bit>
        </fl-list-item>
      </ng-container>
      <ng-container *ngIf="formGroup.get('mute') as control">
        <fl-list-item
          *ngIf="isFormControl(control)"
          flTrackingLabel="settingsMute"
          [control]="control"
          (click)="handleMuteClick()"
        >
          <fl-bit class="SettingListItem">
            <fl-text
              [size]="TextSize.XSMALL"
              i18n="Chatbox settings content item"
            >
              Mute
            </fl-text>
            <fl-text
              [color]="FontColor.MID"
              [size]="TextSize.XXSMALL"
              i18n="Chatbox settings content description"
            >
              You will receive no notifications for future messages.
            </fl-text>
          </fl-bit>
        </fl-list-item>
      </ng-container>
      <ng-container *ngIf="formGroup.get('block') as control">
        <fl-list-item
          *ngIf="
            thread.otherMembers.length === 1 &&
            !['group', 'team', 'team_official'].includes(thread.threadType) &&
            thread.writePrivacy !== 'owner_autochat' &&
            isFormControl(control)
          "
          flTrackingLabel="settingsBlock"
          [control]="control"
          (click)="handleBlockClick()"
        >
          <fl-bit class="SettingListItem">
            <fl-text
              [size]="TextSize.XSMALL"
              i18n="Chatbox settings content item"
            >
              Block
            </fl-text>
            <fl-text
              [color]="FontColor.MID"
              [size]="TextSize.XXSMALL"
              i18n="Chatbox settings content description"
            >
              No members of this chat will be able to send any messages in it.
            </fl-text>
          </fl-bit>
        </fl-list-item>
      </ng-container>
    </fl-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsOverlayContentComponent implements OnInit, OnChanges {
  Margin = Margin;
  IconColor = IconColor;
  IconSize = IconSize;
  isFormControl = isFormControl;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  ListItemType = ListItemType;
  ListItemPadding = ListItemPadding;

  @Input() thread: Thread;
  @Input() chatBoxMode = true;

  @Output() archiveChatToggle = new EventEmitter<boolean>();
  @Output() muteChatToggle = new EventEmitter();
  @Output() blockChatToggle = new EventEmitter();

  formGroup = new FormGroup({
    archive: new FormControl(),
    mute: new FormControl(),
    block: new FormControl(),
  });

  constructor(private router: Router) {}

  ngOnInit() {
    this.formGroup.controls.archive.setValue(
      this.thread.folder === FolderApi.ARCHIVED,
    );
    this.formGroup.controls.mute.setValue(this.thread.isMuted);
    this.formGroup.controls.block.setValue(this.thread.isBlocked);
  }

  ngOnChanges(changes: SimpleChanges) {
    // when we get updates to the thread, update the values and re-enable the controls.
    if (changes.thread && changes.thread.previousValue) {
      const archived = this.thread.folder === FolderApi.ARCHIVED;
      if (changes.thread.previousValue.folder !== this.thread.folder) {
        this.formGroup.controls.archive.setValue(archived);
        this.formGroup.controls.archive.enable();
      }
      if (changes.thread.previousValue.isMuted !== this.thread.isMuted) {
        this.formGroup.controls.mute.setValue(this.thread.isMuted);
        this.formGroup.controls.mute.enable();
      }
      if (changes.thread.previousValue.isBlocked !== this.thread.isBlocked) {
        this.formGroup.controls.block.setValue(this.thread.isBlocked);
        this.formGroup.controls.block.enable();
      }
    }
  }

  handleArchiveClick() {
    if (this.formGroup.controls.archive.enabled) {
      this.formGroup.controls.archive.disable();
      this.archiveChatToggle.emit(true);
    }
  }

  handleMuteClick() {
    if (this.formGroup.controls.mute.enabled) {
      this.formGroup.controls.mute.disable();
      this.muteChatToggle.emit(true);
    }
  }

  handleBlockClick() {
    if (this.formGroup.controls.block.enabled) {
      this.formGroup.controls.block.disable();
      this.blockChatToggle.emit(true);
    }
  }

  inboxRedirect() {
    // redirect fake threads to new-thread
    if (this.thread.isFake) {
      const { threadType, members, context } = this.thread;

      const newMessageOptions: NewMessageOptions = {
        thread_type: threadType,
        context_type: context.type,
        context_id:
          context.type !== ContextTypeApi.NONE ? context.id : undefined,
        members,
      };

      this.router.navigate(['/messages/new'], {
        queryParams: {
          newMessageOptions,
        },
      });
    }

    this.router.navigate(['/messages/thread', this.thread.id]);
  }
}

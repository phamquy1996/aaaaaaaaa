import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Thread } from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { LocalStorage } from '@freelancer/local-storage';
import { TimeUtils } from '@freelancer/time-utils';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { FileSelectMode } from '@freelancer/ui/file-select';
import { Margin } from '@freelancer/ui/margin';
import { take } from 'rxjs/operators';
import { AutoGrowDirective } from './auto-grow.directive';

@Component({
  selector: 'app-typing-box',
  template: `
    <fl-bit
      class="TypingBox"
      [ngClass]="{ 'TypingBox-inboxChatContainer': !isChatBoxMode }"
    >
      <textarea
        class="TextArea"
        #textarea="autogrow"
        appAutoGrow
        flTrackingLabel="TypingBox"
        i18n-placeholder="Chatbox typing box placeholder"
        placeholder="Enter your message..."
        rows="1"
        [(ngModel)]="textValue"
        (keydown)="handleKeyDownEvent($event)"
        (keyup)="handleKeyUpEvent($event)"
        (paste)="handlePasteEvent($event)"
        data-uitest-target="chatbox-input-field"
        maxlength="15000"
      ></textarea>
      <fl-emoji-picker
        class="TrayItem"
        [disabled]="thread && !thread.isFake && thread.writePrivacy === 'none'"
        [flMarginRight]="isChatBoxMode ? Margin.NONE : Margin.XXSMALL"
        (mousedown)="keepTextareaFocused($event)"
        (emojiPicked)="handleEmojiPicked($event)"
      ></fl-emoji-picker>
      <fl-file-select
        *flFeature="Feature.FILEUPLOAD"
        class="TrayItem"
        [flMarginRight]="isChatBoxMode ? Margin.NONE : Margin.XXSMALL"
        [multiple]="true"
        [fileSelectMode]="FileSelectMode.ICON"
        (onFileDropped)="onFileSelected($event)"
        [active]="!thread.isBlocked"
        flTrackingLabel="fileAttachment"
      ></fl-file-select>
      <fl-button
        *ngIf="!isChatBoxMode"
        flTrackingLabel="SendMessageLink"
        i18n="Send message button"
        [size]="ButtonSize.SMALL"
        [color]="ButtonColor.SECONDARY"
        [disabled]="!textValue && !hasAttachments"
        (mousedown)="keepTextareaFocused($event)"
        (click)="handleSendMessage()"
      >
        Send
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./typing-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingBoxComponent implements OnInit, OnChanges {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FileSelectMode = FileSelectMode;
  Feature = Feature;
  Margin = Margin;

  @Input() isChatBoxMode = false;
  @Input() hasAttachments: boolean;
  @Input() thread: Thread;
  @Input() threadIdentifierKey: string;

  @Output() sendMessage = new EventEmitter<string>();
  @Output() typingEvent = new EventEmitter<string>();
  @Output() focusTypingBox = new EventEmitter<number>();
  @Output() addAttachment = new EventEmitter<File>();

  @ViewChild('textarea') element: AutoGrowDirective;

  textValue = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private localStorage: LocalStorage,
    private timeUtils: TimeUtils,
  ) {}

  ngOnInit() {
    this.loadDraftMessage(this.threadIdentifierKey);
    this.timeUtils.setTimeout(() => this.element.adjust(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.threadIdentifierKey) {
      this.loadDraftMessage(this.threadIdentifierKey);
    }
  }

  // Keeps the textarea focused and prevents the virtual keyboard
  // from being closed on mobile when clicking outside the text area
  keepTextareaFocused(event: MouseEvent) {
    event.preventDefault();
  }

  handleSendMessage() {
    this.sendMessage.emit(this.textValue);
    this.textValue = '';
    this.typingEvent.emit(this.textValue);
    this.timeUtils.setTimeout(() => this.element.adjust(), 0);
  }

  handleKeyDownEvent(event: KeyboardEvent) {
    if (
      ((event.key && event.key.toLowerCase() === 'enter') ||
        // tslint:disable-next-line:deprecation
        (event.which || event.keyCode || event.charCode) === 13) && // Some browsers seem to be missing event.key
      !event.shiftKey
    ) {
      this.handleSendMessage();
      // Yes, this return statement is practically useless, but for some strange
      // reason deleting introduces a bug in the chat box where hitting enter
      // on an empty typing box creates a new line. Spooky.
      return false;
    }
  }

  handleKeyUpEvent(event: KeyboardEvent) {
    this.typingEvent.emit(this.textValue);
  }

  // FIXME: convert to use focus service on the textarea nativeElement
  // rather than ViewChilding and calling into the autogrow directive
  focus() {
    this.element.focus();
  }

  handlePasteEvent(event: ClipboardEvent) {
    if (this.thread.isFake || !event.clipboardData) {
      return;
    }
    const {
      clipboardData: { items = [] },
    } = event;

    Array.from(items).some(item => {
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if (blob) {
          const extension = item.type.split('/')[1];
          const file = new File([blob], `image.${extension}`);
          this.addAttachment.emit(file);
        }
        return true;
      }
      return false;
    });
  }

  handleEmojiPicked(emojiName: string) {
    if (!this.textValue) {
      this.textValue = emojiName;
    } else {
      this.textValue += ` ${emojiName}`;
    }
  }

  onFileSelected(file: File) {
    this.addAttachment.emit(file);
    this.focusTypingBox.emit(this.thread.id);
  }

  /* Draft Message Handling Functions (migration to local storage service) */
  loadDraftMessage(threadIdentifierKey: string): void {
    this.localStorage
      .get('webappChatDraftMessages')
      .pipe(take(1))
      .toPromise()
      .then((draftMessagesObject = {}) => {
        if (threadIdentifierKey) {
          const draftMessage = draftMessagesObject[threadIdentifierKey];
          this.textValue = draftMessage ? draftMessage.text : '';
        }

        this.changeDetectorRef.markForCheck();
      });
  }
}

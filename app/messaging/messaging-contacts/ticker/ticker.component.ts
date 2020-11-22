import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  NotificationEntry,
  ProjectFeedEntry,
} from '@freelancer/datastore/collections';
import { MessagingChat } from '@freelancer/messaging-chat';
import { BitComponent } from '@freelancer/ui/bit';
import { toNumber } from '@freelancer/utils';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

export type TickerItem =
  | {
      tag: 'notification';
      entry: NotificationEntry;
    }
  | {
      tag: 'project';
      entry: ProjectFeedEntry;
    };

@Component({
  selector: `app-ticker`,
  template: `
    <perfect-scrollbar flTrackingSection="ContactListTicker" [config]="{}">
      <fl-bit *ngFor="let item of items; trackBy: trackById">
        <app-notification-item
          *ngIf="item.tag === 'notification'"
          [size]="'small'"
          [event]="item.entry"
        ></app-notification-item>
        <app-project-item
          *ngIf="item.tag === 'project'"
          [size]="'small'"
          [entry]="item.entry"
        ></app-project-item>
      </fl-bit>
    </perfect-scrollbar>
  `,
  styleUrls: ['./ticker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerComponent
  implements AfterViewChecked, OnChanges, OnInit, OnDestroy {
  @Input() items: ReadonlyArray<TickerItem>;

  @ViewChild(PerfectScrollbarComponent)
  psbComponent: PerfectScrollbarComponent;
  @ViewChildren(BitComponent, { read: ElementRef })
  itemComponents: QueryList<ElementRef<HTMLElement>>;

  hasScrolledOnce = false;
  hasNewContent = false;
  prevHeight = 0;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private messagingChat: MessagingChat,
  ) {}

  ngOnInit() {
    // hide toast while ticker is visible
    this.messagingChat.disableToastNotifications();
  }

  ngOnDestroy() {
    this.messagingChat.enableToastNotifications();
  }

  ngOnChanges() {
    this.hasNewContent = true;
  }

  ngAfterViewChecked() {
    // only attempt to scroll after we have new content and have added it to the DOM
    if (
      this.hasNewContent &&
      this.psbComponent.directiveRef &&
      this.psbComponent.directiveRef.geometry().h !== this.prevHeight
    ) {
      this.hasNewContent = false;
      // only trigger load if we're at bottom or loading for first time
      if (this.isAtBottom() || !this.hasScrolledOnce) {
        this.prevHeight = this.psbComponent.directiveRef.geometry().h;
        requestAnimationFrame(() => this.scrollToBottom());
      }
    }
  }

  scrollToBottom() {
    if (this.psbComponent.directiveRef) {
      this.psbComponent.directiveRef.scrollToBottom();
      this.hasScrolledOnce = true;
    }
  }

  isAtBottom() {
    if (this.itemComponents.length === 0 || !this.psbComponent.directiveRef) {
      return true;
    }

    // check that the last message is the only thing between the scroll location and the bottom
    // this means that we were at the bottom before we received this message
    const geometry = this.psbComponent.directiveRef.geometry();
    const itemHeight = this.itemComponents.last.nativeElement.clientHeight;
    const tickerHeight = this.elementRef.nativeElement.clientHeight;
    // TODO broken lint rule T45841
    return (
      toNumber(geometry.y) + toNumber(itemHeight) + toNumber(tickerHeight) >=
      geometry.h
    );
  }

  trackById(index: number, item: TickerItem) {
    return item.entry.type + String(item.entry.id);
  }
}

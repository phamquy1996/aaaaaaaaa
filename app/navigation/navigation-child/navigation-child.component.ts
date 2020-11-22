import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Location } from '@freelancer/location';
import { ChatViewState, MessagingChat } from '@freelancer/messaging-chat';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import {
  ToastAlertColor,
  ToastAlertService,
  ToastAlertType,
} from '@freelancer/ui/toast-alert';
import { ViewHeaderTemplate } from '@freelancer/view-header-template';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

enum ChildNavLink {
  MESSAGES = '/messages',
  UPDATES = '/navigation/updates',
}

@Component({
  selector: 'app-navigation-child',
  template: `
    <ng-container *ngIf="!loading">
      <ng-container
        *ngIf="template && fullReplacement; else defaultView"
        [ngTemplateOutlet]="template"
      ></ng-container>

      <ng-template #defaultView>
        <fl-view-header [showBackButton]="!primary">
          <fl-bit class="NavigationChild" flTrackingSection="NavigationChild">
            <fl-bit class="NavigationChild-title">
              <ng-container *ngIf="template && !fullReplacement">
                <fl-heading
                  *ngIf="primary"
                  [color]="HeadingColor.INHERIT"
                  [headingType]="HeadingType.H1"
                  [size]="TextSize.LARGE"
                  [truncate]="true"
                >
                  <ng-container [ngTemplateOutlet]="template"></ng-container>
                </fl-heading>
                <fl-heading
                  *ngIf="!primary"
                  [color]="HeadingColor.INHERIT"
                  [headingType]="HeadingType.H1"
                  [size]="TextSize.MID"
                  [truncate]="true"
                >
                  <ng-container [ngTemplateOutlet]="template"></ng-container>
                </fl-heading>
              </ng-container>
            </fl-bit>

            <fl-bit *ngIf="!disableActions" class="NavigationChild-actions">
              <fl-button
                class="NavigationChild-action"
                flTrackingLabel="Updates"
                [ngClass]="{
                  IsActive: currentUrl === ChildNavLink.UPDATES
                }"
                [link]="ChildNavLink.UPDATES"
                (click)="handleUpdatesClick()"
              >
                <fl-bit class="IndicatorContainer">
                  <fl-icon
                    i18n-title="Updates Tab Title"
                    title="Updates Tab"
                    [color]="IconColor.INHERIT"
                    [size]="IconSize.LARGE"
                    [name]="'ui-bell-outline-v2'"
                  ></fl-icon>
                  <fl-unread-indicator
                    *ngIf="unreadUpdates > 0"
                    ariaLabel="Unread updates"
                    i18n-ariaLabel="Unread updates indicator label"
                    [counter]="unreadUpdates"
                  ></fl-unread-indicator>
                </fl-bit>
              </fl-button>

              <fl-button
                class="NavigationChild-action"
                flTrackingLabel="Messages"
                [ngClass]="{
                  IsActive: currentUrl === ChildNavLink.MESSAGES
                }"
                [link]="ChildNavLink.MESSAGES"
              >
                <ng-container
                  *ngTemplateOutlet="messagesUnreadIndicator"
                ></ng-container>
              </fl-button>

              <!-- Mobile new messages toast alert-->
              <fl-toast-alert
                *ngIf="
                  (chatViewState$ | async) === ChatViewState.NONE &&
                  currentUrl !== ChildNavLink.MESSAGES
                "
                i18n="Mobile new message alert text"
                [id]="MOBILE_NEW_MESSAGE_TOAST_ID"
                [color]="ToastAlertColor.LIGHT"
                [closeable]="true"
                [timeout]="5000"
                [type]="ToastAlertType.INFO"
              >
                <span [flMarginRight]="Margin.XSMALL">
                  <ng-container
                    *ngTemplateOutlet="messagesUnreadIndicator"
                  ></ng-container>
                </span>

                You have
                <fl-link
                  flTrackingSection="MobileNewMessageToast"
                  flTrackingLabel="ViewInbox"
                  [underline]="LinkUnderline.ALWAYS"
                  [link]="'/messages'"
                >
                  {{ messagesUnreadCount }} new
                  <ng-container
                    *ngIf="messagesUnreadCount === 1; else pluralMessages"
                  >
                    message
                  </ng-container>
                  <ng-template #pluralMessages>
                    messages
                  </ng-template>
                </fl-link>
              </fl-toast-alert>

              <ng-template #messagesUnreadIndicator>
                <fl-bit class="IndicatorContainer">
                  <fl-icon
                    [color]="IconColor.INHERIT"
                    [size]="IconSize.LARGE"
                    [name]="'ui-chat-square-outline'"
                  ></fl-icon>
                  <fl-unread-indicator
                    *ngIf="messagesUnreadCount > 0"
                    ariaLabel="Unread messages"
                    i18n-ariaLabel="Unread messages indicator label"
                    [counter]="messagesUnreadCount"
                  ></fl-unread-indicator>
                </fl-bit>
              </ng-template>
            </fl-bit>
          </fl-bit>
        </fl-view-header>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['./navigation-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationChildComponent implements OnChanges, OnDestroy, OnInit {
  ChatViewState = ChatViewState;
  ChildNavLink = ChildNavLink;
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  TextSize = TextSize;
  ToastAlertColor = ToastAlertColor;
  ToastAlertType = ToastAlertType;

  currentUrl: string;
  fullReplacement?: boolean;
  template?: TemplateRef<any>;
  loading: boolean;
  unreadUpdates = 0;

  chatViewState$: Rx.Observable<ChatViewState>;

  readonly MOBILE_NEW_MESSAGE_TOAST_ID = 'MobileNewMessageAlert';

  private viewHeaderTemplateSubscription?: Rx.Subscription;
  private locationSubscription?: Rx.Subscription;

  @Input() updatesUnreadCount = 0;
  @Input() primary = true;
  @Input() disableActions = false;
  @Input() messagesUnreadCount = 0;
  @Input() hideMobileNewMessageToast = true;

  constructor(
    private viewHeaderTemplate: ViewHeaderTemplate,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private messagingChat: MessagingChat,
    private toastAlertService: ToastAlertService,
  ) {}

  ngOnInit() {
    this.chatViewState$ = this.messagingChat.getViewState();

    // using `| async` causes ChangedAfterItHasBeenChecked errors
    // we do a manual subscription to get around this instead
    this.viewHeaderTemplateSubscription = this.viewHeaderTemplate
      .templateChanges()
      .subscribe(newTemplateConfig => {
        this.template = newTemplateConfig?.templateRef;
        this.fullReplacement = newTemplateConfig?.fullReplacement;
        this.changeDetectorRef.detectChanges();
      });

    this.locationSubscription = this.location
      .valueChanges()
      .pipe(map(location => location.pathname))
      .subscribe(pathname => {
        this.currentUrl = pathname;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('updatesUnreadCount' in changes) {
      this.unreadUpdates = this.updatesUnreadCount;
    }

    if (
      'messagesUnreadCount' in changes ||
      'hideMobileNewMessageToast' in changes
    ) {
      if (!this.hideMobileNewMessageToast) {
        if (this.messagesUnreadCount > 0) {
          this.toastAlertService.open(this.MOBILE_NEW_MESSAGE_TOAST_ID);
        } else {
          this.toastAlertService.close(this.MOBILE_NEW_MESSAGE_TOAST_ID);
        }
      }
    }
  }

  handleUpdatesClick() {
    this.unreadUpdates = 0;
  }

  ngOnDestroy() {
    if (this.viewHeaderTemplateSubscription) {
      this.viewHeaderTemplateSubscription.unsubscribe();
    }

    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}

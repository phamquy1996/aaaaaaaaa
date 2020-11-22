import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Link,
  RichMessageButtonInput,
  RichMessageDisplayType,
  RichMessagePayload,
  transformLinkUrl,
} from '@freelancer/datastore/collections';
import { RichMessagesRequests } from '@freelancer/rich-messages-requests';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-button-input',
  template: `
    <ng-container *ngIf="element.action === 'REDIRECT'">
      <fl-link
        *ngIf="displayClass === 'LinkHeading'; else buttonLink"
        flTrackingLabel="rich-message-button"
        [link]="transformedLink.url"
        [queryParams]="transformedLink.queryParams"
        [fragment]="transformedLink.fragment"
      >
        {{ element.label }}
      </fl-link>
      <ng-template #buttonLink>
        <fl-button
          flTrackingLabel="rich-message-button"
          [color]="color"
          [display]="'block'"
          [link]="transformedLink.url"
          [queryParams]="transformedLink.queryParams"
          [fragment]="transformedLink.fragment"
        >
          {{ element.label }}
        </fl-button>
      </ng-template>
    </ng-container>
    <ng-container *ngIf="element.action !== 'REDIRECT'">
      <fl-bit [flHide]="alreadyConfirming">
        <fl-button
          flTrackingLabel="rich-message-button"
          [color]="color"
          [display]="'block'"
          [ngClass]="displayClass"
          [disabled]="disabledSubject$ | async"
          [busy]="busy"
          (click)="handleClick()"
        >
          {{ element.label }}
        </fl-button>
      </fl-bit>

      <fl-bit [flHide]="!alreadyConfirming">
        <fl-button
          [color]="ButtonColor.SUCCESS"
          [disabled]="disabledSubject$ | async"
          class="ConfirmButton"
          flTrackingLabel="rich-message-button"
          (click)="handleClick(true)"
          data-uitest-target="richmessage-confirm"
          i18n="Chatbox rich message button"
        >
          Confirm
        </fl-button>

        <fl-button
          [color]="ButtonColor.DEFAULT"
          [disabled]="disabledSubject$ | async"
          flTrackingLabel="rich-message-button"
          (click)="handleClick(false)"
          i18n="Chatbox rich message button"
        >
          Cancel
        </fl-button>
      </fl-bit>
      <fl-banner-alert
        class="Error"
        *ngIf="currErrText"
        [type]="BannerAlertType.ERROR"
        [closeable]="false"
        [flMarginBottom]="Margin.XXSMALL"
      >
        <fl-interactive-text
          [link]="true"
          [content]="currErrText"
        ></fl-interactive-text>
      </fl-banner-alert>
    </ng-container>
  `,
  styleUrls: ['./button-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonInputComponent implements OnInit, OnDestroy {
  ButtonColor = ButtonColor;
  BannerAlertType = BannerAlertType;
  Margin = Margin;

  @Input() element: RichMessageButtonInput;
  @Input() displayType: RichMessageDisplayType = 'default';
  @Input() messageId: number;
  @Input() link = '';
  // FIXME A subject should not be an input. T69850
  @Input() disabledSubject$: Rx.BehaviorSubject<boolean>;
  // FIXME A subject should not be an input. T69850
  @Input() validInputElementsSubject$: Rx.Subject<boolean>;

  @Input() richMessageValues: RichMessagePayload;
  @Output() richMessageValuesChange = new EventEmitter<RichMessagePayload>();

  @Input() currentUserId: string;
  @Output() buttonPressFired = new EventEmitter<boolean>();
  @Output() submissionSuccess = new EventEmitter<boolean>();

  busy = false;
  // Nested subscriptions are horrid.
  // tslint:disable-next-line:readonly-array
  subscriptions: Rx.Subscription[] = [];

  color = ButtonColor.DEFAULT;
  currErrText: string;
  alreadyConfirming = false;
  displayClass = ''; // For styles that don't map to fl-input colors.
  displayTypeMap: { [index: string]: ButtonColor } = {
    success: ButtonColor.SUCCESS,
    info: ButtonColor.DEFAULT,
    blue: ButtonColor.SECONDARY,
    green: ButtonColor.SUCCESS,
    default: ButtonColor.DEFAULT,
    'post-project': ButtonColor.PRIMARY,
  };

  transformedLink: Link;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private richMessagesRequests: RichMessagesRequests,
  ) {}

  ngOnInit() {
    this.color = this.displayTypeMap[this.displayType] || ButtonColor.DEFAULT;
    switch (this.displayType as string) {
      case 'link-heading':
        this.color = ButtonColor.DEFAULT;
        this.displayClass = 'LinkHeading';
        break;
      default:
        break;
    }

    this.transformedLink = transformLinkUrl(this.link);

    this.subscriptions.push(
      this.validInputElementsSubject$.subscribe(allValid => {
        if (!allValid) {
          this.disabledSubject$.next(false);
          this.busy = false;
          return;
        }

        this.alreadyConfirming = false;

        const { action } = this.element;
        const request = {
          ...this.element.request,
          payload: {
            ...this.element.request.payload,
            ...this.richMessageValues,
          },
        };

        // TODO T46280 move .toUpperCase + relative url parsing to transformer
        if (action.toUpperCase() === 'REDIRECT') {
          // strip out domain and separate target from query params for router
          const relativeUrl = request.url
            .replace(/^(?:\/\/|[^/]+)*\//, '')
            .split('?');
          const queryParams = relativeUrl[1]
            .split('&')
            .reduce((allParams, nextParam) => {
              const parts = nextParam.split('=');
              return {
                ...allParams,
                [parts[0]]: parts[1],
              };
            }, {});
          this.router
            .navigate([relativeUrl[0]], { queryParams })
            .then(success => {
              this.busy = false;
              if (success) {
                this.disabledSubject$.next(true);
              } else {
                this.currErrText = 'Error: Failed to redirect.';
              }
            });
        } else {
          // Make the request.
          this.subscriptions.push(
            this.richMessagesRequests
              .request(request, action, this.messageId)
              // FIXME
              // eslint-disable-next-line rxjs/no-nested-subscribe
              .subscribe(resp => {
                this.busy = false;
                if (resp.status === 'error') {
                  this.disabledSubject$.next(false);
                  if (
                    resp.errorCode &&
                    this.element.errors &&
                    this.element.errors[resp.errorCode]
                  ) {
                    this.currErrText = this.element.errors[resp.errorCode];
                  } else {
                    this.currErrText = 'Unknown error.';
                  }
                } else {
                  this.currErrText = '';
                  this.submissionSuccess.emit(true);
                }
                this.changeDetectorRef.markForCheck();
              }),
          );
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleClick(wantToConfirm: boolean = true): void {
    const doClick = () => {
      this.busy = true;
      this.disabledSubject$.next(true);
      this.buttonPressFired.emit(true);
    };

    if (this.element.confirm) {
      if (wantToConfirm && this.alreadyConfirming) {
        doClick();
      } else {
        this.alreadyConfirming = wantToConfirm;
      }
    } else {
      doClick();
    }
    this.changeDetectorRef.markForCheck();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { QueryParams } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-notification-template',
  template: `
    <fl-card [edgeToEdge]="true" [flMarginBottom]="Margin.XXSMALL">
      <fl-banner-alert
        [type]="notificationType"
        [bannerTitle]="header"
        (close)="handleCloseBanner()"
      >
        <fl-text *ngIf="message"> {{ message }} </fl-text>
        <ng-container *ngIf="!message">
          <!-- This is the default fallback copy -->
          <ng-content></ng-content>
        </ng-container>

        <fl-text *ngIf="eventId" i18n> Event Id: {{ eventId }} </fl-text>

        <fl-text
          *ngIf="contactSupport"
          i18n="Notification banner - support information"
        >
          Please do not hesitate to contact our
          <fl-link
            flTrackingLabel="supportLink"
            [link]="'/support'"
            [newTab]="true"
            [queryParams]="supportPageQueryParams"
          >
            Freelancer.com support
          </fl-link>
          if you need help.
        </fl-text>

        <fl-text *ngIf="cta && ctaLink">
          <fl-link flTrackingLabel="{{ 'ctaLink:' + cta }}" [link]="ctaLink">
            {{ cta }}
          </fl-link>
        </fl-text>
      </fl-banner-alert>
    </fl-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateComponent {
  BannerAlertType = BannerAlertType;
  Margin = Margin;

  @Input() notificationType: BannerAlertType;
  @Input() header: string;
  @Input() message: string;
  @Input() eventId: string;
  @Input() cta: string;
  @Input() ctaLink: string;
  @Input() contactSupport = false;

  @Output() bannerClose = new EventEmitter<void>();

  readonly supportPageQueryParams: QueryParams = {
    show_ticket_modal: 'true',
  };

  handleCloseBanner() {
    this.bannerClose.emit();
  }
}

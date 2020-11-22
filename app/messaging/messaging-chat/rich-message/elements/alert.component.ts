import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RichMessageAlert } from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-alert',
  template: `
    <fl-banner-alert
      [type]="
        element.alert_type === 'success'
          ? BannerAlertType.SUCCESS
          : BannerAlertType.ERROR
      "
      [closeable]="false"
      [flMarginBottom]="Margin.XXSMALL"
    >
      <fl-interactive-text
        [link]="true"
        [content]="element.text"
      ></fl-interactive-text>
    </fl-banner-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  BannerAlertType = BannerAlertType;
  Margin = Margin;

  @Input() element: RichMessageAlert;
}

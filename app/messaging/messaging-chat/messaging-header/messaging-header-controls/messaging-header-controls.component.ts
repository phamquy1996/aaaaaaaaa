import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-messaging-header-controls',
  template: `
    <fl-icon
      *ngIf="chatboxMode"
      flTrackingLabel="ExpandChatBox"
      [flMarginRight]="Margin.XSMALL"
      [name]="'ui-chevron-up'"
      [color]="iconColor"
    ></fl-icon>
    <fl-icon
      *ngIf="!chatboxMode"
      flTrackingLabel="VideoChatUser"
      [flMarginRight]="Margin.XSMALL"
      [name]="'ui-video-camera-v2'"
      [color]="iconColor"
    ></fl-icon>
    <fl-icon
      *ngIf="!chatboxMode"
      flTrackingLabel="CallUser"
      [flMarginRight]="Margin.XSMALL"
      [name]="'ui-phone-alt'"
      [color]="iconColor"
    ></fl-icon>
    <fl-icon
      flTrackingLabel="OpenSettingsChatBox"
      [flMarginRight]="chatboxMode ? Margin.XSMALL : Margin.NONE"
      [name]="'ui-cog-outline'"
      [color]="iconColor"
    ></fl-icon>
    <fl-icon
      *ngIf="chatboxMode"
      flTrackingLabel="CloseChatBox"
      [name]="'ui-close'"
      [color]="iconColor"
    ></fl-icon>
  `,
  styleUrls: ['./messaging-header-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingHeaderControlsComponent {
  Margin = Margin;

  @Input() chatboxMode: boolean;
  @Input() iconColor: IconColor;
}

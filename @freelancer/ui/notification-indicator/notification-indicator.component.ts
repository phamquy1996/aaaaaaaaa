import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fl-notification-indicator',
  template: `
    <ng-content></ng-content>
    <div *ngIf="active" class="RedDot"></div>
  `,
  styleUrls: ['./notification-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationIndicatorComponent {
  @Input() active: boolean;
}

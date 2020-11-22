import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QueryParams } from '@freelancer/ui/link';

@Component({
  selector: 'app-bar-item',
  template: `
    <a
      class="BarItem"
      routerLinkActive="IsActive"
      [routerLink]="link"
      [ngClass]="{ IsActive: linkIsActive }"
      [routerLinkActiveOptions]="{ exact: exactLink }"
      [flTrackingLabel]="flTrackingLabel"
      [queryParams]="queryParams"
    >
      <ng-content></ng-content>
    </a>
  `,
  styleUrls: ['./bar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarItemComponent {
  @Input() link: string;
  @Input() exactLink = false;
  @Input() flTrackingLabel: string;
  @Input() linkIsActive = false;
  @Input() queryParams?: QueryParams;
}

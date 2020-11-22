import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkIconPosition } from '@freelancer/ui/link';

@Component({
  selector: 'app-my-projects-view-all',
  template: `
    <fl-link
      i18n="Dashboard recent projects view all projects link"
      flTrackingLabel="ViewAllProjectsClicked"
      [link]="'/manage'"
      [iconName]="'ui-arrow-right'"
      [iconPosition]="LinkIconPosition.RIGHT"
    >
      View All
    </fl-link>
  `,
  styleUrls: ['./my-projects-view-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsViewAllComponent {
  LinkIconPosition = LinkIconPosition;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RichMessageHeading } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-heading',
  template: `
    {{ element.text }}
  `,
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
  @Input() element: RichMessageHeading;
}

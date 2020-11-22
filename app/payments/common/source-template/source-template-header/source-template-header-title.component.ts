import { Component, Input } from '@angular/core';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-source-template-header-title',
  template: `
    <fl-text
      [size]="TextSize.SMALL"
      [weight]="(selected$ | async) ? FontWeight.BOLD : FontWeight.NORMAL"
    >
      <ng-content></ng-content>
    </fl-text>
  `,
})
export class SourceTemplateHeaderTitleComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;

  // injected from parent
  @Input() selected$: Rx.Observable<boolean>;
}

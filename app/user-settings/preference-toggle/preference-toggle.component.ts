import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight } from '@freelancer/ui/text';

@Component({
  selector: 'app-preference-toggle',
  template: `
    <fl-bit class="PreferenceToggle">
      <fl-toggle
        [flTrackingLabel]="trackingLabel"
        [control]="control"
        [flMarginRight]="Margin.XXSMALL"
      >
      </fl-toggle>
      <fl-text [weight]="FontWeight.BOLD">{{ description }}</fl-text>
    </fl-bit>
  `,
  styleUrls: ['./preference-toggle.component.scss'],
})
export class PreferenceToggleComponent {
  Margin = Margin;
  FontWeight = FontWeight;

  @Input() control: FormControl;
  @Input() trackingLabel: string;
  @Input() description: string;
}

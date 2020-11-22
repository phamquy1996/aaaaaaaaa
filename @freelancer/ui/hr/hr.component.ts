import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontWeight, TextSize, TextTransform } from '@freelancer/ui/text';

@Component({
  selector: 'fl-hr',
  template: `
    <fl-text
      class="HrText"
      *ngIf="label"
      [size]="TextSize.XXSMALL"
      [weight]="FontWeight.BOLD"
      [textTransform]="TextTransform.UPPERCASE"
    >
      {{ label }}
    </fl-text>
  `,
  styleUrls: ['./hr.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;
  TextTransform = TextTransform;

  @Input() label: string;
}

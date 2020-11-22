import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { IconColor, IconSize } from '@freelancer/ui/icon';

/**
 * DO NOT USE THIS COMPONENT.
 *
 * This should only be used on the user profile hire me component.
 * This is a wrapper around the split button secondary button for testing purposes.
 *
 * TODO: remove this component when the copy for user profile hire me
 * has been modified.
 */
@Component({
  selector: 'app-hire-me-secondary-button',
  template: `
    <fl-button
      class="ChevronButton"
      flTrackingLabel="HireMeSplitButtonSecondary"
      [color]="ButtonColor.SECONDARY"
      [size]="ButtonSize.LARGE"
      [buttonGroupLast]="true"
    >
      <fl-icon
        [name]="chevronType"
        [size]="IconSize.SMALL"
        [color]="IconColor.LIGHT"
      ></fl-icon>
    </fl-button>
  `,
  styleUrls: ['./hire-me-secondary-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HireMeSecondaryButtonComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  IconColor = IconColor;
  IconSize = IconSize;

  @Input() chevronType: 'ui-chevron-down' | 'ui-chevron-up';
}

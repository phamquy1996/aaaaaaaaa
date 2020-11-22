import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '@freelancer/datastore/collections';
import { FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-overlay-template-discuss',
  template: `
    <fl-bit class="OnboardingOverlayTitle">
      <fl-text [size]="TextSize.SMALL" i18n="Chatbox overlay title">
        Don't forget to discuss goals and deadlines
      </fl-text>
    </fl-bit>
    <fl-bit class="OnboardingOverlayBody">
      <fl-text [fontType]="FontType.SPAN" i18n="Chatbox overlay body">
        Make sure you and {{ otherUser.displayName }} agree on exactly what the
        tasks to be completed are, and when each of them is due.</fl-text
      >
    </fl-bit>
  `,
  styleUrls: ['onboarding-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayTemplateDiscussComponent {
  FontType = FontType;
  TextSize = TextSize;

  @Input() otherUser: User;
}

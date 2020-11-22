import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SITE_NAME } from '@freelancer/config';
import { FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-overlay-template-offsite',
  template: `
    <fl-bit class="OnboardingOverlayTitle">
      <fl-text [size]="TextSize.SMALL" i18n="Chatbox overlay title">
        Always communicate and make payments through {{ siteName }}
      </fl-text>
    </fl-bit>
    <fl-bit class="OnboardingOverlayBody">
      <fl-text [fontType]="FontType.SPAN" i18n="Chatbox overlay body">
        Stay protected from scams and ensure you get paid by only communicating
        using the {{ siteName }} chat system. Never make payments outside
        {{ siteName }}.
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['onboarding-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayTemplateOffsiteComponent {
  FontType = FontType;
  TextSize = TextSize;

  constructor(@Inject(SITE_NAME) public siteName: string) {}
}

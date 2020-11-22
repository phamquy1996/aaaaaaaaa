import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project, Thread, User } from '@freelancer/datastore/collections';
import { FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-overlay-template-intro',
  template: `
    <fl-bit class="OnboardingOverlayTitle">
      <fl-text
        *ngIf="thread && thread.id"
        [size]="TextSize.SMALL"
        i18n="Chatbox overlay title"
      >
        {{ otherUser.displayName }} would like to chat to you about
        {{ project.title | truncateFilename: 100 }}
      </fl-text>
      <fl-text
        *ngIf="!thread || !thread.id"
        [size]="TextSize.SMALL"
        i18n="Chatbox overlay title"
      >
        You are about to start chatting to {{ otherUser.displayName }} about
        {{ project.title }}
      </fl-text>
    </fl-bit>
    <fl-bit class="OnboardingOverlayBody">
      <fl-text [fontType]="FontType.SPAN" i18n="Chatbox overlay body">
        Click 'Next' to see a few tips on how to make sure you and
        {{ otherUser.displayName }} have a great experience working together.
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['onboarding-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayTemplateIntroComponent {
  FontType = FontType;
  TextSize = TextSize;

  @Input() thread: Thread;
  @Input() otherUser: User;
  @Input() project: Project;
}

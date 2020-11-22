import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontColor, HighlightColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-messaging-typing-indicator',
  template: `
    <fl-text
      [ngSwitch]="usersTyping.length"
      [color]="FontColor.MID"
      [highlightColor]="HighlightColor.BLUE"
      [size]="TextSize.XSMALL"
    >
      <ng-container *ngSwitchCase="1" i18n="User is typing text">
        {{ usersTyping[0].displayName }} is typing...
      </ng-container>
      <ng-container *ngSwitchCase="2" i18n="User and one other are typing text">
        {{ usersTyping[0].displayName }} and 1 other are typing...
      </ng-container>
      <ng-container *ngSwitchDefault i18n="User and others are typing text">
        {{ usersTyping[0].displayName }} and {{ usersTyping.length - 1 }} others
      </ng-container>
    </fl-text>
  `,
  styleUrls: ['./messaging-typing-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingTypingIndicatorComponent {
  FontColor = FontColor;
  HighlightColor = HighlightColor;
  TextSize = TextSize;

  // FIXME: Should be an array of Users
  usersTyping: ReadonlyArray<{ displayName: string }> = [
    { displayName: 'Freelancer' },
    { displayName: 'Employer' },
  ];
}

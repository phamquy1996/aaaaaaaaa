import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-read-marker',
  template: `
    <fl-bit
      class="ReadMarkerContainer"
      *ngIf="user"
      i18n-title="Chatbox read marker title"
      title="Seen by {{ user.displayName }} at {{
        time | date: 'h:mma d MMMM y'
      }}"
    >
      <fl-picture
        *ngIf="user.avatar"
        class="ReadMarker"
        [src]="user.avatar"
        [externalSrc]="true"
        [boundedWidth]="true"
        i18n-alt="Chatbox read marker avatar alt text"
        alt="Seen by {{ user.displayName }}"
      ></fl-picture>
      <fl-bit class="ReadMarkerText" *ngIf="!user.avatar">
        {{ user.displayName[0].toUpperCase() }}
      </fl-bit>
    </fl-bit>
    <fl-icon *ngIf="isTyping" name="typing-icon"></fl-icon>
  `,
  styleUrls: ['./read-marker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadMarkerComponent {
  @Input() user: User;
  @Input() time: number;
  @Input() isTyping: boolean;
}

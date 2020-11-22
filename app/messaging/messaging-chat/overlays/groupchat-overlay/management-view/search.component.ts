import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { InputSize } from '@freelancer/ui/input';

@Component({
  selector: 'app-search',
  template: `
    <fl-input
      class="SearchInput"
      ngDefaultControl
      iconStart="ui-search"
      [control]="inputControl"
      [leftIconSize]="IconSize.SMALL"
      [leftIconColor]="IconColor.DARK"
      i18n-placeholder="Chatbox groupchat search placeholder"
      placeholder="Search for People"
      [size]="InputSize.SMALL"
      flTrackingLabel="groupChatSearch"
      (keypress)="handleInputKeypress($event)"
    ></fl-input>
  `,
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  IconColor = IconColor;
  IconSize = IconSize;
  InputSize = InputSize;
  @Input() inputControl: FormControl;
  @Output() keyEnter = new EventEmitter<void>();

  handleInputKeypress(event: KeyboardEvent) {
    if (
      (event.key && event.key.toLowerCase() === 'enter') ||
      // tslint:disable-next-line:deprecation
      (event.which || event.keyCode || event.charCode) === 13 // Some browsers seem to be missing event.key
    ) {
      this.keyEnter.emit();
    }
  }
}

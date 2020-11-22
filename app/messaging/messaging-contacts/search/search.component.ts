import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { InputSize } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontType } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

export enum SearchMode {
  USER = 'user',
  THREAD = 'thread',
}

@Component({
  selector: 'app-search',
  template: `
    <fl-input
      class="InputField"
      #searchInput
      ngDefaultControl
      flTrackingLabel="Search"
      iconStart="ui-search"
      [control]="inputControl"
      [leftIconSize]="IconSize.SMALL"
      [leftIconColor]="IconColor.DARK"
      [iconEnd]="(showClearInputIcon$ | async) ? 'ui-close' : undefined"
      [rightIconSize]="IconSize.SMALL"
      [rightIconColor]="IconColor.DARK"
      i18n-placeholder="Contact list search placeholder"
      placeholder="Search for People"
      [size]="InputSize.SMALL"
      [flMarginBottom]="
        threadSearchEnabled && showThreadSearchOption
          ? Margin.XSMALL
          : Margin.NONE
      "
      (keypress)="handleInputKeypress($event)"
      (iconEndClick)="handleClearInput()"
    ></fl-input>
    <fl-list
      class="ToggleContainer"
      *ngIf="threadSearchEnabled"
      [clickable]="true"
    >
      <fl-list-item
        *ngIf="showThreadSearchOption"
        flTrackingLabel="ThreadSearchToggle"
        (click)="handleThreadSearchToggle()"
      >
        <fl-icon name="ui-search" [size]="IconSize.SMALL"></fl-icon>
        <fl-text [fontType]="FontType.SPAN" i18n="Search mode label">
          Search your messages instead
        </fl-text>
      </fl-list-item>
    </fl-list>
  `,
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  Margin = Margin;
  FontType = FontType;
  IconColor = IconColor;
  IconSize = IconSize;
  InputSize = InputSize;

  @Input() inputControl: FormControl;
  @Input() threadSearchEnabled = false;
  @Input() showThreadSearchOption = false;
  @Input() searchMode = SearchMode.USER;

  @Output() keyEnter = new EventEmitter<void>();
  @Output() threadSearchSelected = new EventEmitter<void>();

  showClearInputIcon$: Rx.Observable<boolean>;
  contactsToggleSubscription?: Rx.Subscription;

  ngOnInit() {
    this.showClearInputIcon$ = this.inputControl.valueChanges.pipe(
      map(text => text.trim() !== ''),
      distinctUntilChanged(),
      startWith(false),
    );
  }

  handleThreadSearchToggle() {
    this.threadSearchSelected.emit();
  }

  handleInputKeypress(event: KeyboardEvent) {
    if (
      (event.key && event.key.toLowerCase() === 'enter') ||
      // tslint:disable-next-line:deprecation
      (event.which || event.keyCode || event.charCode) === 13 // Some browsers seem to be missing event.key
    ) {
      this.keyEnter.emit();
    }
  }

  handleClearInput() {
    this.inputControl.setValue('');
  }

  ngOnDestroy() {
    if (this.contactsToggleSubscription) {
      this.contactsToggleSubscription.unsubscribe();
    }
  }
}

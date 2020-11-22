import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { SplitButtonOption } from '@freelancer/ui/split-button';
import { FontType, TextSize } from '@freelancer/ui/text';

/**
 * DO NOT USE THIS COMPONENT.
 *
 * This should only be used on the user profile hire me component.
 * This is a copy of the split button but with less line height to
 * accommodate longer usernames.
 *
 * TODO: remove this component when the copy for user profile hire me
 * has been modified.
 */
@Component({
  selector: 'app-hire-me-split-button',
  template: `
    <fl-bit class="SplitButtonContainer" #cardOptions>
      <fl-bit class="ButtonGroup">
        <fl-button
          class="PrimaryButton"
          flTrackingLabel="HireMeSplitButtonPrimary"
          [color]="color"
          [display]="display"
          [link]="options[0].link"
          [size]="size"
          [busy]="busy"
          [buttonGroupFirst]="options.length > 1 && !busy"
          (click)="primaryClicked.emit(); hideOptions($event)"
        >
          {{ options[0].copy }}
        </fl-button>
        <app-hire-me-secondary-button
          *ngIf="options.length > 1 && !busy"
          [chevronType]="chevronType"
          (click)="toggleShouldShowOptions()"
        ></app-hire-me-secondary-button>
      </fl-bit>

      <fl-card
        class="OptionListCard"
        *ngIf="shouldShowOptions"
        [edgeToEdge]="true"
        [maxContent]="false"
      >
        <ul>
          <ng-container *ngFor="let option of options.slice(1)">
            <fl-text *ngIf="!option.link" [size]="TextSize.SMALL">
              <ng-container
                *ngTemplateOutlet="content; context: { $implicit: option }"
              ></ng-container>
            </fl-text>

            <fl-link
              *ngIf="option.link"
              flTrackingLabel="HireMeSecondaryOption"
              flTrackingReferenceType="button_text"
              [flTrackingLabel]="option.copy"
              [link]="option.link"
              [queryParams]="option.linkQueryParams"
            >
              <ng-container
                *ngTemplateOutlet="content; context: { $implicit: option }"
              ></ng-container>
            </fl-link>
          </ng-container>
        </ul>
      </fl-card>
    </fl-bit>

    <ng-template #content let-option>
      <fl-list-item
        flTrackingLabel="SplitButtonOption.{{ option.copy }}"
        [clickable]="true"
        [type]="ListItemType.NON_BORDERED"
        [padding]="ListItemPadding.SMALL"
        (click)="optionSelected.emit(option); hideOptions($event)"
      >
        <fl-bit class="OptionListItem">
          <fl-icon
            *ngIf="option.iconName"
            [name]="option.iconName"
            [size]="iconSize"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-icon>
          {{ option.copy }}
        </fl-bit>
      </fl-list-item>
    </ng-template>
  `,
  styleUrls: ['./hire-me-split-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HireMeSplitButtonComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  TextSize = TextSize;
  FontType = FontType;
  HoverColor = HoverColor;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;

  chevronColor = IconColor.LIGHT;
  chevronType: 'ui-chevron-down' | 'ui-chevron-up' = 'ui-chevron-down';
  color = ButtonColor.SECONDARY;
  display = 'block' as const;
  iconSize = IconSize.SMALL;
  shouldShowOptions = false;
  size = ButtonSize.LARGE;

  @Input() options: ReadonlyArray<SplitButtonOption>;
  @Input() busy: boolean;

  @Output() primaryClicked = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<SplitButtonOption>();

  @ViewChild('cardOptions', { read: ElementRef })
  cardOptions: ElementRef<HTMLElement>;

  // Listening for clicks outside the input component
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    if (
      event &&
      !this.cardOptions.nativeElement.contains(event.target as HTMLElement) &&
      this.shouldShowOptions
    ) {
      this.toggleShouldShowOptions();
    }
  }

  showOptions(e: MouseEvent) {
    e.stopPropagation();
    this.shouldShowOptions = true;
    this.updateChevron();
  }

  hideOptions(e: MouseEvent) {
    e.stopPropagation();
    this.shouldShowOptions = false;
    this.updateChevron();
  }

  toggleShouldShowOptions() {
    this.shouldShowOptions = !this.shouldShowOptions;
    this.updateChevron();
  }

  updateChevron() {
    this.chevronType = this.shouldShowOptions
      ? 'ui-chevron-up'
      : 'ui-chevron-down';
  }
}

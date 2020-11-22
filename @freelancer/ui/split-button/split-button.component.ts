import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import {
  LinkColor,
  LinkHoverColor,
  LinkUnderline,
  QueryParams,
} from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SplitButtonOptionComponent } from './split-button-option.component';
import { SplitButtonPrimaryComponent } from './split-button-primary.component';

export interface SplitButtonOption {
  copy: string;
  link?: string;
  linkQueryParams?: QueryParams;
  iconName?: string;
}

export enum SplitButtonOptionPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

@Component({
  selector: 'fl-split-button',
  template: `
    <fl-bit class="SplitButtonContainer" #cardOptions>
      <fl-bit class="ButtonGroup">
        <!-- Clean this up once all split button usage is migrated -->
        <ng-container *ngIf="options?.length > 0">
          <fl-split-button-primary
            [color]="color"
            [display]="display"
            [link]="options[0].link"
            [linkQueryParams]="options[0].linkQueryParams"
            [size]="size"
            [busy]="busy"
            [buttonGroupFirst]="options.length > 1"
            (primaryClicked)="primaryClicked.emit(); hideOptions()"
          >
            <ng-content></ng-content>
          </fl-split-button-primary>
        </ng-container>
        <ng-container *ngIf="splitButtonOptions?.length > 0">
          <ng-content select="fl-split-button-primary"></ng-content>
        </ng-container>
        <fl-button
          *ngIf="
            (options?.length > 1 && !busy) ||
            (splitButtonOptions?.length > 0 && !busy)
          "
          class="ChevronButton"
          title="More Options"
          i18n-title="More Options"
          [color]="color"
          [size]="size"
          [buttonGroupLast]="true"
          (click)="toggleShouldShowOptions()"
        >
          <fl-icon
            class="ChevronButtonIcon"
            [name]="chevronType"
            [size]="iconSize"
            [color]="chevronColor"
          ></fl-icon>
        </fl-button>
      </fl-bit>

      <fl-card
        #dropdown
        class="OptionListCard"
        *ngIf="shouldShowOptions"
        [edgeToEdge]="true"
        [maxContent]="false"
        [attr.data-position]="position"
      >
        <ul>
          <!-- Clean this up once all split button usage is migrated -->
          <ng-container *ngIf="options">
            <fl-split-button-option
              *ngFor="let option of options.slice(1)"
              [copy]="option.copy"
              [link]="option.link"
              [linkQueryParams]="option.linkQueryParams"
              [iconName]="option.iconName"
              [fontSize]="fontSize"
              [optionPadding]="optionPadding"
              (optionSelected)="optionSelected.emit(option); hideOptions()"
            ></fl-split-button-option>
          </ng-container>
          <ng-container *ngIf="!options">
            <ng-content select="fl-split-button-option"></ng-content>
          </ng-container>
        </ul>
      </fl-card>
    </fl-bit>
  `,
  styleUrls: ['./split-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButtonComponent
  implements OnChanges, OnInit, AfterContentInit, OnDestroy {
  Margin = Margin;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  TextSize = TextSize;
  FontType = FontType;
  HoverColor = HoverColor;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  ListItemType = ListItemType;

  iconSize = IconSize.MID;
  chevronType: 'ui-chevron-down' | 'ui-chevron-up' = 'ui-chevron-down';
  chevronColor: IconColor;
  shouldShowOptions = false;
  position = SplitButtonOptionPosition.BOTTOM;

  get fontSize() {
    switch (this.size) {
      case ButtonSize.MINI:
        return TextSize.XXSMALL;
      case ButtonSize.SMALL:
        return TextSize.XSMALL;
      case ButtonSize.LARGE:
      case ButtonSize.XLARGE:
      case ButtonSize.XXLARGE:
        return TextSize.SMALL;
      default:
        return undefined;
    }
  }

  get optionPadding() {
    switch (this.size) {
      case ButtonSize.MINI:
        return ListItemPadding.XXSMALL;
      case ButtonSize.SMALL:
        return ListItemPadding.XSMALL;
      case ButtonSize.LARGE:
      case ButtonSize.XLARGE:
      case ButtonSize.XXLARGE:
        return ListItemPadding.SMALL;
      default:
        return undefined;
    }
  }

  @Input() color: ButtonColor;
  @Input() options: SplitButtonOption[];
  @Input() busy: boolean;

  @HostBinding('attr.data-display')
  @Input()
  display: 'block' | 'inline' = 'inline';

  @HostBinding('attr.data-option-font-size')
  @Input()
  size: ButtonSize;

  @Output() primaryClicked = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<SplitButtonOption>();

  @ViewChild('cardOptions', { read: ElementRef })
  cardOptions: ElementRef<HTMLElement>;

  @ViewChild('dropdown', { read: ElementRef })
  dropdown: ElementRef<HTMLElement>;

  @ContentChild(SplitButtonPrimaryComponent)
  splitButtonPrimary: SplitButtonPrimaryComponent;

  @ContentChildren(SplitButtonOptionComponent)
  splitButtonOptions: QueryList<SplitButtonOptionComponent>;

  private splitButtonOptionSubscription?: Rx.Subscription;

  constructor(
    private timeUtils: TimeUtils,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

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

  ngOnChanges() {
    // reapply whenever style inputs change
    this.applyStylesToPrimaryBtn();
    this.applyStylesToOptions();
  }

  ngOnInit() {
    this.iconSize = [ButtonSize.MINI, ButtonSize.SMALL].includes(this.size)
      ? IconSize.XSMALL
      : IconSize.SMALL;
    this.chevronColor = [
      ButtonColor.DEFAULT,
      ButtonColor.TRANSPARENT_DARK,
    ].includes(this.color)
      ? IconColor.DARK
      : IconColor.LIGHT;
  }

  ngAfterContentInit() {
    this.applyStylesToPrimaryBtn();

    // re-apply styles whenever the list of options changes
    this.splitButtonOptionSubscription = this.splitButtonOptions.changes
      .pipe(startWith(this.splitButtonOptions.toArray()))
      .subscribe(() => this.applyStylesToOptions());
  }

  applyStylesToPrimaryBtn() {
    if (this.splitButtonPrimary) {
      const primaryButton = this.splitButtonPrimary;

      primaryButton.changeDetectorRef.detach();

      primaryButton.busy = this.busy;
      primaryButton.size = this.size;
      primaryButton.display = this.display;
      primaryButton.color = this.color;
      primaryButton.buttonGroupFirst = this.splitButtonOptions.length > 0;

      primaryButton.changeDetectorRef.reattach();
      primaryButton.changeDetectorRef.detectChanges();

      primaryButton.primaryClicked.subscribe(() => {
        this.hideOptions();
        this.primaryClicked.emit();
      });
    }
  }

  applyStylesToOptions() {
    if (this.splitButtonOptions) {
      this.splitButtonOptions.forEach(component => {
        component.changeDetectorRef.detach();

        component.fontSize = this.fontSize;
        component.optionPadding = this.optionPadding;
        component.iconSize = this.iconSize;

        component.changeDetectorRef.reattach();
        component.changeDetectorRef.detectChanges();

        component.optionSelected.subscribe((option: SplitButtonOption) => {
          this.hideOptions();
          this.optionSelected.emit(option);
        });
      });
    }
  }

  hideOptions() {
    this.shouldShowOptions = false;
    this.updateChevron();
    this.setDropdownPosition();
  }

  toggleShouldShowOptions() {
    this.shouldShowOptions = !this.shouldShowOptions;
    this.updateChevron();

    // Needs setTimeout so getBoundingClientRect returns the right values
    this.timeUtils.setTimeout(() => {
      this.setDropdownPosition();
    });
  }

  updateChevron() {
    this.chevronType = this.shouldShowOptions
      ? 'ui-chevron-up'
      : 'ui-chevron-down';
  }

  setDropdownPosition() {
    if (!this.dropdown) {
      return;
    }

    this.position = SplitButtonOptionPosition.BOTTOM;
    this.changeDetectorRef.detectChanges();

    if (this.shouldShowOptions) {
      const dropdownPosition =
        this.dropdown.nativeElement.getBoundingClientRect().top +
        this.dropdown.nativeElement.getBoundingClientRect().height;

      this.position =
        dropdownPosition > window.innerHeight
          ? SplitButtonOptionPosition.TOP
          : SplitButtonOptionPosition.BOTTOM;

      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.splitButtonOptionSubscription) {
      this.splitButtonOptionSubscription.unsubscribe();
    }
  }
}

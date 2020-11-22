import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CalloutComponent, CalloutPlacement } from '@freelancer/ui/callout';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontType } from '@freelancer/ui/text';

export enum DropdownFilterContentSize {
  FLUID = 'fluid', // Follow content's width
  INHERIT = 'inherit', // Follow trigger's width
}

@Component({
  selector: 'fl-dropdown-filter',
  template: `
    <fl-callout
      [edgeToEdge]="true"
      [hideArrow]="true"
      [hideCloseButton]="true"
      [placement]="contentPlacement"
      [mobileCloseButton]="false"
      (calloutOpen)="toggleState()"
      (calloutClose)="toggleState()"
    >
      <fl-callout-trigger
        class="DropdownFilterTrigger"
        [attr.disabled]="disabled"
        (trigger)="handleTrigger()"
      >
        <fl-button
          class="DropdownFilterButton"
          #button
          [ngClass]="{ IsActive: isActive }"
          [color]="ButtonColor.CUSTOM"
          [display]="'block'"
          [size]="ButtonSize.SMALL"
          [disabled]="disabled"
          [attr.data-applied]="filterApplied"
        >
          <fl-bit [ngClass]="{ DropdownFilterLabel: !hideDropdownIcon }">
            <fl-bit class="DropdownFilterButtonInner">
              <fl-icon
                *ngIf="iconLabel"
                class="DropdownFilterIcon"
                [name]="iconLabel"
                [size]="IconSize.SMALL"
                [flMarginRight]="Margin.XXSMALL"
              ></fl-icon>
              <fl-bit
                *ngIf="logoSrc && !iconLabel"
                class="DropdownLogo"
                [flMarginRight]="Margin.XXSMALL"
              >
                <fl-picture
                  [src]="logoSrc"
                  [alt]="logoAlt"
                  [fullWidth]="true"
                  [display]="PictureDisplay.BLOCK"
                ></fl-picture>
              </fl-bit>
              <ng-container
                *ngIf="filterApplied && buttonTextApplied; else plainButtonText"
              >
                {{ buttonTextApplied }}
              </ng-container>
              <ng-template #plainButtonText>
                {{ buttonText }}
              </ng-template>
            </fl-bit>
            <fl-icon
              *ngIf="!hideDropdownIcon"
              class="DropdownFilterArrow"
              [name]="'ui-chevron-down'"
              [size]="IconSize.XSMALL"
            ></fl-icon>
          </fl-bit>
        </fl-button>
      </fl-callout-trigger>

      <fl-callout-content>
        <fl-text
          class="DropdownFilterContent"
          #content
          [fontType]="FontType.CONTAINER"
          [attr.data-edge-to-edge]="edgeToEdge"
          (click)="handleContentClicked()"
        >
          <ng-content></ng-content>
        </fl-text>
      </fl-callout-content>
    </fl-callout>
  `,
  styleUrls: ['./dropdown-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownFilterComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CalloutPlacement = CalloutPlacement;
  IconColor = IconColor;
  IconSize = IconSize;
  FontType = FontType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;

  isActive = false;

  @Input() buttonText: string;
  /** Text to display when the filter is applied. Uses the default text if this is undefined */
  @Input() buttonTextApplied?: string;
  @Input() contentPlacement = CalloutPlacement.BOTTOM;
  @Input() contentSize = DropdownFilterContentSize.FLUID;
  @Input() edgeToEdge = false;
  @Input() hideDropdownIcon = false;
  @Input() iconLabel?: string;
  @Input() logoSrc?: string;
  @Input() logoAlt?: string;

  @HostBinding('attr.disabled')
  @Input()
  disabled = false;

  @HostBinding('attr.data-display')
  @Input()
  display: 'block' | 'inline' = 'inline';

  @Input() filterApplied = false;

  /** Automatically close when a value is selected */
  @Input() autoClose = false;

  @ViewChild('button', { read: ElementRef })
  button: ElementRef<HTMLDivElement>;

  @ViewChild('content', { read: ElementRef })
  content: ElementRef<HTMLDivElement>;

  @ViewChild(CalloutComponent)
  calloutComponent: CalloutComponent;

  constructor(private renderer: Renderer2) {}

  close() {
    this.calloutComponent.close();
  }

  handleTrigger() {
    // Update callout width when we're about to display it
    // so we'll always get the updated trigger width
    if (this.contentSize === DropdownFilterContentSize.INHERIT) {
      this.setContentWidth();
    }
  }

  toggleState() {
    this.isActive = !this.isActive;
  }

  handleContentClicked() {
    if (this.autoClose) {
      this.close();
    }
  }

  /**
   * Sets callout content's width with the trigger/button's width
   */
  private setContentWidth() {
    const buttonWidth = this.button.nativeElement.getBoundingClientRect().width;

    this.renderer.setStyle(
      this.content.nativeElement,
      'width',
      `${buttonWidth}px`,
    );
  }
}

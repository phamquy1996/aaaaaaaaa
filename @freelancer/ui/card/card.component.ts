import {
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { RibbonComponent } from '@freelancer/ui/ribbon';
import { TextSize } from '@freelancer/ui/text';

export enum CardLevel {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export enum CardSize {
  SMALL = 'small',
  MID = 'mid',
}

export enum CardBorderRadius {
  MID = 'mid',
  LARGE = 'large',
}

export interface CardHeaderButton {
  text: string;
  color?: ButtonColor;
  link?: string;
  fragment?: string;
  queryParams?: { [k: string]: any };
  linkActive?: string[] | string;
  linkActiveOptions?: { exact: boolean };
  busy?: boolean;
}

@Component({
  selector: 'fl-card-header-title',
  template: `
    <ng-content></ng-content>
  `,
})
export class CardHeaderTitleComponent {}

@Component({
  selector: 'fl-card-header-right',
  template: `
    <ng-content></ng-content>
  `,
})
export class CardHeaderRightComponent {}

@Component({
  selector: 'fl-card-header-secondary',
  template: `
    <ng-content></ng-content>
  `,
})
export class CardHeaderSecondaryComponent {}

@Component({
  selector: 'fl-card',
  template: `
    <fl-bit class="Card">
      <fl-bit
        class="CardHeader"
        *ngIf="cardHeaderTitle || cardHeaderButton || cardHeaderSecondary"
        [attr.data-size]="size"
        (click)="handleTitleClick()"
      >
        <fl-bit
          class="CardHeaderInner"
          *ngIf="cardHeaderTitle || cardHeaderButton"
          [attr.data-size]="size"
          [attr.data-button-available]="cardHeaderButton && true"
        >
          <fl-heading
            class="CardHeading"
            [headingType]="HeadingType.H2"
            [size]="size == CardSize.MID ? TextSize.MID : TextSize.SMALL"
          >
            <ng-content select="fl-card-header-title"></ng-content>
          </fl-heading>
          <fl-bit
            class="CardHeaderRight"
            *ngIf="cardHeaderRight || cardHeaderButton"
          >
            <fl-button
              *ngIf="cardHeaderButton"
              [color]="
                cardHeaderButton.color
                  ? cardHeaderButton.color
                  : ButtonColor.SECONDARY
              "
              [size]="size == CardSize.MID ? ButtonSize.SMALL : ButtonSize.MINI"
              [link]="cardHeaderButton.link"
              [linkActive]="cardHeaderButton.linkActive"
              [fragment]="cardHeaderButton.fragment"
              [queryParams]="cardHeaderButton.queryParams"
              [busy]="cardHeaderButton.busy"
              [linkActiveOptions]="cardHeaderButton.linkActiveOptions"
              (click)="handleButtonClick()"
            >
              {{ cardHeaderButton.text }}
            </fl-button>
            <ng-content select="fl-card-header-right"></ng-content>
          </fl-bit>
          <fl-icon
            class="ExpandIcon"
            *ngIf="expandable"
            [ngClass]="{ IsExpanded: expanded }"
            [color]="IconColor.DARK"
            [name]="'ui-chevron-down'"
            [size]="IconSize.SMALL"
          >
          </fl-icon>
        </fl-bit>
        <ng-content select="fl-card-header-secondary"></ng-content>
      </fl-bit>
      <fl-bit
        class="CardBody"
        [attr.data-size]="size"
        [attr.data-edge-to-edge]="edgeToEdge"
        [attr.data-ribbon]="ribbon ? true : false"
        [ngClass]="{ IsHidden: expandable && !expanded }"
      >
        <ng-content></ng-content>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  /** Forces the card to have a full 100% width of its parent container */
  @HostBinding('class.MaxContent')
  @Input()
  maxContent = true;

  /** Defines the level of the box shadow of the card */
  @HostBinding('attr.data-level')
  @Input()
  level = CardLevel.PRIMARY;

  /** Makes the card appear to be clickable */
  @HostBinding('class.CardClickable')
  @Input()
  clickable = false;

  /** Makes the card expandable */
  /** Please be careful when handle click event if you have clickable and expandable enabled at the same time.
   * It might conflict if the user clicks the card header */
  @Input()
  expandable = false;

  @HostBinding('attr.data-radius')
  @Input()
  borderRadius = CardBorderRadius.MID;

  @Input() cardHeaderButton?: CardHeaderButton;

  /** Removes padding inside the card component */
  @Input() edgeToEdge = false;

  /** Defines the padding level inside the card */
  @Input() size = CardSize.MID;

  @Output() buttonClicked = new EventEmitter<void>();

  @ContentChild(CardHeaderTitleComponent)
  cardHeaderTitle: CardHeaderTitleComponent;
  @ContentChild(CardHeaderRightComponent)
  cardHeaderRight: CardHeaderRightComponent;
  @ContentChild(CardHeaderSecondaryComponent)
  cardHeaderSecondary: CardHeaderSecondaryComponent;
  @ContentChild(RibbonComponent) ribbon: RibbonComponent;

  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CardSize = CardSize;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;

  expanded = false;

  handleButtonClick() {
    this.buttonClicked.emit();
  }

  handleTitleClick() {
    if (!this.expandable) {
      return;
    }
    this.expanded = !this.expanded;
  }
}

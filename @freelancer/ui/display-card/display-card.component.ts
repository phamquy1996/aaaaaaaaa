import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
} from '@angular/core';
import { CardLevel } from '@freelancer/ui/card';

// Starting with Angular2 RC6, errors are thrown if unknown
// html tags are used.
// In order to get around this, I have created dummy components in order to
// register these custom tags with Angular.
// https://github.com/angular/angular/issues/11251
@Component({
  selector: 'fl-display-card-header-left',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardHeaderLeftComponent {}
@Component({
  selector: 'fl-display-card-header-right',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardHeaderRightComponent {}

@Component({
  selector: 'fl-display-card-content',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardContentComponent {}

@Component({
  selector: 'fl-display-card-footer-left',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardFooterLeftComponent {}
@Component({
  selector: 'fl-display-card-footer-right',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardFooterRightComponent {}
@Component({
  selector: 'fl-display-card-image',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./display-card-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardImageComponent {}

@Component({
  selector: 'fl-display-card',
  template: `
    <fl-card
      class="Card"
      [edgeToEdge]="true"
      [level]="level"
      [maxContent]="false"
    >
      <fl-bit
        [ngClass]="{
          Header: headerLeftContent || headerRightContent,
          HeaderRightOnly: headerRightContent && !headerLeftContent
        }"
      >
        <ng-content select="fl-display-card-header-left"></ng-content>
        <ng-content select="fl-display-card-header-right"></ng-content>
      </fl-bit>

      <fl-bit [ngClass]="{ ImageContainer: imageContent }">
        <ng-content select="fl-display-card-image"></ng-content>
      </fl-bit>

      <fl-bit [ngClass]="{ Content: cardContent }">
        <ng-content select="fl-display-card-content"></ng-content>
      </fl-bit>

      <fl-bit
        [ngClass]="{
          Footer: footerLeftContent || footerRightContent,
          FooterRightOnly: footerRightContent && !footerLeftContent
        }"
      >
        <ng-content select="fl-display-card-footer-left"></ng-content>
        <ng-content select="fl-display-card-footer-right"></ng-content>
      </fl-bit>
    </fl-card>
  `,
  styleUrls: ['./display-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCardComponent {
  @Input() level = CardLevel.PRIMARY;

  @ContentChild(DisplayCardHeaderRightComponent)
  headerRightContent: DisplayCardHeaderRightComponent;

  @ContentChild(DisplayCardHeaderLeftComponent)
  headerLeftContent: DisplayCardHeaderLeftComponent;

  @ContentChild(DisplayCardImageComponent)
  imageContent: DisplayCardImageComponent;

  @ContentChild(DisplayCardContentComponent)
  cardContent: DisplayCardContentComponent;

  @ContentChild(DisplayCardFooterLeftComponent)
  footerLeftContent: DisplayCardFooterLeftComponent;

  @ContentChild(DisplayCardFooterRightComponent)
  footerRightContent: DisplayCardFooterRightComponent;
}

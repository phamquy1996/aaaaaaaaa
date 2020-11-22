import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor } from '@freelancer/ui/icon';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

export enum CardListSize {
  SMALL = 'small',
  MID = 'mid',
}

@Component({
  selector: 'fl-card-list-item',
  template: `
    <fl-bit
      class="CardListItem"
      [ngClass]="{ IsSelected: selectable && isSelected }"
      [attr.data-selectable]="selectable"
      [attr.data-size]="size"
      (click)="onClick()"
    >
      <fl-icon
        *ngIf="iconName"
        [name]="iconName"
        [color]="IconColor.INHERIT"
      ></fl-icon>

      <fl-text [color]="FontColor.INHERIT" [size]="TextSize.XXSMALL">
        <ng-content></ng-content>
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./card-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListItemComponent implements OnInit, OnDestroy {
  FontColor = FontColor;
  TextSize = TextSize;
  IconColor = IconColor;

  public selectable = false;
  public size = CardListSize.MID;

  isSelected = false;
  controlSubscription?: Rx.Subscription;

  @Input() control = new FormControl(false);
  @Input() iconName?: string;
  // If this is set, the control will be treated like a radio (set to value instead of true/false)
  @Input() radioValue?: any;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateSelectedState();

    this.controlSubscription = this.control.valueChanges.subscribe(() => {
      this.updateSelectedState();
      this.changeDetectorRef.detectChanges();
    });
  }

  onClick() {
    if (this.control.enabled) {
      // If we're given a radioValue, we treat the control like a radio
      if (this.radioValue !== undefined) {
        this.control.setValue(this.radioValue);
      } else {
        this.control.setValue(!this.control.value);
      }
    }
  }

  updateSelectedState() {
    // If we're given a radioValue, we treat the control like a radio
    this.isSelected =
      this.radioValue !== undefined
        ? this.control.value === this.radioValue
        : this.control.value;
  }

  ngOnDestroy() {
    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe();
    }
  }
}

@Component({
  selector: 'fl-card-list',
  template: `
    <ng-content select="fl-card-list-item"></ng-content>
  `,
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent
  implements AfterContentInit, OnChanges, OnDestroy {
  @Input() size = CardListSize.MID;
  @Input() selectable = false;

  @ContentChildren(CardListItemComponent)
  cardListItemComponents: QueryList<CardListItemComponent>;

  private childListSubscription?: Rx.Subscription;

  ngOnChanges() {
    // apply properties to child items whenever the properties change.
    this.applyPropertiesToChildren();
  }

  ngAfterContentInit() {
    // apply properties to child items whenever the list of children changes
    this.childListSubscription = this.cardListItemComponents.changes
      .pipe(startWith(this.cardListItemComponents.toArray()))
      .subscribe(() => this.applyPropertiesToChildren());
  }

  ngOnDestroy() {
    if (this.childListSubscription) {
      this.childListSubscription.unsubscribe();
    }
  }

  applyPropertiesToChildren() {
    if (this.cardListItemComponents) {
      this.cardListItemComponents.forEach((component, index, arr) => {
        component.changeDetectorRef.detach();
        component.size = this.size;
        component.selectable = this.selectable;
        component.changeDetectorRef.reattach();
        component.changeDetectorRef.detectChanges();
      });
    }
  }
}

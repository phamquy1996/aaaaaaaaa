import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { IconColor, IconSize } from '../icon/icon.component';

export enum RatingTicksColor {
  PRIMARY = 'primary',
  SUCCESS = 'success',
}

export type RatingColor =
  | IconColor.DARK
  | IconColor.INHERIT
  | IconColor.LIGHT
  | IconColor.WHITE;

export enum RatingType {
  STARS = 'stars',
  TICKS = 'ticks',
}

@Component({
  selector: 'fl-rating',
  template: `
    <fl-bit
      class="RatingContainer"
      [flMarginBottom]="
        control.invalid && control.dirty ? Margin.XXXSMALL : null
      "
    >
      <fl-bit
        class="ValueBlock"
        *ngIf="!compact && !hideValue"
        [attr.data-icon-size]="size"
        [attr.data-filled]="itemsCount > 0"
      >
        {{ itemsCount || 0 | number: '1.1-1' }}
      </fl-bit>
      <fl-bit
        class="LayerGroup"
        (mouseleave)="setHover(0)"
        [attr.data-rating]="control.value"
        [attr.data-background-color]="backgroundColor"
        [flMarginRight]="
          isReviewCountSet() && !compact
            ? Margin.XXSMALL
            : isReviewCountSet() || compact
            ? Margin.XXXSMALL
            : Margin.NONE
        "
      >
        <fl-bit class="ValueLayer" #valueLayer></fl-bit>
        <fl-bit class="HoverLayer" #hoverLayer></fl-bit>

        <fl-bit class="IconLayer">
          <ng-container *ngFor="let item of items; last as isLast">
            <fl-bit class="IconContainer">
              <fl-icon
                [name]="
                  this.type === RatingType.TICKS
                    ? 'ui-ok-inverse-v2'
                    : 'ui-star-inverse-v2'
                "
                [color]="backgroundColor"
                [size]="size"
              ></fl-icon>
            </fl-bit>
            <fl-bit
              class="IconSpacer"
              *ngIf="!isLast"
              [attr.data-background-color]="backgroundColor"
            ></fl-bit>
          </ng-container>
        </fl-bit>

        <fl-bit class="ClickLayer">
          <ng-container *ngFor="let item of items">
            <fl-bit
              class="ClickMask"
              (click)="setValue(halfRating ? item - 0.5 : item)"
              (mouseover)="setHover(halfRating ? item - 0.5 : item)"
            ></fl-bit>
            <fl-bit
              class="ClickMask"
              (click)="setValue(item)"
              (mouseover)="setHover(item)"
            ></fl-bit>
          </ng-container>
        </fl-bit>
      </fl-bit>
      <fl-bit
        class="ValueText"
        *ngIf="compact"
        [attr.data-icon-size]="size"
        [flMarginRight]="isReviewCountSet() ? Margin.XXSMALL : Margin.NONE"
      >
        {{ itemsCount | number: '1.1-1' }}
      </fl-bit>
      <fl-bit class="ReviewCount" *ngIf="isReviewCountSet()">
        <fl-text
          i18n="Number of reviews"
          [size]="size === IconSize.MID ? TextSize.SMALL : TextSize.XXSMALL"
        >
          ({{ reviewCount }} reviews)
        </fl-text>
      </fl-bit>
    </fl-bit>

    <fl-text
      *ngIf="control.invalid && control.dirty"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ error }}
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnDestroy, OnInit, OnChanges {
  IconSize = IconSize;
  FontColor = FontColor;
  TextSize = TextSize;
  Margin = Margin;
  RatingType = RatingType;

  error: string;
  items: number[] = [];
  private hoverValue = 0;
  itemsCount = 0;

  private statusChangeSubscription?: Rx.Subscription;
  private valueChangeSubscription?: Rx.Subscription;

  @Input() control: FormControl;
  @Input() numberOfItems = 5;
  @Input() size = IconSize.MID;
  @Input() halfRating = false;
  @Input() hideValue = false;
  @Input() reviewCount?: number;

  /** Display the component inline with other inline level elements */
  @HostBinding('attr.data-display-inline')
  @Input()
  inline = false;

  @HostBinding('attr.data-read-only')
  @Input()
  readOnly = false;

  @HostBinding('attr.data-icon-color')
  @Input()
  backgroundColor: RatingColor = IconColor.WHITE;

  @HostBinding('attr.data-compact')
  @Input()
  compact = false;

  @HostBinding('attr.data-type')
  @Input()
  type = RatingType.STARS;

  @HostBinding('attr.data-ticks-color')
  @Input()
  ticksColor = RatingTicksColor.PRIMARY;

  @Output() hoverValueChange = new EventEmitter<number>();

  @ViewChild('valueLayer', { read: ElementRef, static: true })
  valueLayer: ElementRef<HTMLDivElement>;
  @ViewChild('hoverLayer', { read: ElementRef, static: true })
  hoverLayer: ElementRef<HTMLDivElement>;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.itemsCount = this.control.value;

    this.valueChangeSubscription = this.control.valueChanges.subscribe(() => {
      this.render();
    });

    this.statusChangeSubscription = this.control.statusChanges.subscribe(() => {
      [this.error] = Object.values(this.control.errors || {});
      this.changeDetectorRef.markForCheck();
    });

    this.render();
  }

  ngOnDestroy() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  setValue(value: number) {
    if (this.readOnly || this.compact) {
      return;
    }
    this.hoverValue = 0;
    this.control.markAsDirty();
    this.control.setValue(value);
  }

  setHover(value: number) {
    if (this.readOnly || this.compact) {
      return;
    }
    this.hoverValue = value;
    this.render();

    this.hoverValueChange.emit(this.hoverValue);
  }

  isReviewCountSet() {
    return typeof this.reviewCount === 'number';
  }

  private render() {
    this.itemsCount = this.hoverValue || this.control.value;
    this.valueLayer.nativeElement.style.width = `${this.getValuePercentage()}%`;
    this.hoverLayer.nativeElement.style.width = `${this.getHoverPercentage()}%`;
    // Make sure itemsCount is in sync
    this.changeDetectorRef.markForCheck();
  }

  private getValuePercentage(): number {
    if (this.compact) {
      return this.control.value > 0 ? 100 : 0;
    }
    return this.getBoundPercentage(this.control.value);
  }

  private getHoverPercentage(): number {
    return this.compact ? 0 : this.getBoundPercentage(this.hoverValue);
  }

  private getBoundPercentage(value: number): number {
    return Math.min(Math.max((value / this.numberOfItems) * 100, 0), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('compact' in changes && this.compact) {
      this.items = [1];
    }

    if (!this.compact) {
      this.items = [];

      for (let i = 1; i <= this.numberOfItems; i++) {
        this.items.push(i);
      }
    }

    this.render();
  }
}

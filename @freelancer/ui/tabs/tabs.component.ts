import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
} from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { MoreOptionsComponent } from '@freelancer/ui/more-options';
import * as Rx from 'rxjs';
import { debounceTime, first, startWith } from 'rxjs/operators';
import {
  TabItemComponent,
  TabsBorder,
  TabsColor,
  TabsDirection,
  TabsSize,
} from './tab-item.component';

@Component({
  selector: 'fl-tabs',
  template: `
    <fl-bit
      class="Indicator ArrowLeft"
      (click)="onScrollLeft()"
      [attr.data-direction]="direction"
      [attr.data-color]="color"
      [ngClass]="{ IsDisabled: !canScrollLeft, IsVisible: showArrows === true }"
    >
      <fl-icon
        class="Arrow"
        [name]="'ui-arrow-left-alt'"
        [size]="IconSize.SMALL"
        [color]="color === TabsColor.LIGHT ? IconColor.LIGHT : IconColor.DARK"
      ></fl-icon>
    </fl-bit>
    <fl-bit
      class="TabList"
      #tablist
      [attr.data-direction]="direction"
      [attr.data-size]="size"
      [attr.data-tab-list]="''"
      [attr.role]="'tablist'"
      [ngClass]="{ HasExtraItems: moreOptionsComponent }"
    >
      <fl-bit
        #leftTabChild
        class="ObservedElement ObservedElement-left"
        [ngClass]="{ IsHidden: !showArrows }"
      ></fl-bit>
      <ng-content select="fl-tab-item"></ng-content>
      <fl-bit
        class="TabsExtra"
        *ngIf="moreOptionsComponent && direction === TabsDirection.ROW"
        [attr.role]="'tab'"
        [attr.data-size]="size"
        [attr.data-color]="color"
      >
        <ng-content select="fl-more-options"></ng-content>
      </fl-bit>
      <fl-bit
        #rightTabChild
        class="ObservedElement ObservedElement-right"
        [ngClass]="{ IsHidden: !showArrows }"
      ></fl-bit>
    </fl-bit>
    <fl-bit
      class="Indicator ArrowRight"
      (click)="onScrollRight()"
      [attr.data-direction]="direction"
      [attr.data-color]="color"
      [ngClass]="{
        IsDisabled: !canScrollRight,
        IsVisible: showArrows === true
      }"
    >
      <fl-icon
        class="Arrow"
        [name]="'ui-arrow-right-alt'"
        [size]="IconSize.SMALL"
        [color]="color === TabsColor.LIGHT ? IconColor.LIGHT : IconColor.DARK"
      ></fl-icon>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent
  implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
  IconColor = IconColor;
  IconSize = IconSize;
  TabsColor = TabsColor;
  TabsDirection = TabsDirection;
  LinkColor = LinkColor;
  Margin = Margin;

  isDropdownActive = false;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  showArrows: boolean;

  leftTabObserver: IntersectionObserver;
  rightTabObserver: IntersectionObserver;

  @Input() border = TabsBorder.NONE;
  @Input() color = TabsColor.DARK;
  @Input() direction = TabsDirection.ROW;
  @Input() iconColor = IconColor.DARK;
  @Input() size = TabsSize.LARGE;

  @ContentChildren(TabItemComponent)
  tabItemComponents: QueryList<TabItemComponent>;

  private tabItemSubscription?: Rx.Subscription;
  private windowResize?: Rx.Subscription;

  @ContentChild(MoreOptionsComponent)
  moreOptionsComponent: MoreOptionsComponent;

  @ViewChild('tablist', { read: ElementRef })
  tabList: ElementRef<HTMLDivElement>;

  @ViewChild('leftTabChild', { read: ElementRef })
  leftTabChild: ElementRef<HTMLDivElement>;

  @ViewChild('rightTabChild', { read: ElementRef })
  rightTabChild: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    public changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnChanges() {
    // reapply whenever style inputs change
    this.applyStylesToChildren();
  }

  ngAfterContentInit() {
    // re-apply styles whenever the list of child tabs changes
    this.tabItemSubscription = this.tabItemComponents.changes
      .pipe(startWith(this.tabItemComponents.toArray()))
      .subscribe(() => this.applyStylesToChildren());
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.onStable
        .asObservable()
        .pipe(first())
        .toPromise()
        .then(() => {
          this.applyScrollPosition();
          this.loadArrowIndicators();
        });

      this.windowResize = Rx.fromEvent(window, 'resize')
        .pipe(debounceTime(250))
        .subscribe(() => {
          this.applyScrollPosition();
          this.loadArrowIndicators();
        });
    }
  }

  ngOnDestroy() {
    if (this.tabItemSubscription) {
      this.tabItemSubscription.unsubscribe();
    }

    if (this.windowResize) {
      this.windowResize.unsubscribe();
    }

    if (this.leftTabObserver) {
      this.leftTabObserver.disconnect();
    }

    if (this.rightTabObserver) {
      this.rightTabObserver.disconnect();
    }
  }

  // when the style inputs to this component change, we need to update
  // each individual tab item child to reflect these style changes in their
  // own css logic.
  applyStylesToChildren() {
    if (this.tabItemComponents) {
      this.tabItemComponents.forEach((component, index, arr) => {
        component.changeDetectorRef.detach();

        component.border = this.border || TabsBorder.NONE;
        component.color = this.color || TabsColor.DARK;
        component.iconColor = this.iconColor || IconColor.DARK;
        component.direction = this.direction || TabsDirection.ROW;
        component.size = this.size || TabsSize.LARGE;

        // reattach and detect changes;
        component.changeDetectorRef.reattach();
        component.changeDetectorRef.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          component.onSelected.subscribe((item: ElementRef) =>
            this.showActiveTab(item, true),
          );
        }
      });
    }
  }

  private applyScrollPosition() {
    this.tabItemComponents.forEach((component: TabItemComponent) => {
      if (component.isSelected) {
        this.showActiveTab(component.element, false);
      }
    });
  }

  private showActiveTab(item: ElementRef, animation: boolean) {
    if (this.direction !== TabsDirection.ROW) {
      return;
    }

    const tabItem = item.nativeElement;
    const tabListElement = this.tabList.nativeElement;
    const scrollTarget =
      parseInt(tabItem.offsetLeft, 10) +
      tabItem.getBoundingClientRect().width / 2 -
      tabListElement.clientWidth / 2;

    tabListElement.scroll({
      top: 0,
      left: scrollTarget,
      behavior: animation ? 'smooth' : 'auto',
    });
  }

  observeFirstItem() {
    const leftTabChildElement = this.leftTabChild.nativeElement;
    const tabListElement = this.tabList.nativeElement;
    const config = {
      root: tabListElement,
    };

    // Observer First element
    this.leftTabObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.canScrollLeft = false;
        } else {
          this.canScrollLeft = true;
        }
        this.changeDetectorRef.markForCheck();
      });
    }, config);
    this.leftTabObserver.observe(leftTabChildElement);
  }

  observeLastItem() {
    const rightTabChildElement = this.rightTabChild.nativeElement;
    const tabListElement = this.tabList.nativeElement;
    const config = {
      root: tabListElement,
    };

    // Observer Last element
    this.rightTabObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.canScrollRight = false;
        } else {
          this.canScrollRight = true;
        }
        this.changeDetectorRef.markForCheck();
      });
    }, config);
    this.rightTabObserver.observe(rightTabChildElement);
  }

  loadArrowIndicators() {
    const tabListElement = this.tabList.nativeElement;

    if (
      tabListElement.offsetWidth + tabListElement.scrollLeft <
        tabListElement.scrollWidth ||
      tabListElement.scrollLeft > 0
    ) {
      this.showArrows = true;
    } else {
      this.showArrows = false;
    }
    this.observeFirstItem();
    this.observeLastItem();
    this.changeDetectorRef.markForCheck();
  }

  onScrollRight() {
    const tabListElement = this.tabList.nativeElement;

    tabListElement.scrollTo({
      left: tabListElement.scrollLeft + 65,
      behavior: 'smooth',
    });
  }

  onScrollLeft() {
    const tabListElement = this.tabList.nativeElement;

    tabListElement.scrollTo({
      left: tabListElement.scrollLeft - 65,
      behavior: 'smooth',
    });
  }
}

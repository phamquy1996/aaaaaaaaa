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
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IconColor } from '@freelancer/ui/icon';
import * as Rx from 'rxjs';
import {
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
} from 'rxjs/operators';

export enum QueryParamsHandling {
  MERGE = 'merge',
  PRESERVE = 'preserve',
  NONE = '',
}

export interface Tab {
  title: string;
  selected?: boolean;
  iconName?: string;
  /** note: the router link MUST be absolute. */
  routerLink?: string;
  /** if the route has children, we do a startWith match instead of an exact match */
  routeHasChildren?: boolean;
  /** when a tab is clicked and has a routerLink, how should it handle the query parameters
   *  from the current route in the new route
   */
  queryParamsHandling?: QueryParamsHandling;
}

export enum TabsBorder {
  NONE = 'none',
  INSIDE = 'inside',
  ALL = 'all',
}

export enum TabsColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum TabsSize {
  XSMALL = 'xsmall',
  SMALL = 'small',
  LARGE = 'large',
}

export enum TabsDirection {
  ROW = 'row',
  COLUMN_LEFT = 'columnLeft',
  COLUMN_RIGHT = 'columnRight',
}

@Component({
  selector: 'fl-tab-item',
  template: `
    <ng-container *ngIf="routerLink; else listTab">
      <a
        class="TabItem"
        *ngIf="currentUrl$ | async as currentUrl"
        [attr.data-border]="border"
        [attr.data-color]="color"
        [attr.data-selected]="isSelected"
        [attr.data-direction]="direction"
        [attr.data-size]="size"
        [routerLink]="routerLink"
        [queryParamsHandling]="queryParamsHandling"
        [replaceUrl]="preserveBackButton"
      >
        <ng-container *ngTemplateOutlet="tabContent"></ng-container>
      </a>
    </ng-container>

    <ng-template #listTab>
      <button
        class="TabItem"
        [attr.data-border]="border"
        [attr.data-color]="color"
        [attr.data-direction]="direction"
        [attr.data-selected]="selected"
        [attr.data-size]="size"
      >
        <ng-container *ngTemplateOutlet="tabContent"></ng-container>
      </button>
    </ng-template>

    <ng-template #tabContent>
      <fl-icon
        class="Icon"
        *ngIf="iconName"
        [color]="color === TabsColor.DARK ? IconColor.DARK : IconColor.LIGHT"
        [name]="iconName"
      ></fl-icon>
      {{ title }}
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tab-item.component.scss'],
})
export class TabItemComponent implements OnInit, OnChanges, OnDestroy {
  IconColor = IconColor;
  TabsColor = TabsColor;
  TabsDirection = TabsDirection;

  /*
    TAB PROPERTIES
    Handling selected tab will need to be done by the component using the tabs.
  */
  @Input() title: string;
  @Input() selected = false;
  @Input() iconName?: string;
  /** note: the router link MUST be absolute. */
  @Input() routerLink?: string;
  /** if the route has children, we do a startWith match instead of an exact match */
  @Input() routeHasChildren?: boolean;
  /** when a tab is clicked and has a routerLink, should it preserve the query parameters
   *  from the current route in the new route
   */
  @Input() queryParamsHandling?: QueryParamsHandling;
  /**
   * Whether to maintain the current back button location after switching tabs.
   * Only set this to `false` if the tabs conceptually represent different views/pages
   * and not just smaller parts of a top-level view.
   */
  @Input() preserveBackButton = true;

  /*
    STYLE PROPERTIES
    These are set automatically by the parent `tabs` component by using @ContentChildren
  */
  color = TabsColor.DARK;
  iconColor = IconColor.DARK;
  @HostBinding('attr.data-direction') direction = TabsDirection.ROW;
  size = TabsSize.LARGE;
  @HostBinding('attr.data-border') border = TabsBorder.NONE;

  @Output() onSelected = new EventEmitter<ElementRef>();
  @HostBinding('attr.role') role = 'tab';
  @HostBinding('attr.tabindex') tabIndex = -1;

  currentUrl$: Rx.Observable<string>;
  private currentUrlSubscription?: Rx.Subscription;
  public isSelected = false;

  @HostBinding('attr.data-selected')
  @HostBinding('attr.aria-selected')
  get selectedState(): boolean {
    return this.isSelected;
  }

  constructor(
    private router: Router,
    public element: ElementRef,
    public changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnChanges() {
    this.isSelected = this.selected;

    if (this.selected) {
      this.onSelected.emit(this.element);
    }
  }

  ngOnInit() {
    this.currentUrl$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
      // we don't support query params and fragments so just ignore them in the router url
      map(url => url.split('?')[0].split('#')[0]),
      publishReplay(1),
      refCount(),
    );

    this.currentUrlSubscription = this.currentUrl$.subscribe(
      (currentUrl: string) => {
        this.isSelected = this.routeMatch(currentUrl);

        if (this.routeMatch(currentUrl)) {
          this.onSelected.emit(this.element);
        }
      },
    );
  }

  ngOnDestroy() {
    if (this.currentUrlSubscription) {
      this.currentUrlSubscription.unsubscribe();
    }
  }

  routeMatch(currentUrl: string): boolean {
    if (!this.routerLink) {
      return false;
    }

    return this.routeHasChildren
      ? currentUrl.startsWith(this.routerLink)
      : currentUrl === this.routerLink;
  }
}

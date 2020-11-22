import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import {
  LinkColor,
  LinkHoverColor,
  LinkWeight,
  QueryParams,
} from '@freelancer/ui/link';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: `fl-breadcrumbs-item`,
  template: `
    <fl-link
      [color]="LinkColor.INHERIT"
      [hoverColor]="LinkHoverColor.INHERIT"
      [itemprop]="'item'"
      [itemtype]="'https://schema.org/Thing'"
      [link]="link"
      [queryParams]="queryParams"
      [size]="TextSize.XXXSMALL"
      [weight]="LinkWeight.BOLD"
    >
      <span itemprop="name"><ng-content></ng-content></span>
    </fl-link>
    <meta itemprop="position" [content]="position" />
  `,
  styleUrls: ['./breadcrumbs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsItemComponent {
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkWeight = LinkWeight;
  TextSize = TextSize;

  @Input() link: string;
  @Input() position: number;
  @Input() queryParams?: QueryParams;

  @HostBinding('attr.itemprop') itemprop = 'itemListElement';
  @HostBinding('attr.itemscope') itemscope = '';
  @HostBinding('attr.itemtype') itemtype = 'https://schema.org/ListItem';
  @HostBinding('attr.role') role = 'listitem';

  constructor(public changeDetector: ChangeDetectorRef) {}
}

@Component({
  selector: 'fl-breadcrumbs',
  template: `
    <fl-bit
      role="list"
      class="Breadcrumbs"
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
    >
      <ng-content></ng-content>
    </fl-bit>
  `,
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(BreadcrumbsItemComponent)
  breadcrumbsItems: QueryList<BreadcrumbsItemComponent>;

  private itemsSubscription?: Rx.Subscription;

  ngAfterContentInit() {
    this.itemsSubscription = this.breadcrumbsItems.changes
      .pipe(startWith(this.breadcrumbsItems.toArray()))
      .subscribe(() => {
        this.breadcrumbsItems.forEach((component, index) => {
          component.position = index + 1;
          component.changeDetector.detectChanges();
        });
      });
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }
}

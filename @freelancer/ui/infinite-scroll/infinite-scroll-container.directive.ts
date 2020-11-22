import { Directive, OnInit, ViewContainerRef } from '@angular/core';

/**
 * Allows the InfiniteScrollComponent to observe the height of the items
 * container.
 */
@Directive({
  selector: '[flInfiniteScrollContainer]',
})
export class InfiniteScrollContainerDirective implements OnInit {
  // Host element, this is used by the InfiniteScrollComponent
  container: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.container = this.viewContainerRef.element.nativeElement;
  }
}

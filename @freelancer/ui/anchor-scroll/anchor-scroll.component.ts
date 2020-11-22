import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AnchorScroll } from './anchor-scroll.service';

/**
 * Allows to define an anchor point to scroll to with an animated transition.
 *
 * This provides a consistent & performant way to achieve scrolling animations,
 * i.e. please use that rather than re-implementing your own.
 *
 * How to use:
 * - Insert `fl-anchor-scroll` above the element you want to scroll to, and
 * give it a (unique on the page) name. You can set an 'offset' if needed, i.e.
 * if the page has a fixed header.
 * - Inject the `AnchorScroll` service in the Component from which you want to
 * scroll
 * - Call `AnchorScroll::scrollTo(<name>)` when you want to scroll to the
 * anchor. This gives you back an isScrolling$ Observable, use it to put your
 * view in "loading" state when the scrolling animation is running. This
 * provides a better transition while avoiding animation stutter due to the
 * rendering of complex elements while scrolling, i.e. don't skip that part
 */
@Component({
  selector: 'fl-anchor-scroll',
  template: `
    <span [id]="name"></span>
  `,
  styleUrls: ['./anchor-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnchorScrollComponent implements OnInit, OnDestroy {
  private isRegistered = false;

  // ID selector of element or a defined scroll location
  @Input() name: string;
  @Input()
  set offset(value: number) {
    this.top = `-${value}px`;
  }

  @HostBinding('style.top') top: string;

  constructor(private el: ElementRef, private anchorScroll: AnchorScroll) {}

  ngOnInit() {
    this.anchorScroll.registerAnchor(this.name, this.el.nativeElement);
    this.isRegistered = true;
  }

  ngOnDestroy() {
    if (this.isRegistered) {
      this.anchorScroll.unregisterAnchor(this.name);
    }
  }
}

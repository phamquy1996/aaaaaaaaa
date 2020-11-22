import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { Location } from '@freelancer/location';
import { isArray } from '@freelancer/utils';

// TODO T37479: This is needed in order for `routeLinkActive` to work when the nav is loaded
// in compat mode (on PHP pages).
@Directive({
  // Disable directive-selector lint because this is a patch for
  // routerLinkActive
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLinkActive]',
})
export class CompatLinkActiveDirective implements OnChanges, AfterContentInit {
  @ContentChildren(RouterLink, { descendants: true })
  links: QueryList<RouterLink>;
  @ContentChildren(RouterLinkWithHref, { descendants: true })
  linksWithHrefs: QueryList<RouterLinkWithHref>;

  private classes: ReadonlyArray<string> = [];
  public readonly isActive = false;

  @Input() routerLinkActiveOptions: { exact: boolean } = { exact: false };

  constructor(
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private location: Location,
  ) {}

  ngAfterContentInit(): void {
    this.links.changes.subscribe(_ => this.update());
    this.linksWithHrefs.changes.subscribe(_ => this.update());
    this.update();
  }

  @Input()
  set routerLinkActive(data: ReadonlyArray<string> | string) {
    const classes = isArray(data) ? data : data.split(' ');
    this.classes = classes.filter(c => !!c);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  private update(): void {
    if (!this.links || !this.linksWithHrefs) {
      return;
    }
    Promise.resolve().then(() => {
      const hasActiveLinks = this.hasActiveLinks();
      if (this.isActive !== hasActiveLinks) {
        (this as any).isActive = hasActiveLinks;
        this.classes.forEach(c => {
          if (hasActiveLinks) {
            this.renderer.addClass(this.element.nativeElement, c);
          } else {
            this.renderer.removeClass(this.element.nativeElement, c);
          }
        });
      }
    });
  }

  private isLinkActive(): (link: RouterLink | RouterLinkWithHref) => boolean {
    return (link: RouterLink | RouterLinkWithHref) => {
      // TODO T37479: This is where the discrepancy between
      // routerLink and this compatibility later is.
      // Ref https://github.com/angular/angular/blob/4.3.2/packages/router/src/directives/router_link_active.ts#L139.
      if (this.routerLinkActiveOptions.exact) {
        // TODO T37479: Strip the trailing slash if there is any. This
        // feature is not available in routerLink.
        // Ref https://github.com/angular/angular/issues/16051
        const pathname = this.location.pathname.endsWith('/')
          ? this.location.pathname.slice(0, -1)
          : this.location.pathname;
        return pathname === link.urlTree.toString();
      }

      // TODO T37479: This doesn't handle the difference between a route
      // segment or a partial text. e.g. /job can match with /jobs.
      return this.location.pathname.includes(link.urlTree.toString());
    };
  }

  private hasActiveLinks(): boolean {
    return (
      this.links.some(this.isLinkActive()) ||
      this.linksWithHrefs.some(this.isLinkActive())
    );
  }
}

import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FreelancerBreakpoints } from '@freelancer/ui/breakpoints';
import * as Rx from 'rxjs';
import {
  ViewHeaderTemplate,
  ViewHeaderTemplateConfig,
} from './view-header-template.service';

export enum ViewHeaderType {
  /** Inject the header into the nav on mobile */
  MOBILE_ONLY = 'mobile_only',
  /** Inject into the nav on mobile, but leave in the template on tablet and up */
  SHOW_ALL = 'show_all',
}

@Directive({ selector: '[flViewHeaderTemplate]' })
export class ViewHeaderTemplateDirective implements OnInit, OnDestroy {
  /**
   * Introducing _flViewHeaderTemplate with setter and getter because
   * when using directive like following <ng-container *flViewHeaderTemplate>
   * then flViewHeaderTemplate = '' and '' is not of type ViewHeaderType.
   * Also including '' in getter just because it must be the same type as
   * setter, although it will always be returned _flViewHeaderTemplate
   * which is of type ViewHeaderType.
   */
  _flViewHeaderTemplate: ViewHeaderType;
  get flViewHeaderTemplate(): ViewHeaderType | '' {
    return this._flViewHeaderTemplate;
  }

  @Input()
  set flViewHeaderTemplate(flViewHeaderTemplate: ViewHeaderType | '') {
    this._flViewHeaderTemplate =
      flViewHeaderTemplate === ''
        ? ViewHeaderType.MOBILE_ONLY
        : flViewHeaderTemplate;
  }

  /**
   * Content passed will be slotted in the title. When set to true,
   * the default view header will be completely replaced.
   */
  @Input() flViewHeaderTemplateFullReplacement = false;

  private config: ViewHeaderTemplateConfig;
  private mobileRegistrationSubscription?: Rx.Subscription;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private viewHeaderTemplate: ViewHeaderTemplate,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this.config = {
      fullReplacement: this.flViewHeaderTemplateFullReplacement,
      templateRef: this.templateRef,
    };

    // use breakpoint here to only register the global header on mobile views
    // otherwise, the template injection in the navigation can mess with
    // the local template embedded view and result in no content sometimes
    this.mobileRegistrationSubscription = this.breakpointObserver
      .observe(FreelancerBreakpoints.TABLET)
      .subscribe(tablet => {
        this.viewContainerRef.clear();
        this.viewHeaderTemplate.deregisterHeader(this.config);

        if (
          tablet.matches &&
          this.flViewHeaderTemplate === ViewHeaderType.SHOW_ALL
        ) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.viewHeaderTemplate.registerHeader(this.config);
        }
      });
  }

  ngOnDestroy() {
    if (this.config) {
      this.viewHeaderTemplate.deregisterHeader(this.config);
    }
    if (this.mobileRegistrationSubscription) {
      this.mobileRegistrationSubscription.unsubscribe();
    }
  }
}

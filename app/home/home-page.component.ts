import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { Localization } from '@freelancer/localization';
import { Seo } from '@freelancer/seo';
import { ContainerSize } from '@freelancer/ui/container';
import { Margin } from '@freelancer/ui/margin';
import { UserAgent } from '@freelancer/user-agent';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-home-page',
  template: `
    <fl-tracking-hotjar></fl-tracking-hotjar>

    <app-home-page-hero></app-home-page-hero>

    <fl-container class="HomePage-container">
      <app-companies-trust-logo></app-companies-trust-logo>
      <fl-hr
        [flMarginBottom]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></fl-hr>

      <app-home-page-need-work-done-redesign
        [flMarginBottom]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></app-home-page-need-work-done-redesign>

      <fl-hr
        [flMarginBottom]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></fl-hr>

      <app-home-page-benefits
        [flMarginBottom]="Margin.XLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></app-home-page-benefits>
    </fl-container>

    <fl-bit
      class="HomePage-crowdFavorites"
      [flMarginBottom]="Margin.XLARGE"
      [flMarginBottomDesktop]="Margin.XXXXLARGE"
    >
      <fl-container class="HomePage-crowdFavorites-container">
        <app-home-page-crowd-favorites></app-home-page-crowd-favorites>
      </fl-container>
    </fl-bit>

    <fl-container class="HomePage-container">
      <app-home-page-hire-categories-redesign
        [flMarginBottom]="Margin.XXLARGE"
        [flMarginBottomTablet]="Margin.XXXLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></app-home-page-hire-categories-redesign>

      <fl-hr
        [flMarginBottom]="Margin.XXLARGE"
        [flMarginBottomTablet]="Margin.XXXLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></fl-hr>

      <app-home-page-api-enterprise-v3
        [flMarginBottom]="Margin.XXXLARGE"
        [flMarginBottomDesktop]="Margin.XXXXLARGE"
      ></app-home-page-api-enterprise-v3>
    </fl-container>
  `,
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit, OnDestroy {
  Margin = Margin;
  ContainerSize = ContainerSize;

  private aaTestSubscription?: Rx.Subscription;
  showRedesign$: Rx.Observable<boolean | undefined>;

  @Input() description: string;
  @Input() title: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: Seo,
    private abTest: ABTest,
    private userAgent: UserAgent,
    private localization: Localization,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    if (
      !isPlatformServer(this.platformId) &&
      !this.userAgent.isBrowserIE() &&
      this.localization.isEnglish()
    ) {
      // Run outside Angular's zone since we dont care about which variant the AA test returns
      // It won't trigger a CD cycle here as the Component is using `OnPush`,
      // but it still prevents the Angular Zone to become stable which is used - for instance - by the SRR preboot logic.
      this.ngZone.runOutsideAngular(() => {
        // Enroll to the AA test. Since it's an AA test,
        // no need to check for the returned variation
        this.aaTestSubscription = this.abTest
          .getSessionExperimentVariation('T194698-home-page-aa-test-v1')
          .subscribe();
      });
    }

    this.seo.setPageTags({
      title: this.title,
      description: this.description,
    });
  }

  ngOnDestroy() {
    if (this.aaTestSubscription) {
      this.aaTestSubscription.unsubscribe();
    }
  }
}

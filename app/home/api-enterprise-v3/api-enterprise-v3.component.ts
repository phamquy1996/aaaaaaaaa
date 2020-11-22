import { Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-home-page-api-enterprise-v3',
  template: `
    <fl-bit class="ApiEnterpriseBlade" flTrackingSection="HomePage">
      <fl-grid class="ApiEnterpriseBlade-grid">
        <fl-col
          class="ApiEnterpriseBlade-grid-col"
          [col]="12"
          [colDesktopLarge]="6"
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.XXXLARGE"
          [flMarginBottomDesktop]="Margin.XXLARGE"
        >
          <app-home-page-api-enterprise-card
            class="ApiCard"
            subtext="Freelancer API"
            i18n-subtext="API upsell card subtext"
            header="48 million professionals on demand"
            i18n-header="API upsell card heading"
            description="Why hire people when you can simply integrate our talented cloud
        workforce instead?"
            i18n-description="API upsell card description"
            cta="View Documentation"
            i18n-cta="Label of Contact Us button for Enterprise"
            [image]="'home/api-enterprise/api-upsell-v2.jpg'"
            [trackingLabel]="'ApiUpsell-ApiButton'"
            [link]="'https://developers.freelancer.com/'"
          ></app-home-page-api-enterprise-card>
        </fl-col>
        <fl-hr [flShowMobile]="true" [flMarginBottom]="Margin.XLARGE"></fl-hr>
        <fl-col
          class="ApiEnterpriseBlade-grid-col"
          [col]="12"
          [colDesktopLarge]="6"
          [flMarginBottomDesktop]="Margin.XXLARGE"
        >
          <app-home-page-api-enterprise-card
            class="EnterpriseCard"
            subtext="Freelancer Enterprise"
            i18n-subtext="Enterprise upsell card subtext"
            header="Company budget? Get more done for less"
            i18n-header="Enterprise upsell card heading"
            description="Use our workforce of 48 million to help your business achieve more."
            i18n-description="API upsell card description"
            cta="Contact Us"
            i18n-cta="Label of Contact Us button for Enterprise"
            [image]="'home/api-enterprise/enterprise-upsell-v2.jpg'"
            [trackingLabel]="'ApiUpsell-EnterpriseButton'"
            [link]="'/enterprise'"
            [isReverse]="true"
          ></app-home-page-api-enterprise-card>
        </fl-col>
      </fl-grid>
    </fl-bit>
  `,
  styleUrls: ['./api-enterprise-v3.component.scss'],
})
export class HomePageApiEnterpriseV3Component {
  Margin = Margin;
}

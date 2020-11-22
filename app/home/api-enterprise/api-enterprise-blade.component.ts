import { Component } from '@angular/core';
import { LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-home-page-api-enterprise',
  template: `
    <fl-bit class="ApiEnterpriseBlade" [flTrackingSection]="'HomePage'">
      <fl-grid class="ApiEnterpriseBlade-grid">
        <fl-col
          [col]="12"
          [colTablet]="6"
          [flMarginBottom]="Margin.LARGE"
          [flMarginBottomTablet]="Margin.NONE"
        >
          <fl-bit class="ApiEnterpriseCard" [flHideDesktopLarge]="true">
            <fl-link
              class="ApiEnterpriseCard-link"
              flTrackingLabel="ApiUpsell-ApiCard"
              [link]="'https://developers.freelancer.com/'"
              [underline]="LinkUnderline.NEVER"
            >
              <app-home-page-api-upsell-card
                class="CardWrapper"
              ></app-home-page-api-upsell-card>
            </fl-link>
          </fl-bit>
          <fl-bit class="ApiEnterpriseCard" [flShowDesktopLarge]="true">
            <app-home-page-api-upsell-card
              [showBackground]="true"
            ></app-home-page-api-upsell-card>
          </fl-bit>
        </fl-col>
        <fl-col [col]="12" [colTablet]="6">
          <fl-bit class="ApiEnterpriseCard" [flHideDesktopLarge]="true">
            <fl-link
              class="ApiEnterpriseCard-link"
              flTrackingLabel="ApiUpsell-EnterpriseCard"
              [link]="'/enterprise'"
              [underline]="LinkUnderline.NEVER"
            >
              <app-home-page-enterprise-upsell-card
                class="CardWrapper"
              ></app-home-page-enterprise-upsell-card>
            </fl-link>
          </fl-bit>
          <fl-bit class="ApiEnterpriseCard" [flShowDesktopLarge]="true">
            <app-home-page-enterprise-upsell-card
              [showBackground]="true"
            ></app-home-page-enterprise-upsell-card>
          </fl-bit>
        </fl-col>
      </fl-grid>
    </fl-bit>
  `,
  styleUrls: ['./api-enterprise-blade.component.scss'],
})
export class HomePageApiEnterpriseBladeComponent {
  LinkUnderline = LinkUnderline;
  Margin = Margin;
}

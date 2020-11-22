import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';
import { LinkColor } from '@freelancer/ui/link';
import { LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { BackgroundColor, LayoutMinHeight } from '@freelancer/ui/page-layout';
import { FontColor } from '@freelancer/ui/text';

@Component({
  selector: 'app-high-conversion-page',
  template: `
    <fl-page-layout
      [backgroundColor]="BackgroundColor.DARK"
      [layoutMinHeight]="LayoutMinHeight.FULL"
      [pageSize]="pageSize"
    >
      <fl-page-layout-single>
        <fl-grid>
          <fl-col [col]="12" [colTablet]="6">
            <ng-content select="app-high-conversion-page-header"></ng-content>
          </fl-col>
          <fl-col
            class="HighConversionLogoContainer"
            [col]="12"
            [colTablet]="3"
            [pull]="'right'"
            [flHideMobile]="true"
          >
            <fl-link
              flTrackingLabel="HighConversionHeader.Logo"
              [link]="'/'"
              [flMarginBottom]="Margin.XSMALL"
            >
              <fl-logo [size]="LogoSize.SMALL"></fl-logo>
            </fl-link>
          </fl-col>
        </fl-grid>
        <ng-content></ng-content>
        <fl-bit class="HighConversionPageFooter">
          <!-- don't translate legal text -->
          <fl-text [color]="FontColor.DARK" [flMarginBottom]="Margin.XXSMALL">
            {{ 'Copyright &copy;' }}{{ currentTime | date: 'yyyy' }}
            {{ 'Freelancer Technology Pty Limited (ACN 142 189 759)' }}
          </fl-text>
          <fl-link
            i18n="Footer link"
            flTrackingLabel="HighConversionFooter.PrivacyPolicyLink"
            [flMarginRight]="Margin.XSMALL"
            [link]="'/about/privacy'"
            [color]="LinkColor.DARK"
          >
            Privacy policy
          </fl-link>
          <fl-link
            i18n="Footer link"
            flTrackingLabel="HighConversionFooter.TermsConditionsLink"
            [flMarginRight]="Margin.XSMALL"
            [link]="'/about/terms'"
            [color]="LinkColor.DARK"
          >
            Terms and Conditions
          </fl-link>
          <fl-link
            i18n="Footer link"
            flTrackingLabel="HighConversionFooter.CopyrightPolicyLink"
            [flMarginRight]="Margin.XSMALL"
            [link]="'/dmca'"
            [color]="LinkColor.DARK"
          >
            Copyright Infringement Policy
          </fl-link>
          <fl-link
            i18n="Footer link"
            flTrackingLabel="HighConversionFooter.CodeOfConductLink"
            [flMarginRight]="Margin.XSMALL"
            [link]="'/info/codeofconduct.php'"
            [color]="LinkColor.DARK"
          >
            Code of Conduct
          </fl-link>
        </fl-bit>
      </fl-page-layout-single>
    </fl-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./high-conversion-page.component.scss'],
})
export class HighConversionPageComponent {
  Margin = Margin;
  BackgroundColor = BackgroundColor;
  FontColor = FontColor;
  LayoutMinHeight = LayoutMinHeight;
  LinkColor = LinkColor;
  LogoSize = LogoSize;

  readonly currentTime: number = Date.now();

  @Input() pageSize = ContainerSize.DESKTOP_LARGE;
}

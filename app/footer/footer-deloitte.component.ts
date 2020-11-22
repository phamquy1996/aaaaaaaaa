import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { LanguageSwitcherTheme } from '@freelancer/language-switcher';
import { ContainerSize } from '@freelancer/ui/container';
import { HorizontalAlignment, VerticalAlignment } from '@freelancer/ui/grid';
import { IconColor } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { BackgroundColor, LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { SocialButtonColor } from '@freelancer/ui/social-buttons';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-footer-deloitte',
  template: `
    <div class="FooterSection" flTrackingSection="Footer">
      <fl-container [size]="size">
        <fl-grid>
          <fl-col [colDesktopSmall]="4">
            <fl-bit
              class="FooterInfo"
              [flMarginBottom]="Margin.SMALL"
              [flMarginBottomTablet]="Margin.LARGE"
            >
              <fl-link [link]="'/'" [flTrackingLabel]="'flLogo'">
                <fl-logo
                  [size]="LogoSize.SMALL"
                  [backgroundColor]="BackgroundColor.DARK"
                >
                </fl-logo>
              </fl-link>
            </fl-bit>
            <fl-bit class="FooterInfo" [flMarginBottom]="Margin.SMALL">
              <fl-icon
                class="FooterInfoIcon"
                [name]="'ui-help'"
                [color]="IconColor.LIGHT"
                [flMarginRight]="Margin.XSMALL"
              >
              </fl-icon>
              <fl-link
                i18n="Footer link label"
                [link]="'/support'"
                [color]="LinkColor.LIGHT"
                [hoverColor]="LinkHoverColor.LIGHT"
                [flTrackingLabel]="'goToSupport'"
              >
                Help & Support
              </fl-link>
            </fl-bit>
            <fl-bit class="FooterInfo" [flMarginBottom]="Margin.SMALL">
              <fl-icon
                class="FooterInfoIcon"
                [name]="'ui-link'"
                [color]="IconColor.LIGHT"
                [flMarginRight]="Margin.XSMALL"
              >
              </fl-icon>
              <fl-link
                i18n="MyGigs KX Link"
                [link]="
                  'https://consulting.deloitteresources.com/services/so/Pages/mygigs.aspx'
                "
                [color]="LinkColor.LIGHT"
                [hoverColor]="LinkHoverColor.LIGHT"
                [flTrackingLabel]="'goToMyGigsKx'"
              >
                Deloitte MyGigs KX Page
              </fl-link>
            </fl-bit>
          </fl-col>
          <fl-col [colTablet]="6" [colDesktopSmall]="4">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Terms
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="//deloittenet.deloitte.com/About/Policies/Admin/Pages/910_Privacy_Policy_US.aspx"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToDeloittePrivacy'"
                >
                  Deloitte Privacy Policy
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="//deloittenet.deloitte.com/About/Policies/Admin/Pages/223_ConfidentialInformationOtherVitalBusinessInterests_US.aspx"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToDeloitteConfidentiality'"
                >
                  Deloitte Confidentiality Policy
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/privacy"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToPrivacy'"
                >
                  Privacy Policy
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about/terms"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToTerms'"
                >
                  Terms and Conditions
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/dmca"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToCopyright'"
                >
                  Copyright Policy
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/info/codeofconduct"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToCodeOfConduct'"
                >
                  Code of Conduct
                </fl-link>
              </fl-bit>
            </fl-bit>
          </fl-col>
        </fl-grid>
      </fl-container>
    </div>
    <div class="FooterSection">
      <fl-container [size]="size">
        <fl-grid class="FooterBordered">
          <fl-col [colTablet]="6">
            <!-- don't translate legal text -->
            <fl-text [color]="FontColor.LIGHT" [size]="TextSize.XXXSMALL">
              {{
                'Freelancer &reg; is a registered Trademark of Freelancer Technology Pty Limited (ACN 142 189 759)'
              }}
            </fl-text>
            <fl-text [color]="FontColor.LIGHT" [size]="TextSize.XXXSMALL">
              {{ 'Copyright &copy;' }} {{ currentTime | date: 'yyyy' }}
              {{ 'Freelancer Technology Pty Limited (ACN 142 189 759)' }}
            </fl-text>
          </fl-col>
        </fl-grid>
      </fl-container>
    </div>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterDeloitteComponent {
  Margin = Margin;
  HorizontalAlignment = HorizontalAlignment;
  VerticalAlignment = VerticalAlignment;
  LogoSize = LogoSize;
  BackgroundColor = BackgroundColor;
  LanguageSwitcherTheme = LanguageSwitcherTheme;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  IconColor = IconColor;
  PictureDisplay = PictureDisplay;
  SocialButtonColor = SocialButtonColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;

  readonly currentTime: number = Date.now();
  userCount$: Rx.Observable<number>;
  projectCount$: Rx.Observable<number>;
  size: ContainerSize;

  @HostBinding('attr.role')
  @Input()
  role = 'contentinfo';
  @Input() hideFooter: boolean;

  @Input() set containerSize(value: ContainerSize) {
    this.size = value || ContainerSize.DESKTOP_LARGE;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import { UsersSelfCollection } from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { LanguageSwitcherTheme } from '@freelancer/language-switcher';
import { ButtonColor } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';
import { IconColor } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { BackgroundColor, LogoSize } from '@freelancer/ui/logo';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-footer-arrow',
  template: `
    <div class="FooterSection" flTrackingSection="Footer">
      <fl-container [size]="size">
        <fl-grid>
          <fl-col [colDesktopSmall]="12">
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
            <fl-bit [flMarginBottom]="Margin.LARGE">
              <fl-language-switcher
                [color]="LanguageSwitcherTheme.LIGHT"
              ></fl-language-switcher>
            </fl-bit>
          </fl-col>
        </fl-grid>

        <fl-grid>
          <fl-col [colTablet]="2">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              About
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/about"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToAbout'"
                >
                  About Us
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/feesandcharges"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goTofeesandcharges'"
                >
                  Fees and Charges
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/sitemap"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToSitemap'"
                >
                  Sitemap
                </fl-link>
              </fl-bit>
            </fl-bit>
          </fl-col>

          <fl-col [colTablet]="2">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Get in Touch
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/support/categories"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToJob'"
                >
                  Get Support
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/translation/signup/"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToJobs'"
                >
                  Help Translate
                </fl-link>
              </fl-bit>
              <fl-bit [flMarginBottom]="Margin.XXXSMALL">
                <fl-link
                  link="/contact"
                  i18n="Footer link label"
                  [color]="LinkColor.MID"
                  [hoverColor]="LinkHoverColor.LIGHT"
                  [flTrackingLabel]="'goToContact'"
                >
                  Contact Us
                </fl-link>
              </fl-bit>
            </fl-bit>
          </fl-col>

          <fl-col [colTablet]="2">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Freelancer
            </fl-text>
            <fl-bit class="FooterNav" [flMarginBottom]="Margin.SMALL">
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
                  Copyright Infringement Policy
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

          <fl-col [colTablet]="6">
            <fl-text
              class="FooterTitle"
              i18n="Footer column title"
              [fontType]="FontType.SPAN"
              [color]="FontColor.LIGHT"
              [size]="TextSize.SMALL"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.XSMALL"
            >
              Copyright
            </fl-text>

            <!-- don't translate legal text -->
            <fl-text [color]="FontColor.LIGHT" [size]="TextSize.XXXSMALL">
              {{
                'Freelancer &reg; is a registered trademark of Freelancer Technology Pty Limited (ACN 142 189 759)'
              }}
            </fl-text>
            <fl-text
              [color]="FontColor.LIGHT"
              [size]="TextSize.XXXSMALL"
              [flMarginBottom]="Margin.SMALL"
            >
              {{ 'Copyright &reg;' }} {{ currentTime | date: 'yyyy' }}
              {{
                'Arrow Electronics, Inc. All rights reserved. - Copyright &reg;'
              }}
              {{ currentTime | date: 'yyyy' }}
              {{ 'Freelancer Technology Pty Limited.' }}
            </fl-text>

            <fl-bit class="FooterSocialIcons">
              <fl-social-buttons-arrow
                [color]="IconColor.WHITE"
                [fluid]="true"
              ></fl-social-buttons-arrow>
            </fl-bit>
          </fl-col>
        </fl-grid>
      </fl-container>
    </div>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterArrowComponent implements OnInit {
  Margin = Margin;
  LogoSize = LogoSize;
  BackgroundColor = BackgroundColor;
  ButtonColor = ButtonColor;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LanguageSwitcherTheme = LanguageSwitcherTheme;
  IconColor = IconColor;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  Feature = Feature;

  readonly currentTime = Date.now();
  size: ContainerSize;

  @Input() set containerSize(value: ContainerSize) {
    this.size = value || ContainerSize.DESKTOP_LARGE;
  }

  usersSelfDoc: DatastoreDocument<UsersSelfCollection>;

  constructor(private auth: Auth, private datastore: Datastore) {}

  ngOnInit() {
    this.usersSelfDoc = this.datastore.document<UsersSelfCollection>(
      'usersSelf',
      this.auth.getUserId(),
    );
  }
}

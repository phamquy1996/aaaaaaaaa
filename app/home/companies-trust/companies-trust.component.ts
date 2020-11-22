import { Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-companies-trust',
  template: `
    <fl-bit class="CompaniesTrust">
      <fl-text
        class="CompaniesTrust-text"
        i18n="As used by text"
        [size]="TextSize.SMALL"
        [sizeTablet]="TextSize.MID"
        [color]="FontColor.MID"
        [flMarginBottom]="Margin.SMALL"
        [flMarginBottomTablet]="Margin.NONE"
        [flMarginRightTablet]="Margin.MID"
      >
        As used by
      </fl-text>
      <fl-bit class="CompaniesTrust-companies">
        <fl-bit
          class="CompaniesTrust-companies-list"
          [flMarginRightTablet]="Margin.MID"
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.NONE"
        >
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="Microsoft Icon"
            i18n-alt="Microsoft Icon Alternative Text"
            [src]="'home/companies/microsoft.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
            [flMarginRight]="Margin.MID"
          ></fl-picture>
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="SAP Icon"
            i18n-alt="SAP Icon Alternative Text"
            [src]="'home/companies/sap.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
            [flMarginRight]="Margin.MID"
          ></fl-picture>
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="Metlife Icon"
            i18n-alt="Metlife Icon Alternative Text"
            [src]="'home/companies/metlife.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
            [flMarginRight]="Margin.MID"
          ></fl-picture>
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="Intel Icon"
            i18n-alt="Intel Icon Alternative Text"
            [src]="'home/companies/intel.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
          ></fl-picture>
        </fl-bit>
        <fl-bit class="CompaniesTrust-companies-list">
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="Boeing Icon"
            i18n-alt="Boeing Icon Alternative Text"
            [src]="'home/companies/boeing.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
            [flMarginRight]="Margin.MID"
          ></fl-picture>
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="Avery Dennison Icon"
            i18n-alt="Avery Dennison Icon Alternative Text"
            [src]="'home/companies/avery-dennison.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
            [flMarginRight]="Margin.MID"
          ></fl-picture>
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="PWC Icon"
            i18n-alt="PWC Icon Alternative Text"
            [src]="'home/companies/pwc.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
            [flMarginRight]="Margin.MID"
          ></fl-picture>
          <fl-picture
            class="CompaniesTrust-companies-list-image"
            alt="GE Icon"
            i18n-alt="GE Icon Alternative Text"
            [src]="'home/companies/ge.svg'"
            [display]="PictureDisplay.BLOCK"
            [boundedWidth]="true"
          ></fl-picture>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./companies-trust.component.scss'],
})
export class HomePageCompaniesTrustComponent {
  FontColor = FontColor;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;
}

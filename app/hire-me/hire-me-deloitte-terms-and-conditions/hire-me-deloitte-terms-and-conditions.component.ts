import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Assets } from '@freelancer/ui/assets';
import { Margin } from '@freelancer/ui/margin';
import { FontColor } from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';

@Component({
  selector: 'app-hire-me-deloitte-terms-and-conditions',
  template: `
    <fl-hr [flMarginBottom]="Margin.SMALL"></fl-hr>
    <fl-bit class="CheckboxWrapper" [flMarginBottom]="Margin.SMALL">
      <ng-container
        *ngIf="hireMeFormGroup.get('agreeToTermsAndConditions') as control"
      >
        <fl-checkbox
          *ngIf="isFormControl(control)"
          flTrackingLabel="HireMeTermsAndConditionCheckbox"
          [control]="control"
        ></fl-checkbox>
      </ng-container>
      <fl-text
        i18n="Agreement about confidential information label"
        [color]="FontColor.LIGHT"
      >
        I have reviewed my project and affirm that no
        <fl-link
          flTrackingLabel="DeloitteHireMeConfidentialInformation"
          [link]="confidentialInformationUrl"
          [newTab]="true"
        >
          confidential information
        </fl-link>
        has been shared in this project posting in compliance with Deloitte's
        <fl-link
          flTrackingLabel="DeloitteHireMeTermsAndConditions"
          [link]="
            'https://deloittenet.deloitte.com/About/Policies/Admin/Pages/223_ConfidentialInformationOtherVitalBusinessInterests_US.aspx'
          "
        >
          Confidentiality Policy
        </fl-link>
        and
        <fl-link
          flTrackingLabel="DeloitteHireMeTermsAndConditions"
          [link]="
            'https://deloittenet.deloitte.com/About/Policies/Admin/Pages/910_Privacy_Policy_US.aspx'
          "
        >
          Privacy Policy</fl-link
        >.
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./hire-me-deloitte-terms-and-conditions.component.scss'],
})
export class HireMeDeloitteTermsAndConditionsComponent implements OnInit {
  FontColor = FontColor;
  isFormControl = isFormControl;
  Margin = Margin;

  @Input() hireMeFormGroup: FormGroup;

  confidentialInformationUrl: string;

  constructor(private assets: Assets) {}

  ngOnInit() {
    this.confidentialInformationUrl = this.assets.getUrl(
      'confidential-information.pdf',
    );
  }
}

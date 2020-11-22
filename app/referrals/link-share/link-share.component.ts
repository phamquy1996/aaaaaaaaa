import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Clipboard } from '@freelancer/clipboard';
import { Currency } from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { InputSize } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-give-get-link-share',
  template: `
    <fl-bit>
      <fl-bit>
        <fl-label i18n="Giveget link share input label" [for]="'link'">
          Share your link
        </fl-label>
        <fl-bit class="InputContainer">
          <fl-input
            [id]="'link'"
            [control]="referralInput"
            [attrReadonly]="true"
            [size]="InputSize.LARGE"
            [flMarginBottom]="Margin.XXSMALL"
            [flTrackingLabel]="'linkShareLinkInput'"
          ></fl-input>
          <fl-link
            class="CopyLink"
            [flTrackingLabel]="'linkShareCopyButton'"
            (click)="handleCopyLink()"
          >
            <fl-bit
              *ngIf="!isCopied && !hasCopyFailed"
              i18n="Giveget link share copy button before copy"
            >
              Copy Link
            </fl-bit>
            <fl-bit
              *ngIf="isCopied"
              i18n="Giveget link share copy button after copy"
            >
              Copied!
            </fl-bit>
            <fl-bit
              *ngIf="hasCopyFailed"
              i18n="Giveget link share copy button failed to copy"
            >
              Copy failed
            </fl-bit>
          </fl-link>
        </fl-bit>
      </fl-bit>
      <fl-bit>
        <fl-social-buttons
          i18n-shareText="Giveget link share social media spiel"
          shareText="Get {{
            localizedBonus | flCurrency: userCurrency.code
          }} for your first project on Freelancer.com!"
          [shareUrl]="referralLink"
        ></fl-social-buttons>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./link-share.component.scss'],
})
export class LinkShareComponent implements OnInit {
  ButtonColor = ButtonColor;
  TextSize = TextSize;
  FontType = FontType;
  InputSize = InputSize;
  Margin = Margin;

  @Input() referralLink: string;
  @Input() localizedBonus: number;
  @Input() localizedBonusRequirement: number;
  @Input() userCurrency: Currency;

  shareText: string;
  isCopied = false;
  hasCopyFailed = false;
  referralInput: FormControl;

  constructor(private clipboard: Clipboard) {}

  ngOnInit() {
    this.referralInput = new FormControl(this.referralLink);
  }

  handleCopyLink() {
    if (this.copyLink()) {
      this.isCopied = true;
    } else {
      this.hasCopyFailed = true;
    }
  }

  copyLink() {
    return this.clipboard.copy(this.referralLink);
  }
}

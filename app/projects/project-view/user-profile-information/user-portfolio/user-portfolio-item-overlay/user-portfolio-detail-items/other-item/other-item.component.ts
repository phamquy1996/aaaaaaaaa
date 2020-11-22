import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  PortfolioFile,
  PortfolioItem,
} from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { LinkColor, LinkWeight } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-other-item',
  template: `
    <fl-bit class="Item-content">
      <fl-bit
        *ngFor="let articleItem of portfolioItem.articles"
        class="Item-content-body"
      >
        <fl-text>
          {{ articleItem.text }}
        </fl-text>
      </fl-bit>
      <fl-bit *ngFor="let imgItem of extraImgItems">
        <fl-picture
          [alt]="imgItem.description"
          [display]="PictureDisplay.BLOCK"
          [src]="imgItem.cdnUrl"
          [externalSrc]="true"
          [fullWidth]="true"
          [flMarginBottom]="Margin.XXSMALL"
        ></fl-picture>
      </fl-bit>
      <fl-bit
        *ngFor="let otherItem of extraOtherItems"
        class="Item-content-extra"
      >
        <fl-file-display
          [src]="otherItem.filename"
          [alt]="otherItem.filename"
          [flMarginRight]="Margin.SMALL"
        ></fl-file-display>
        <fl-link
          flTrackingLabel="OtherItemExtraFileLink"
          [link]="otherItem.cdnUrl"
          [color]="LinkColor.DARK"
          [weight]="LinkWeight.BOLD"
        >
          {{ otherItem.filename }}
        </fl-link>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./other-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherItemComponent implements OnInit {
  HeadingType = HeadingType;
  TextSize = TextSize;
  FontColor = FontColor;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  LinkWeight = LinkWeight;
  LinkColor = LinkColor;

  @Input() portfolioItem: PortfolioItem;
  imageTypes: ReadonlyArray<string> = ['gif', 'png', 'jpg'];
  extraImgItems: ReadonlyArray<PortfolioFile> = [];
  extraOtherItems: ReadonlyArray<PortfolioFile> = [];

  ngOnInit() {
    if (this.portfolioItem.files) {
      this.portfolioItem.files.forEach(item => {
        const fileFormat = item.filename.split('.').pop();
        if (fileFormat && this.imageTypes.indexOf(fileFormat) !== -1) {
          this.extraImgItems = [...this.extraImgItems, item];
        } else {
          this.extraOtherItems = [...this.extraOtherItems, item];
        }
      });
    }
  }
}

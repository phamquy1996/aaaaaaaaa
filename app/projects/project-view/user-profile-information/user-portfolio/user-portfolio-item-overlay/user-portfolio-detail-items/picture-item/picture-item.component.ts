import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PortfolioItem } from '@freelancer/datastore/collections';
import { FileDisplayType } from '@freelancer/ui/file-display';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureObjectFit } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-picture-item',
  template: `
    <fl-bit class="PictureItem">
      <ul>
        <li *ngFor="let image of portfolioItem.files">
          <fl-picture
            class="PictureItem-image"
            [alt]="image.description"
            [display]="PictureDisplay.BLOCK"
            [src]="image.cdnUrl"
            [externalSrc]="true"
            [fullWidth]="true"
          ></fl-picture>
        </li>
      </ul>
    </fl-bit>
  `,
  styleUrls: ['./picture-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureItemComponent {
  PictureDisplay = PictureDisplay;
  PictureObjectFit = PictureObjectFit;
  FileDisplayType = FileDisplayType;
  IconColor = IconColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() portfolioItem: PortfolioItem;
}

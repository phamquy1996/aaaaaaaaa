import { Component, Input } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-media-object',
  template: `
    <fl-bit class="MediaObject">
      <fl-bit
        class="Thumbnail"
        [flMarginRight]="size === 'small' ? Margin.XSMALL : Margin.SMALL"
      >
        <ng-content select="app-media-object-thumbnail"></ng-content>
      </fl-bit>
      <fl-bit class="Content">
        <ng-content select="app-media-object-content"></ng-content>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./media-object.component.scss'],
})
export class MediaObjectComponent {
  Margin = Margin;

  // the string passed in is not the exact Margin used, because English
  @Input() size: 'small' | 'mid';
}

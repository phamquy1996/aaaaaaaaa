import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  LinkColor,
  LinkHoverColor,
  LinkUnderline,
  LinkWeight,
  QueryParams,
} from '@freelancer/ui/link';
import { HighlightColor, TextSize } from '@freelancer/ui/text';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'fl-linkshim',
  template: `
    <fl-link
      [color]="color"
      [newTab]="true"
      flTrackingLabel="shimmedLink"
      [highlightColor]="highlightColor"
      [hoverColor]="hoverColor"
      [size]="size"
      [link]="baseUrl"
      [queryParams]="queryParams"
      [underline]="underline"
      [weight]="weight"
      rel="noopener"
    >
      <ng-content></ng-content>
    </fl-link>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkshimComponent implements OnChanges {
  readonly baseUrl = '/users/l.php';

  @Input() color: LinkColor = LinkColor.DEFAULT;
  @Input() highlightColor?: HighlightColor;
  @Input() hoverColor: LinkHoverColor = LinkHoverColor.DEFAULT;
  @Input() size: TextSize = TextSize.XSMALL;
  @Input() underline: LinkUnderline = LinkUnderline.HOVER;
  @Input() weight: LinkWeight = LinkWeight.INHERIT;
  @Input() link: string;

  queryParams: QueryParams = {};

  constructor(private auth: Auth) {}

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes('link')) {
      this.queryParams = {
        url: this.link,
        sig: sha256(this.auth.getCSRFToken() + this.link),
      };
    }
  }
}

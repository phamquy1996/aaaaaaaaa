import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { IconBackdrop, IconColor, IconSize } from '@freelancer/ui/icon';
import { TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';

interface User {
  username?: string;
  id: number;
  avatar?: string;
}

@Component({
  selector: 'app-feed-item',
  template: `
    <fl-button
      [link]="routerLink"
      [queryParams]="urlTree?.queryParams || undefined"
      [fragment]="urlTree?.fragment || undefined"
      class="ItemLink"
      [attr.data-highlighted]="highlighted"
      [attr.data-padding-size]="size"
      display="block"
      [flTrackingLabel]="flTrackingLabel"
    >
      <app-media-object class="FeedItem" [size]="size">
        <app-media-object-thumbnail>
          <fl-user-avatar
            *ngIf="thumbnail === 'image'"
            [users]="users"
            [size]="size === 'small' ? AvatarSize.SMALL : AvatarSize.MID"
          ></fl-user-avatar>
          <fl-icon
            *ngIf="thumbnail === 'icon'"
            [name]="thumbnailIcon"
            [color]="thumbnailColor"
            [backdrop]="thumbnailBackdrop"
            [size]="size === 'small' ? IconSize.SMALL : IconSize.MID"
          ></fl-icon>
        </app-media-object-thumbnail>
        <app-media-object-content>
          <fl-text
            [size]="size === 'small' ? TextSize.XXSMALL : TextSize.XSMALL"
          >
            <ng-content></ng-content>
          </fl-text>
        </app-media-object-content>
      </app-media-object>
    </fl-button>
  `,
  styleUrls: ['./feed-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedItemComponent implements OnChanges {
  AvatarSize = AvatarSize;
  IconBackdrop = IconBackdrop;
  IconColor = IconColor;
  IconSize = IconSize;
  TextSize = TextSize;

  urlTree?: UrlTree;
  routerLink?: string;
  defaultLinkUrl = '';

  @Input() link?: string;
  @Input() flTrackingLabel: string;
  @Input() thumbnail: 'image' | 'icon';
  @Input() users: ReadonlyArray<User> = [];
  @Input() thumbnailAlt: string;
  @Input() thumbnailIcon: string;
  @Input() thumbnailColor: IconColor;
  @Input() thumbnailBackdrop: IconBackdrop;
  @Input() highlighted = false;
  @Input() size: 'small' | 'mid';

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('link' in changes) {
      this.urlTree = this.router.parseUrl(this.link || this.defaultLinkUrl);
      const primaryLink = this.urlTree.root.children.primary;

      // UrlSegmentGroup#toString() doesn't have info of the leading slash.
      // Put it back when calling it.
      this.routerLink = primaryLink ? `/${primaryLink.toString()}` : undefined;
    }
  }
}

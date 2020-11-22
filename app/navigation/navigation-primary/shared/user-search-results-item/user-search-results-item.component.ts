import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchFreelancersEntry } from '@freelancer/datastore/collections';
import { Feature } from '@freelancer/feature-flags';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { UsernameSize } from '@freelancer/ui/username';

@Component({
  selector: 'app-user-search-results-item',
  template: `
    <fl-button
      [flTrackingLabel]="trackingLabel"
      [link]="'/u/' + user?.username"
    >
      <fl-bit class="UserSearchResultsItem">
        <fl-user-avatar
          [flMarginRight]="Margin.XSMALL"
          [users]="[user]"
          [size]="AvatarSize.LARGE"
        ></fl-user-avatar>
        <fl-bit class="UserSearchResultsItem-userInformation">
          <fl-bit
            class="UserSearchResultsItem-countryUsername"
            [flMarginBottom]="Margin.XXSMALL"
          >
            <fl-username
              *ngIf="user?.publicName"
              [country]="user?.flagCode"
              [displayName]="user?.publicName"
              [username]="user?.username"
              [size]="UsernameSize.SMALL"
              [compact]="true"
              [truncateText]="true"
            ></fl-username>
          </fl-bit>
          <fl-rating
            *flFeature="Feature.FREELANCER_RATING"
            [control]="rating"
            [readOnly]="true"
            [size]="IconSize.SMALL"
          ></fl-rating>
        </fl-bit>
      </fl-bit>
    </fl-button>
  `,
  styleUrls: ['./user-search-results-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchResultsItemComponent implements OnChanges {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  TextSize = TextSize;
  IconSize = IconSize;
  Margin = Margin;
  Feature = Feature;
  UsernameSize = UsernameSize;

  @Input() trackingLabel: string;
  @Input() user: SearchFreelancersEntry;

  rating = new FormControl(0);

  ngOnChanges() {
    if (this.user && this.user.reputation) {
      this.rating.setValue(this.user.reputation);
    }
  }
}

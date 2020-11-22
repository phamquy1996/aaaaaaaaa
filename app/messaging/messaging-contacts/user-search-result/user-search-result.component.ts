import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  OnlineOfflineUserStatus,
  User,
} from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-user-search-result',
  template: `
    <fl-bit class="StatusMessage" [flMarginBottom]="Margin.XXSMALL">
      <ng-container
        *ngIf="searchStatus === 'idle'"
        i18n="Contact list search status"
      >
        Press Enter on the search bar to search for users by username.
      </ng-container>
      <ng-container
        *ngIf="searchStatus === 'searching'"
        i18n="Contact list search status"
      >
        Searching...
      </ng-container>
      <ng-container
        *ngIf="searchStatus === 'error'"
        i18n="Contact list search status"
      >
        Something went wrong while searching for this user. Please try again.
      </ng-container>
      <ng-container
        *ngIf="searchStatus === 'empty'"
        i18n="Contact list search status"
      >
        No user found.
      </ng-container>
    </fl-bit>
    <ng-container *ngIf="searchUser && showSearchResults">
      <fl-text i18n="Messaging contact list subheading"> DIRECT CHAT </fl-text>
      <fl-bit
        *ngIf="searchUser"
        class="MainRow"
        flTrackingLabel="OpenSearchResult"
        flTrackingReferenceType="user_id"
        flTrackingReferenceId="{{ searchUser.id }}"
        (click)="handleClick()"
      >
        <fl-user-avatar
          [users]="[searchUser]"
          [isOnline]="
            searchUser
              ? (searchUser | isOnline: (onlineOfflineStatuses$ | async))
              : undefined
          "
          [flMarginRight]="Margin.XXXSMALL"
        ></fl-user-avatar>
        <div
          class="TextContainer"
          data-uitest-target="contactlist-user-item-title"
        >
          {{ searchUser.displayName }}
        </div>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./user-search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchResultComponent {
  Margin = Margin;
  TextSize = TextSize;
  FontType = FontType;

  @Input() searchUser?: User;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() searchStatus: 'idle' | 'searching' | 'error' | 'empty' = 'idle';
  @Output() userSelected = new EventEmitter<User>();
  @Input() showSearchResults = false;

  handleClick() {
    if (this.searchUser) {
      this.userSelected.emit(this.searchUser);
    }
  }
}

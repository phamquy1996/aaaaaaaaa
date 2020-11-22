import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  DiscoverCollectionItem,
  DiscoverItemContext,
} from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-discover-like-button',
  template: `
    <ng-container *ngIf="isLoggedIn$ | async; else loggedOut">
      <app-discover-like-logged-in-button
        [context]="context"
        [likesCollectionId]="likesCollectionId"
        [discoverLikeItems]="discoverLikeItems"
      ></app-discover-like-logged-in-button>
    </ng-container>
    <ng-template #loggedOut>
      <fl-button
        flTrackingLabel="loggedOutLikeButton"
        (click)="redirectToSignUp()"
      >
        <fl-icon
          class="HeartIconOutline"
          [name]="'ui-heart-alt-v2'"
          [size]="IconSize.MID"
          [color]="IconColor.DARK"
          [hoverColor]="HoverColor.CURRENT"
        >
        </fl-icon>
      </fl-button>
    </ng-template>
  `,
  styleUrls: ['./discover-like-button.component.scss'],
})
export class DiscoverLikeButtonComponent implements OnInit {
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;

  @Input() context: DiscoverItemContext;
  @Input() likesCollectionId: number;
  @Input() discoverLikeItems: ReadonlyArray<DiscoverCollectionItem>;

  isLoggedIn$: Rx.Observable<boolean>;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn();
  }

  redirectToSignUp() {
    this.router.navigate(['/signup'], {
      queryParams: {
        next: `${this.router.url}&like=true&item_id=${this.context.itemId}`,
      },
    });
  }
}

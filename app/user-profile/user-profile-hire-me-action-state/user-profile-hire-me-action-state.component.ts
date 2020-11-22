import { Component, Input } from '@angular/core';
import * as Rx from 'rxjs';
import { AwardProjectHireMeState } from '../user-profile-award-project.types';

@Component({
  selector: 'app-user-profile-hire-me-action-state',
  template: `
    <ng-container *ngIf="awardProjectHireMeState$ | async as state">
      <fl-bit [ngSwitch]="state">
        <ng-content
          *ngSwitchCase="AwardProjectHireMeState.LOADING"
          select="[loading-state]"
        ></ng-content>

        <ng-content
          *ngSwitchCase="AwardProjectHireMeState.HIRE_ME"
          select="[hire-me-state]"
        ></ng-content>

        <ng-content
          *ngSwitchCase="AwardProjectHireMeState.AWARD_PROJECT"
          select="[award-project-state]"
        ></ng-content>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./user-profile-hire-me-action-state.component.scss'],
})
export class UserProfileHireMeActionStateComponent {
  AwardProjectHireMeState = AwardProjectHireMeState;

  @Input() awardProjectHireMeState$: Rx.Observable<AwardProjectHireMeState>;
}

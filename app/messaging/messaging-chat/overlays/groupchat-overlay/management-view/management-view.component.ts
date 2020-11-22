import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Datastore, startWithEmptyList } from '@freelancer/datastore';
import {
  Contact,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { ButtonColor } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import * as Rx from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  tap,
} from 'rxjs/operators';
import { CandidateGroupListComponent } from './candidate-group-list.component';
import { SearchComponent } from './search.component';

@Component({
  selector: 'app-management-view',
  template: `
    <app-overlay-header>
      <fl-bit
        [flMarginBottom]="Margin.XXXSMALL"
        i18n="Chatbox groupchat management header"
      >
        Add Users
      </fl-bit>
      <app-search
        flTrackingSection="GroupchatSearch"
        [inputControl]="searchFormControl"
      ></app-search>
      <fl-bit *ngIf="isRecruiter" class="SearchStatus">
        {{ searchStatus }}
      </fl-bit>
    </app-overlay-header>
    <app-overlay-content>
      <app-candidate-group-list
        [candidateBidders]="candidateBidders"
        [candidateContacts]="candidateContacts"
        [candidateCollaborators]="candidateCollaborators"
        [candidateTeamMembers]="candidateTeamMembers$ | async"
        [candidateUserSearch]="candidateUserSearch$ | async"
        [onlineOfflineStatuses$]="onlineOfflineStatuses$"
        [hasUserSearchAccess]="isRecruiter"
        [thread]="thread"
        [team]="team"
        [searchText]="searchText$ | async"
        (modifyMembers)="modifyMembers($event)"
      ></app-candidate-group-list>
    </app-overlay-content>
    <app-overlay-controls>
      <app-overlay-controls-item>
        <fl-button
          [color]="ButtonColor.DEFAULT"
          display="block"
          (click)="handleCloseView()"
          flTrackingLabel="CloseManagementView"
          i18n="Chatbox groupchat control button"
        >
          Back
        </fl-button>
      </app-overlay-controls-item>
      <app-overlay-controls-item>
        <fl-button
          class="ControlButton"
          [color]="ButtonColor.SECONDARY"
          display="block"
          (click)="handleAdd()"
          flTrackingLabel="AddUsersToChat"
          [disabled]="selectedUsers.size === 0"
          i18n="Chatbox groupchat control button"
        >
          Chat
        </fl-button>
      </app-overlay-controls-item>
    </app-overlay-controls>
  `,
  styleUrls: ['./management-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementViewComponent implements OnInit {
  Margin = Margin;
  ButtonColor = ButtonColor;

  @Input() candidateBidders: ReadonlyArray<User>;
  @Input() candidateContacts: ReadonlyArray<Contact>;
  @Input() candidateCollaborators: ReadonlyArray<User>;
  @Input() thread: Thread;
  @Input() team: Team;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() isRecruiter: boolean;
  @ViewChild(SearchComponent, { static: true })
  searchComponent: SearchComponent;
  @ViewChild(CandidateGroupListComponent)
  candidateGroupListComponent: CandidateGroupListComponent;
  @Output() closeView = new EventEmitter<void>();
  @Output() addUsers = new EventEmitter<ReadonlyArray<number>>();
  candidateTeamMembers$: Rx.Observable<ReadonlyArray<User>>;
  searchText$: Rx.Observable<string>;
  searchFormControl = new FormControl();
  searchStatus = 'Press Enter to search for users by username.';
  selectedUsers = new Set<User>();
  candidateUserSearch$: Rx.Observable<ReadonlyArray<User>>;

  constructor(private datastore: Datastore) {}

  handleCloseView() {
    this.closeView.emit();
  }

  ngOnInit() {
    this.searchText$ = this.searchFormControl.valueChanges.pipe(
      startWith(''),
      publishReplay(1),
      refCount(),
      distinctUntilChanged(),
    );

    this.candidateTeamMembers$ = this.datastore
      .collection<UsersCollection>(
        'users',
        Rx.of(
          this.team
            ? this.team.members.filter(
                memberUserId => !this.thread.members.includes(memberUserId),
              )
            : [],
        ),
      )
      .valueChanges()
      .pipe(startWithEmptyList());

    this.candidateUserSearch$ = this.datastore
      .collection<UsersCollection>('users', query =>
        query.limit(1).where(
          'username',
          'equalsIgnoreCase',
          this.searchComponent.keyEnter.pipe(
            filter(() => this.isRecruiter),
            map(() => this.searchFormControl.value as string),
            filter(value => value !== ''),
            distinctUntilChanged(),
            tap(() => {
              this.searchStatus = 'Searching...';
            }),
          ),
        ),
      )
      .valueChanges()
      .pipe(
        tap(users => {
          if (users.length > 0) {
            this.searchStatus = 'Press Enter to search for users by username.';
          } else {
            this.searchStatus = 'No user found.';
          }
        }),
        catchError((err, caught$) => {
          this.searchStatus =
            'Something went wrong while searching for this user.';
          return caught$;
        }),
        startWithEmptyList(),
      );
  }

  handleAdd() {
    if (this.selectedUsers.size > 0) {
      const userIds = Array.from(this.selectedUsers.values()).map(
        user => user.id,
      );
      this.addUsers.emit(userIds);
      this.candidateGroupListComponent.resetSelectedUsers();
    }
  }

  modifyMembers(selectedUsers: Set<User>) {
    this.selectedUsers = selectedUsers;
  }
}

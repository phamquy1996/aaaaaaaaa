import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  BaseUser,
  Contact,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-candidate-group-list',
  template: `
    <app-candidate-group
      *ngIf="hasUserSearchAccess"
      i18n-name="Chatbox groupchat candidate group name"
      name="Search"
      [candidateUsers]="candidateUserSearch"
      [selectedUsers]="selectedUsers"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      (userSelected)="handleUserSelected($event)"
    ></app-candidate-group>
    <app-candidate-group
      i18n-name="Chatbox groupchat candidate group name"
      name="Bidders"
      *ngIf="!team"
      [candidateUsers]="filteredCandidateBidders"
      [selectedUsers]="selectedUsers"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      (userSelected)="handleUserSelected($event)"
    ></app-candidate-group>
    <app-candidate-group
      i18n-name="Chatbox groupchat candidate group name"
      name="Contacts"
      *ngIf="!team"
      [candidateUsers]="filteredCandidateContacts"
      [selectedUsers]="selectedUsers"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      (userSelected)="handleUserSelected($event)"
    ></app-candidate-group>
    <app-candidate-group
      i18n-name="Chatbox groupchat candidate group name"
      name="Collaborators"
      *ngIf="!team"
      [candidateUsers]="filteredCandidateCollaborators"
      [selectedUsers]="selectedUsers"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      (userSelected)="handleUserSelected($event)"
    ></app-candidate-group>
    <app-candidate-group
      i18n-name="Chatbox groupchat candidate group name"
      name="Team Members"
      *ngIf="
        team && (thread.threadType === 'team' || thread.context.type === 'team')
      "
      [candidateUsers]="filteredCandidateTeamMembers"
      [selectedUsers]="selectedUsers"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      (userSelected)="handleUserSelected($event)"
    ></app-candidate-group>
  `,
  styleUrls: ['./candidate-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateGroupListComponent implements OnChanges {
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;
  @Input() candidateBidders: ReadonlyArray<User>;
  @Input() candidateContacts: ReadonlyArray<Contact>;
  @Input() candidateCollaborators: ReadonlyArray<User>;
  @Input() candidateUserSearch: ReadonlyArray<User>;
  @Input() candidateTeamMembers: ReadonlyArray<User>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() hasUserSearchAccess = false;
  @Input() searchText: string;
  @Input() thread: Thread;
  @Input() team: Team;
  @Output() modifyMembers = new EventEmitter<Set<User>>();

  filteredCandidateBidders: ReadonlyArray<User>;
  filteredCandidateContacts: ReadonlyArray<Contact>;
  filteredCandidateCollaborators: ReadonlyArray<User>;
  filteredCandidateTeamMembers: ReadonlyArray<User>;
  selectedUsers: Set<User> = new Set();

  handleUserSelected(user: User) {
    if (this.selectedUsers.has(user)) {
      this.selectedUsers.delete(user);
    } else {
      this.selectedUsers.add(user);
    }
    this.modifyMembers.emit(this.selectedUsers);
  }

  resetSelectedUsers() {
    this.selectedUsers.clear();
  }

  private filterCandidatesBySearchTerm<T extends BaseUser>(
    candidates: ReadonlyArray<T>,
    searchTerm: string,
  ): ReadonlyArray<T> {
    return candidates.filter(candidate =>
      candidate.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('searchText' in changes || 'candidateBidders' in changes) {
      this.filteredCandidateBidders = this.filterCandidatesBySearchTerm(
        this.candidateBidders,
        this.searchText,
      );
    }

    if ('searchText' in changes || 'candidateContacts' in changes) {
      this.filteredCandidateContacts = this.filterCandidatesBySearchTerm(
        this.candidateContacts,
        this.searchText,
      );
    }

    if ('searchText' in changes || 'candidateCollaborators' in changes) {
      this.filteredCandidateCollaborators = this.filterCandidatesBySearchTerm(
        this.candidateCollaborators,
        this.searchText,
      );
    }

    if ('searchText' in changes || 'candidateTeamMembers' in changes) {
      this.filteredCandidateTeamMembers = this.filterCandidatesBySearchTerm(
        this.candidateTeamMembers,
        this.searchText,
      );
    }
  }
}

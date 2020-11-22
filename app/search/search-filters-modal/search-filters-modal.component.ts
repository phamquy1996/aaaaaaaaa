import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FilterArrayItem,
  SearchFiltersService,
} from '@freelancer/search-filters';
import { ModalRef } from '@freelancer/ui';
import * as Rx from 'rxjs';
import { ChecklistOption } from '../search-checklist-filter/search-checklist-filter.component';
import { handleFilterDropdownSelect } from '../search.helpers';
import {
  ContestFilters,
  ProjectFilters,
  SearchType,
  UserFilters,
} from '../search.model';

@Component({
  selector: 'app-search-filters-modal',
  template: `
    <app-search-filters-users
      *ngIf="searchType === SearchType.USERS"
      [examsChecklistFormGroup]="examsChecklistFormGroup"
      [examsChecklistOptions$]="examsChecklistOptions$"
      [examsDropdownOptions$]="examsDropdownOptions$"
      [filters]="filters"
      [isLoggedIn$]="isLoggedIn$"
      [skillsChecklistFormGroup]="skillsChecklistFormGroup"
      [skillsChecklistOptions$]="skillsChecklistOptions$"
      [skillsDropdownOptions$]="skillsDropdownOptions$"
      (examsDropdownSelect)="handleExamsDropdownSelect($event)"
      (hideFilters)="closeModal()"
      (skillsDropdownSelect)="handleSkillsDropdownSelect($event)"
    ></app-search-filters-users>

    <app-search-filters-projects
      *ngIf="searchType === SearchType.PROJECTS"
      [filters]="filters"
      [languagesChecklistFormGroup]="languagesChecklistFormGroup"
      [languagesChecklistOptions$]="languagesChecklistOptions$"
      [languagesDropdownOptions$]="languagesDropdownOptions$"
      [projectTypesChecklistFormGroup]="projectTypesChecklistFormGroup"
      [projectTypesChecklistOptions$]="projectTypesChecklistOptions$"
      [skillsChecklistFormGroup]="skillsChecklistFormGroup"
      [skillsChecklistOptions$]="skillsChecklistOptions$"
      [skillsDropdownOptions$]="skillsDropdownOptions$"
      [upgradesChecklistFormGroup]="projectUpgradesChecklistFormGroup"
      [upgradesChecklistOptions$]="projectUpgradesChecklistOptions$"
      (hideFilters)="closeModal()"
      (languagesDropdownSelect)="handleLanguagesDropdownSelect($event)"
      (skillsDropdownSelect)="handleSkillsDropdownSelect($event)"
    ></app-search-filters-projects>

    <app-search-filters-contests
      *ngIf="searchType === SearchType.CONTESTS"
      [filters]="filters"
      [skillsChecklistFormGroup]="skillsChecklistFormGroup"
      [skillsChecklistOptions$]="skillsChecklistOptions$"
      [skillsDropdownOptions$]="skillsDropdownOptions$"
      (hideFilters)="closeModal()"
      (skillsDropdownSelect)="handleSkillsDropdownSelect($event)"
    ></app-search-filters-contests>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersModalComponent {
  SearchType = SearchType;

  @Input() examsChecklistFormGroup: FormGroup;
  @Input() examsChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() examsDropdownOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  @Input() examsFilterFromService$: Rx.Observable<
    ReadonlyArray<FilterArrayItem>
  >;
  @Input() filters: FormGroup;
  @Input() isLoggedIn$: Rx.Observable<boolean>;
  @Input() languagesChecklistFormGroup: FormGroup;
  @Input() languagesChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() languagesDropdownOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() languagesFilterFromService$: Rx.Observable<
    ReadonlyArray<FilterArrayItem>
  >;
  @Input() projectTypesChecklistFormGroup: FormGroup;
  @Input() projectTypesChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() projectUpgradesChecklistFormGroup: FormGroup;
  @Input() projectUpgradesChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() searchType: SearchType;
  @Input() skillsChecklistFormGroup: FormGroup;
  @Input() skillsChecklistOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() skillsDropdownOptions$: Rx.Observable<
    ReadonlyArray<ChecklistOption>
  >;
  @Input() skillsFilterFromService$: Rx.Observable<
    ReadonlyArray<FilterArrayItem>
  >;

  constructor(
    private modalRef: ModalRef<SearchFiltersModalComponent>,
    private searchFiltersService: SearchFiltersService,
  ) {}

  closeModal() {
    this.modalRef.close();
  }

  handleLanguagesDropdownSelect(languageId: FilterArrayItem['value']) {
    handleFilterDropdownSelect(
      languageId,
      SearchType.PROJECTS,
      ProjectFilters.LANGUAGES,
      this.languagesFilterFromService$,
      this.searchFiltersService,
    );
  }

  handleSkillsDropdownSelect(skillId: FilterArrayItem['value']) {
    handleFilterDropdownSelect(
      skillId,
      this.searchType,
      this.searchType === SearchType.USERS
        ? UserFilters.SKILLS
        : this.searchType === SearchType.PROJECTS
        ? ProjectFilters.SKILLS
        : ContestFilters.SKILLS,
      this.skillsFilterFromService$,
      this.searchFiltersService,
    );
  }

  handleExamsDropdownSelect(examId: FilterArrayItem['value']) {
    handleFilterDropdownSelect(
      examId,
      SearchType.USERS,
      UserFilters.EXAMS,
      this.examsFilterFromService$,
      this.searchFiltersService,
    );
  }
}

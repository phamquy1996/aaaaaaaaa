import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  BackendDeleteResponse,
  BackendUpdateResponse,
  Datastore,
  DatastoreDocument,
  OrderByDirection,
  uniqWith,
} from '@freelancer/datastore';
import {
  Category,
  MembershipBenefitsCollection,
  Skill,
  SkillsCollection,
  UsersCollection,
  UserSkill,
  UserSkillsCollection,
} from '@freelancer/datastore/collections';
import { Tracking } from '@freelancer/tracking';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { StickyBehaviour, StickyPosition } from '@freelancer/ui/sticky';
import { isDefined, toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
  startWith,
  take,
} from 'rxjs/operators';
import { SkillsButtonType } from './skills.config';

@Component({
  selector: 'fl-skills',
  template: `
    <fl-bit class="SkillsContainer" flTrackingSection="{{ trackingSection }}">
      <fl-bit class="SkillsSearchSection">
        <fl-banner-alert
          *ngIf="showSavingSkillError"
          i18n="Error saving skills message"
          [closeable]="false"
          [flMarginBottom]="Margin.SMALL"
          [type]="BannerAlertType.ERROR"
        >
          There was an issue when saving your skills. Please try again. If the
          problem persists
          <fl-link link="/support" flTrackingLabel="ErrorSavingSupportLink">
            contact support.
          </fl-link>
        </fl-banner-alert>

        <fl-bit [flMarginBottom]="Margin.SMALL">
          <fl-search
            #search
            i18n-placeholder="Skill search placeholder"
            placeholder="Search a skill"
            [displayResults]="false"
            (query)="handleSearchText($event)"
          ></fl-search>
        </fl-bit>

        <fl-hr
          i18n-label="Skill selector divider text"
          label="OR"
          [flMarginBottomDesktop]="Margin.SMALL"
          [flMarginBottomTablet]="Margin.NONE"
        ></fl-hr>
      </fl-bit>

      <fl-bit class="SkillsContent" [flMarginBottomDesktop]="Margin.MID">
        <fl-skills-categories
          class="SkillsContent-card"
          [flHideMobile]="!(showCategories$ | async)"
          [flMarginRightDesktop]="Margin.MID"
          [categories$]="categories$"
          (selectCategory)="handleSelectCategory($event); search.clearQuery()"
        ></fl-skills-categories>

        <fl-skills-category
          class="SkillsContent-card"
          [flHideMobile]="showCategories$ | async"
          [flMarginRightDesktop]="Margin.MID"
          [filteredSkills]="filteredSkills$ | async"
          [loadingSkillSearch]="loadingSkillSearch$ | async"
          [maxSkillsLimit]="maxSkillsLimit$ | async"
          [searchText]="searchText$ | async"
          [selectedCategory]="selectedCategory$ | async"
          [selectedSkills]="selectedSkills$ | async"
          (deselectSkill)="handleDeselectSkill($event)"
          (selectSkill)="handleSelectSkill($event)"
          (showCategories)="showCategories($event); search.clearQuery()"
          (showMaxSkillsLimit)="handleShowMaxSkillsLimit()"
        ></fl-skills-category>

        <fl-drawer
          #drawer
          i18n-mobileHeaderTitle="Header title for selected skills"
          mobileHeaderTitle="Selected skills"
          [edgeToEdge]="true"
          [fullWidth]="true"
          [flHideDesktop]="true"
        >
          <ng-template #drawerTemplate>
            <fl-skills-selected
              [matchingSkillCount]="matchingSkillCount$ | async"
              [maxSkillsLimit]="maxSkillsLimit$ | async"
              [selectedSkills]="selectedSkills$ | async"
              (deselectSkill)="handleDeselectSkill($event)"
            >
            </fl-skills-selected>
          </ng-template>
        </fl-drawer>

        <fl-skills-selected
          class="SkillsContent-selected"
          [flShowDesktop]="true"
          [matchingSkillCount]="matchingSkillCount$ | async"
          [maxSkillsLimit]="maxSkillsLimit$ | async"
          [selectedSkills]="selectedSkills$ | async"
          (deselectSkill)="handleDeselectSkill($event)"
        >
        </fl-skills-selected>
      </fl-bit>

      <fl-bit [flHideDesktop]="true">
        <fl-bit
          class="SaveStickyButton"
          [flSticky]="true"
          [flStickyBehaviour]="StickyBehaviour.ALWAYS"
          [flStickyPosition]="StickyPosition.BOTTOM"
        >
          <fl-link
            *ngIf="selectedSkills$ | async as selectedSkills"
            flTrackingLabel="ViewSelectedSkills"
            (click)="drawer.open()"
          >
            <ng-container
              *ngIf="selectedSkills.length === 1; else pluralState"
              i18n="Number of skills selected message in singular form"
            >
              {{ selectedSkills.length }} skill selected
            </ng-container>
            <ng-template #pluralState>
              <ng-container
                i18n="Number of skills selected message in plural form"
              >
                {{ selectedSkills.length }} skills selected
              </ng-container>
            </ng-template>
          </fl-link>

          <fl-button
            flTrackingLabel="{{
              buttonType === SkillsButtonType.NEXT
                ? 'ClickNext'
                : 'SaveSkillsButton'
            }}"
            [busy]="busySavingSkills$ | async"
            [color]="ButtonColor.SECONDARY"
            [disabled]="(selectedSkills$ | async)?.length === 0"
            [size]="ButtonSize.LARGE"
            (click)="handleSaveSkills()"
          >
            <ng-container
              *ngIf="buttonType === SkillsButtonType.NEXT; else saveButton"
              i18n="Save skills next button"
            >
              Next
            </ng-container>
            <ng-template #saveButton>
              <ng-container i18n="Save skills button">
                Save
              </ng-container>
            </ng-template>
          </fl-button>
        </fl-bit>
      </fl-bit>

      <fl-bit class="SkillsFooter" [flShowDesktop]="true">
        <fl-button
          flTrackingLabel="{{
            buttonType === SkillsButtonType.NEXT
              ? 'ClickNext'
              : 'SaveSkillsButton'
          }}"
          [busy]="busySavingSkills$ | async"
          [color]="ButtonColor.SECONDARY"
          [disabled]="(selectedSkills$ | async)?.length === 0"
          [size]="ButtonSize.LARGE"
          (click)="handleSaveSkills()"
        >
          <ng-container
            *ngIf="buttonType === SkillsButtonType.NEXT; else saveButton"
            i18n="Save skills next button"
          >
            Next
          </ng-container>
          <ng-template #saveButton>
            <ng-container i18n="Save skills button">
              Save
            </ng-container>
          </ng-template>
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnInit, OnChanges, OnDestroy {
  BannerAlertType = BannerAlertType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  Margin = Margin;
  SkillsButtonType = SkillsButtonType;
  StickyBehaviour = StickyBehaviour;
  StickyPosition = StickyPosition;

  private readonly OTHERS_CATEGORY: Category = { name: 'Others', id: 99 };
  private readonly DELOITTE_SKILLS_FILTER: ReadonlyArray<number> = [88, 252]; // Dating and XXX skills

  private _busySavingSkills$ = new Rx.BehaviorSubject<boolean>(false);
  private _loadingSkillSearch$ = new Rx.Subject<boolean>();
  private _maxSkillsSubject$ = new Rx.Subject<number>();
  private _searchText$ = new Rx.BehaviorSubject<string>('');
  private _selectedCategory$ = new Rx.Subject<Category>();
  private _selectedSkills$ = new Rx.BehaviorSubject<ReadonlyArray<Skill>>([]);
  private _showCategories$ = new Rx.BehaviorSubject<boolean>(true);

  busySavingSkills$ = this._busySavingSkills$.asObservable();
  loadingSkillSearch$ = this._loadingSkillSearch$.asObservable();
  maxSkillsSubject$ = this._maxSkillsSubject$.asObservable();
  searchText$ = this._searchText$.asObservable();
  selectedCategory$ = this._selectedCategory$.asObservable();
  selectedSkills$ = this._selectedSkills$.asObservable();
  showCategories$ = this._showCategories$.asObservable();

  userDocument: DatastoreDocument<UsersCollection>;
  userSkillsDocument: DatastoreDocument<UserSkillsCollection>;
  filteredSkillsSubscription?: Rx.Subscription;
  skillsInitializeSubscription?: Rx.Subscription;
  skillSearchSubscription?: Rx.Subscription;

  categories$: Rx.Observable<ReadonlyArray<Category>>;
  filteredSkills$: Rx.Observable<ReadonlyArray<Skill>>;
  matchingSkillCount$: Rx.Observable<number>;
  maxSkillsLimit$: Rx.Observable<number>;
  userId$: Rx.Observable<number>;

  changesMade = false;
  showSavingSkillError = false;

  @Input() buttonType: SkillsButtonType = SkillsButtonType.SAVE;
  @Input() maxSkillLimit: number;

  // Needed for the tracking added on logic
  @Input() trackingSection: string;

  @Output() saveSkills = new EventEmitter<boolean>();
  @Output() showMaxSkillsLimit = new EventEmitter();

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private tracking: Tracking,
  ) {}

  ngOnInit() {
    const allSkillsCollection$ = this.datastore
      .collection<SkillsCollection>('skills', q =>
        q.orderBy('activeProjectCount', OrderByDirection.DESC),
      )
      .valueChanges()
      .pipe(publishReplay(1), refCount());
    this.userSkillsDocument = this.datastore.document<UserSkillsCollection>(
      'userSkills',
    );

    this.userId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));
    this.userDocument = this.datastore.document<UsersCollection>(
      'users',
      this.userId$,
    );

    // filtering out xxx and dating skills for deloitte
    // TODO: filter these on backend (T131917)
    const allSkills$ = Rx.combineLatest([
      allSkillsCollection$,
      this.userDocument.valueChanges(),
    ]).pipe(
      map(([allSkills, user]) =>
        user.isDeloitteDcUser
          ? allSkills.filter(
              skill => !this.DELOITTE_SKILLS_FILTER.includes(skill.id),
            )
          : allSkills,
      ),
      publishReplay(1),
      refCount(),
    );

    this.skillsInitializeSubscription = Rx.combineLatest([
      this.userSkillsDocument.valueChanges().pipe(distinctUntilChanged()),
      allSkills$.pipe(distinctUntilChanged()),
      this.busySavingSkills$.pipe(distinctUntilChanged()),
    ]).subscribe(([usersSkills, skills, savingSkills]) => {
      // Don't reinitialise after saving the skills as we close the form after this.
      if (savingSkills) {
        return;
      }

      const selectedSkills: Skill[] = [];

      skills.forEach(skill => {
        const hasSkill = usersSkills.skills.includes(skill.id);
        if (hasSkill) {
          selectedSkills.push(skill);
        }
      });

      this._selectedSkills$.next(selectedSkills);
    });

    const membershipBenefitsDocument$ = this.datastore.document<
      MembershipBenefitsCollection
    >('membershipBenefits', 'skills_limit');

    this.maxSkillsLimit$ = Rx.combineLatest([
      membershipBenefitsDocument$.valueChanges(),
      this.maxSkillsSubject$.pipe(startWith(undefined)),
    ]).pipe(map(([benefit, maxSkills]) => maxSkills || benefit.value));

    this.skillSearchSubscription = this.searchText$.subscribe(() => {
      this._loadingSkillSearch$.next(true);
    });

    this.matchingSkillCount$ = this.selectedSkills$.pipe(
      map(skills =>
        skills.reduce((prev, cur) => prev + cur.activeProjectCount, 0),
      ),
    );

    this.filteredSkills$ = Rx.combineLatest([
      allSkills$,
      this.selectedCategory$.pipe(startWith(undefined)),
      this.searchText$.pipe(debounceTime(500)),
    ]).pipe(
      map(([skills, selectedCategory, searchInputText]) => {
        // If the user has used the skill search input, prioritise over the
        // selected category. Search on both the skill name and category name.
        if (searchInputText) {
          const searchTerm = searchInputText.toLowerCase();
          const filteredSkills = skills.filter(
            skill =>
              (skill.category &&
                skill.category.name &&
                skill.category.name.toLowerCase().includes(searchTerm)) ||
              skill.name.toLowerCase().includes(searchTerm),
          );
          this._loadingSkillSearch$.next(false);
          return filteredSkills;
        }
        // If a category has been selected return all skills with that category.
        if (selectedCategory) {
          const filteredSkills = skills.filter(
            skill =>
              skill.category && skill.category.id === selectedCategory.id,
          );
          this._loadingSkillSearch$.next(false);
          return filteredSkills;
        }

        this._loadingSkillSearch$.next(false);
        // The user has not selected a category or used the search box.
        return [];
      }),
    );

    this.filteredSkillsSubscription = this.filteredSkills$.subscribe(() => {
      this._loadingSkillSearch$.next(true);
    });

    this.categories$ = allSkills$.pipe(
      // Take only unique categories from all active skills.
      map(skills => [
        ...uniqWith(
          skills.map(skill => skill.category).filter(isDefined),
          (t1, t2) => t1.id === t2.id,
        )
          // Remove the 'Others' category and order by id.
          .filter(category => category.id !== this.OTHERS_CATEGORY.id)
          .sort((a, b) => a.id - b.id),
        // Appends the 'Others' category to the end of the list.
        this.OTHERS_CATEGORY,
      ]),
      publishReplay(1),
      refCount(),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('maxSkillLimit' in changes) {
      this._maxSkillsSubject$.next(this.maxSkillLimit);
    }
  }

  handleSelectCategory(selectedCategory: Category): void {
    this._selectedCategory$.next(selectedCategory);
    this.showCategories(false);
  }

  handleSelectSkill(selectedSkill: Skill): void {
    this.changesMade = true;

    this.selectedSkills$
      .pipe(take(1))
      .toPromise()
      .then(skills => {
        this._selectedSkills$.next([...skills, selectedSkill]);
      });

    const eventName = this._searchText$.getValue()
      ? 'SelectSkillFromSearch'
      : 'SelectSkillFromCategory';
    this.tracking.trackCustomEvent(eventName, this.trackingSection, {
      label: eventName,
    });
  }

  handleDeselectSkill(deselectedSkill: Skill): void {
    this.changesMade = true;

    this.selectedSkills$
      .pipe(take(1))
      .toPromise()
      .then(skills => {
        this._selectedSkills$.next(
          skills.filter(skill => skill !== deselectedSkill),
        );
      });

    const eventName = 'RemoveSelectedSkill';
    this.tracking.trackCustomEvent(eventName, this.trackingSection, {
      label: eventName,
    });
  }

  handleSaveSkills(): void {
    this._busySavingSkills$.next(true);

    Rx.combineLatest([this.userId$, this.selectedSkills$])
      .pipe(take(1))
      .toPromise()
      .then(([userId, selectedSkills]) => {
        const skillIds = selectedSkills.map(skill => skill.id);
        const userSkill: UserSkill = {
          id: userId,
          skills: skillIds,
        };

        // Only update the skills if the user has at least 1 skill selected.
        if (skillIds.length > 0) {
          this.userSkillsDocument
            .update(userSkill)
            .then(response => this.handleSaveResponse(response));
        } else {
          this.userSkillsDocument
            .remove()
            .then(response => this.handleSaveResponse(response));
        }
      });
  }

  handleSaveResponse(
    response:
      | BackendDeleteResponse<UserSkillsCollection>
      | BackendUpdateResponse<UserSkillsCollection>,
  ): void {
    this._busySavingSkills$.next(false);

    if (response.status === 'error') {
      this.showSavingSkillError = true;
      return;
    }

    this.saveSkills.emit(this.changesMade);
  }

  handleSearchText(searchText: string) {
    this._searchText$.next(searchText);

    const eventName = 'SearchSkill';
    this.tracking.trackCustomEvent(eventName, this.trackingSection, {
      label: eventName,
    });

    // in mobile view, hide categories and
    // show the search results upon typing
    if (searchText) {
      this.showCategories(false);
    }
  }

  handleShowMaxSkillsLimit() {
    this.showMaxSkillsLimit.emit();
  }

  showCategories(toShow: boolean) {
    this._showCategories$.next(toShow);
  }

  ngOnDestroy(): void {
    if (this.filteredSkillsSubscription) {
      this.filteredSkillsSubscription.unsubscribe();
    }
    if (this.skillsInitializeSubscription) {
      this.skillsInitializeSubscription.unsubscribe();
    }
    if (this.skillSearchSubscription) {
      this.skillSearchSubscription.unsubscribe();
    }
  }
}

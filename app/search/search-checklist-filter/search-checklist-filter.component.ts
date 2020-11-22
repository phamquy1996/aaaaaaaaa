import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { startWithEmptyList } from '@freelancer/datastore';
import { FilterArrayItem } from '@freelancer/search-filters';
import { Margin } from '@freelancer/ui/margin';
import { SearchItem } from '@freelancer/ui/search';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

export interface ChecklistOption {
  displayValue: string;
  id: string;
  value: string | number | object;
}

const MAX_SEARCH_RESULT_COUNT = 20;

@Component({
  selector: 'app-search-checklist-filter',
  template: `
    <fl-search
      [flMarginBottom]="Margin.SMALL"
      [itemTemplates]="{ item: itemTemplateRef }"
      [placeholder]="placeholder"
      [scrollableSearchResults]="true"
      [searchResults]="searchResults$ | async"
      (select)="handleSelect($event)"
      (query)="handleQuery($event)"
    >
      <ng-template #itemTemplateRef let-item>
        <fl-text>{{ item.displayValue }}</fl-text>
      </ng-template>
    </fl-search>
    <app-search-checklist
      [formGroup]="formGroup"
      [options$]="checklistOptions$"
    >
    </app-search-checklist>
  `,
  styleUrls: ['./search-checklist-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchChecklistFilterComponent implements OnInit {
  Margin = Margin;

  @Input() checklistOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  @Input() dropdownOptions$: Rx.Observable<ReadonlyArray<ChecklistOption>>;
  @Input() formGroup: FormGroup;
  @Input() placeholder: string;

  @Output() dropdownSelect = new EventEmitter<FilterArrayItem['value']>();

  private query$: Rx.Observable<string>;
  private querySubject$: Rx.BehaviorSubject<string>;

  searchResults$: Rx.Observable<ReadonlyArray<SearchItem>>;

  ngOnInit() {
    this.querySubject$ = new Rx.BehaviorSubject<string>('');
    this.query$ = this.querySubject$.asObservable();

    this.searchResults$ = Rx.combineLatest([
      this.query$,
      this.dropdownOptions$.pipe(
        map(options =>
          options.map(option => ({ type: 'item', context: option })),
        ),
      ),
    ]).pipe(
      map(([query, options]) =>
        options
          .filter(option =>
            option.context?.displayValue
              ?.toLowerCase()
              .includes(query.toLowerCase()),
          )
          .slice(0, MAX_SEARCH_RESULT_COUNT),
      ),
      startWithEmptyList(),
    );
  }

  handleQuery(query: string) {
    this.querySubject$.next(query);
  }

  handleSelect(searchItem: SearchItem) {
    if (!searchItem.context) {
      return;
    }

    this.dropdownSelect.emit(searchItem.context.id);
  }
}

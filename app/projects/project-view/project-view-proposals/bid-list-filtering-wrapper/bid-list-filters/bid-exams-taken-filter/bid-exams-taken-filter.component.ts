import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IconSize } from '@freelancer/ui/icon';
import { LinkUnderline, LinkWeight } from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { ExamControl, ExamCount } from '../../bid-list-filtering-wrapper.types';

@Component({
  selector: 'app-bid-exam-taken-filter',
  template: `
    <fl-bit [flMarginBottom]="Margin.MID">
      <fl-text
        i18n="Bid list freelancer exam filter title"
        [flMarginBottomTablet]="Margin.XXXSMALL"
        [weight]="FontWeight.MEDIUM"
        [size]="TextSize.SMALL"
      >
        Exams taken
      </fl-text>
      <fl-text
        i18n="Bid list freelancer exam filter description"
        [flMarginBottom]="Margin.SMALL"
        [color]="FontColor.MID"
      >
        Work with freelancers who have proven their credibility through our
        Freelancer Exams.
      </fl-text>
      <!-- Mobile implementation -->
      <fl-bit [flShowMobile]="true">
        <fl-bit class="ExamListItemGroup">
          <ng-content *ngTemplateOutlet="allExamOption"></ng-content>
          <app-exams-taken-filter-list-item
            *ngFor="
              let exam of (showAllFlag$ | async)
                ? examControl
                : (examControl | slice: 0:MOBILE_EXAMS_TO_SHOW)
            "
            [control]="exam.control"
            [count]="exam.count"
            [examName]="exam.name || exam.description"
            [flMarginBottom]="Margin.MID"
            [flShowMobile]="true"
            (click)="handleFilterChange()"
          >
          </app-exams-taken-filter-list-item>
        </fl-bit>
        <ng-container *ngIf="examControl.length > MOBILE_EXAMS_TO_SHOW">
          <ng-content *ngTemplateOutlet="showAll"></ng-content>
        </ng-container>
      </fl-bit>

      <!-- Desktop implementation -->
      <fl-bit [flHideMobile]="true">
        <fl-bit class="ExamListItemGroup">
          <ng-content *ngTemplateOutlet="allExamOption"></ng-content>
          <app-exams-taken-filter-list-item
            *ngFor="
              let exam of (showAllFlag$ | async)
                ? examControl
                : (examControl | slice: 0:DESKTOP_EXAMS_TO_SHOW)
            "
            [control]="exam.control"
            [count]="exam.count"
            [examName]="exam.name || exam.description"
            [flMarginBottom]="Margin.SMALL"
            [flHideMobile]="true"
            (click)="handleFilterChange()"
          >
          </app-exams-taken-filter-list-item>
        </fl-bit>
        <ng-container *ngIf="examControl.length > DESKTOP_EXAMS_TO_SHOW">
          <ng-content *ngTemplateOutlet="showAll"></ng-content>
        </ng-container>
      </fl-bit>
    </fl-bit>
    <fl-hr [flMarginBottom]="Margin.MID"></fl-hr>
    <!-- Templates -->
    <ng-template #allExamOption>
      <app-exams-taken-filter-list-item
        examName="All Exams"
        i18n-examName="All exams filter option"
        [control]="allExams"
        [count]="totalCount"
        [flMarginBottom]="Margin.MID"
        [flMarginBottomTablet]="Margin.SMALL"
        (click)="handleAllExamsClicked()"
      >
      </app-exams-taken-filter-list-item>
    </ng-template>
    <ng-template #showAll>
      <fl-link
        *ngIf="(showAllFlag$ | async) === false"
        flTrackingLabel="BidExamFilterShowAllCta"
        i18n="Show all exams"
        [size]="TextSize.SMALL"
        [underline]="LinkUnderline.NEVER"
        [weight]="LinkWeight.BOLD"
        (click)="handleShowAll()"
      >
        Show All
      </fl-link>
      <fl-link
        *ngIf="(showAllFlag$ | async) === true"
        flTrackingLabel="BidExamFilterShowLessCta"
        i18n="Show less exams"
        [size]="TextSize.SMALL"
        [underline]="LinkUnderline.NEVER"
        [weight]="LinkWeight.BOLD"
        (click)="handleShowLess()"
      >
        Show Less
      </fl-link>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bid-exams-taken-filter.component.scss'],
})
export class BidExamsTakenFilterComponent implements OnChanges, OnInit {
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkWeight = LinkWeight;
  LinkUnderline = LinkUnderline;
  ListItemType = ListItemType;
  ListItemPadding = ListItemPadding;
  Margin = Margin;
  TextAlign = TextAlign;
  TextSize = TextSize;
  FontColor = FontColor;

  @Input() exams: ReadonlyArray<ExamCount> = [];
  @Input() control: FormControl;
  @Output() filterChanged = new EventEmitter();

  private showAllFlagSubject$ = new Rx.BehaviorSubject<boolean>(false);
  showAllFlag$ = this.showAllFlagSubject$.asObservable();

  totalCount: number;
  examFilter: FormGroup; // Holds value of the exam controls, each value from `exams` should be represented here
  examControl: ReadonlyArray<ExamControl>; // A zipped version of `exams` and `examFilter`
  allExams: FormControl;

  MOBILE_EXAMS_TO_SHOW = 3;
  DESKTOP_EXAMS_TO_SHOW = 5;

  ngOnInit() {
    this.setup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('exams' in changes) {
      this.totalCount = this.exams.reduce((sum, exam) => sum + exam.count, 0);
    }
  }

  setup() {
    const controlValue = this.control.value as ReadonlyArray<string>;
    this.examFilter = new FormGroup({});
    const hasInitialData = controlValue.length > 0;
    this.showAllFlagSubject$.next(false);
    this.allExams = new FormControl(!hasInitialData);

    this.examControl = this.exams.map(
      exam =>
        ({
          ...exam,
          control: this.getExamControl(
            exam.name ? exam.name : exam.description ? exam.description : '',
            !hasInitialData,
          ),
        } as ExamControl),
    );

    // Serve initial data
    controlValue.map(examName =>
      this.examFilter.patchValue({
        [this.trimExamNameSpecialCharacters(examName)]: true,
      }),
    );
  }

  getExamControl(examName: string, defaultValue = true) {
    // Trim is necessary to avoid returning null when getting the form control by name.
    const trimmedExamName = this.trimExamNameSpecialCharacters(examName);
    if (!this.examFilter.get(trimmedExamName)) {
      this.examFilter.addControl(
        trimmedExamName,
        new FormControl(defaultValue),
      );
    }

    return this.examFilter.get(trimmedExamName);
  }

  trimExamNameSpecialCharacters(examName: string) {
    return examName.replace(/[^\w#+\s]/g, '');
  }

  reset() {
    this.allExams.setValue(true);
    this.examControl.map(exam => {
      exam.control.patchValue(true);
    });
    this.control.setValue([]);
    this.filterChanged.emit();
  }

  handleAllExamsClicked() {
    this.examControl.map(exam => exam.control.setValue(this.allExams.value));

    this.control.setValue([]);
    this.handleFilterChange();
  }

  updateAllExamControl() {
    this.allExams.setValue(
      this.examControl.every(exam => exam.control.value === true),
    );
  }

  handleFilterChange() {
    this.updateAllExamControl();

    this.control.setValue(
      this.examControl.every(exam => exam.control.value === true)
        ? []
        : this.examControl
            .filter(exam => exam.control.value)
            .map(exam => (exam.name ? exam.name : exam.description)),
    );

    this.filterChanged.emit();
  }

  handleShowAll() {
    this.showAllFlagSubject$.next(true);
  }

  handleShowLess() {
    this.showAllFlagSubject$.next(false);
  }
}

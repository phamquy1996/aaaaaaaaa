import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  RichMessage,
  RichMessageElement,
  RichMessagePayload,
  RichMessageValidatable,
} from '@freelancer/datastore/collections';
import * as Rx from 'rxjs';

// TODO T38030: Fix styling of left and right edges of rich messages in chatbox.
@Component({
  selector: 'app-rich-message',
  template: `
    <fl-bit class="Group" *ngFor="let section of richMessage.long">
      <ng-container
        flTrackingSection="rich-message"
        *ngFor="let el of section; let index = index"
      >
        <ng-container *ngIf="shouldDisplay(el)">
          <app-heading
            *ngIf="el.type === 'heading'"
            [element]="el"
          ></app-heading>

          <app-body *ngIf="el.type === 'body'" [element]="el"></app-body>

          <app-text-input
            *ngIf="el.type === 'text-input'"
            #inputel
            [element]="el"
            [disabled]="disabledSubject$ | async"
            [(richMessageValues)]="richMessageValues"
          ></app-text-input>

          <app-radio-input
            *ngIf="el.type === 'radio'"
            [element]="el"
            [disabled]="disabledSubject$ | async"
            [(richMessageValues)]="richMessageValues"
          ></app-radio-input>

          <app-checkbox-input
            *ngIf="el.type === 'checkbox'"
            #inputel
            [element]="el"
            [disabled]="disabledSubject$ | async"
            [(richMessageValues)]="richMessageValues"
          ></app-checkbox-input>

          <app-number-input
            *ngIf="el.type === 'number'"
            #inputel
            [element]="el"
            [disabled]="disabledSubject$ | async"
            [(richMessageValues)]="richMessageValues"
          ></app-number-input>

          <app-select-input
            *ngIf="el.type === 'select'"
            [element]="el"
            [disabled]="disabledSubject$ | async"
            [(richMessageValues)]="richMessageValues"
          ></app-select-input>

          <app-button-input
            *ngIf="el.type === 'button'"
            [element]="el"
            [link]="el.request.url"
            [displayType]="el.displayType"
            [messageId]="messageId"
            [disabledSubject$]="disabledSubject$"
            [validInputElementsSubject$]="validInputElementsSubject$"
            [(richMessageValues)]="richMessageValues"
            [currentUserId]="currentUserId"
            (buttonPressFired)="handleButtonPress()"
            (submissionSuccess)="handleSubmissionSuccess()"
          ></app-button-input>
          <app-alert *ngIf="el.type === 'alert'" [element]="el"></app-alert>
        </ng-container>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./rich-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichMessageComponent implements OnChanges {
  @Input() richMessage: RichMessage;
  @Input() messageId: number;
  @Input() currentUserId: string;

  // FIXME: Make private T69850
  disabledSubject$ = new Rx.BehaviorSubject<boolean>(false);
  // FIXME: Make private T69850
  validInputElementsSubject$ = new Rx.Subject<boolean>();
  richMessageValues: RichMessagePayload = {};
  submissionSuccessful: boolean;
  @ViewChildren('inputel') validatables: QueryList<RichMessageValidatable>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.richMessage !== undefined) {
      this.disabledSubject$.next(!!this.richMessage.disabled);
      this.submissionSuccessful = !!(
        this.richMessage.latestSubmissions &&
        this.richMessage.latestSubmissions[this.currentUserId] &&
        this.richMessage.latestSubmissions[this.currentUserId].status_code ===
          200
      );
    }
  }

  handleButtonPress() {
    const vs = this.validatables.map(inputel => inputel.validate());
    this.validInputElementsSubject$.next(vs.every(b => b));
  }

  handleSubmissionSuccess() {
    this.submissionSuccessful = true;
  }

  shouldDisplay(element: RichMessageElement): boolean {
    return (
      !(element.hide_on_success && this.submissionSuccessful) &&
      !(element.show_on_success && !this.submissionSuccessful)
    );
  }
}

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { methodSelectionRadioControl } from '@freelancer/payments-utils';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { isFormControl } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map, publishReplay, refCount, startWith } from 'rxjs/operators';
import { SourceTemplateBodyComponent } from './source-template-body/source-template-body.component';
import { SourceTemplateHeaderTitleComponent } from './source-template-header/source-template-header-title.component';

export enum SourceDisplayMode {
  LIST_ITEM_WITH_HEADER, // Wrap using <fl-list-item> with header and body.
  LIST_TIME_BODY_ONLY, // Wrap using  with only body.
  INLINE_BODY, // Inline body without using a <fl-list-item>.
}

@Component({
  selector: 'app-source-template',
  template: `
    <ng-container *ngIf="group.get(radioControlName) as control">
      <fl-list-item
        *ngIf="
          sourceDisplayMode === SourceDisplayMode.LIST_ITEM_WITH_HEADER &&
          isFormControl(control)
        "
        flTrackingLabel="SourceTemplateSelect"
        [ngClass]="{
          SourceTemplateBorderSelected: selected$ | async,
          SourceTemplateHeader: true
        }"
        [padding]="ListItemPadding.MID"
        [type]="ListItemType.RADIO"
        [control]="control"
        [radioValue]="sourceRadioValue"
        [selectable]="true"
        [expandable]="true"
      >
        <fl-list-item-header>
          <ng-content select="app-source-template-header"></ng-content>
        </fl-list-item-header>
        <fl-list-item-body class="SourceTemplateBody" *ngIf="bodyComponent">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </fl-list-item-body>
      </fl-list-item>
    </ng-container>

    <fl-list-item
      *ngIf="
        sourceDisplayMode === SourceDisplayMode.LIST_TIME_BODY_ONLY &&
        bodyComponent
      "
      class="SourceTemplateHeader"
      [ngClass]="{ IsHidden: !(selected$ | async) }"
      [padding]="ListItemPadding.SMALL"
      [flMarginBottomDesktop]="Margin.SMALL"
    >
      <fl-bit class="SourceTemplateBody" *ngIf="bodyComponent">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </fl-bit>
    </fl-list-item>

    <fl-bit
      *ngIf="
        sourceDisplayMode === SourceDisplayMode.INLINE_BODY && bodyComponent
      "
      class="SourceTemplateHeader"
      [ngClass]="{ IsHidden: !(selected$ | async) }"
    >
      <fl-bit class="SourceTemplateBody" *ngIf="bodyComponent">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </fl-bit>
    </fl-bit>

    <ng-template #content
      ><ng-content select="app-source-template-body"></ng-content
    ></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./source-template.component.scss'],
})
export class SourceTemplateComponent implements OnInit, AfterContentInit {
  isFormControl = isFormControl;
  Margin = Margin;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  SourceDisplayMode = SourceDisplayMode;
  radioControlName = methodSelectionRadioControl;

  @Input() group: FormGroup;
  @Input() sourceRadioValue: string;
  @Input() sourceDisplayMode: SourceDisplayMode =
    SourceDisplayMode.LIST_ITEM_WITH_HEADER;

  // we're injecting selected$ input into the child component so it doesn't have to be calculated twice
  @ContentChildren(SourceTemplateHeaderTitleComponent, { descendants: true })
  headerTitleComponents: QueryList<SourceTemplateHeaderTitleComponent>;

  @ContentChild(SourceTemplateBodyComponent)
  bodyComponent: SourceTemplateBodyComponent;

  selected$: Rx.Observable<boolean>;

  ngOnInit() {
    this.selected$ = this.group.valueChanges.pipe(
      startWith(this.group.value),
      map(
        value => value[methodSelectionRadioControl] === this.sourceRadioValue,
      ),
      publishReplay(1),
      refCount(),
    );
  }

  ngAfterContentInit() {
    this.headerTitleComponents.first.selected$ = this.selected$;
  }
}

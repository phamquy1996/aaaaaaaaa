import { Component, Input } from '@angular/core';
import {
  FontColor,
  FontType,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { ContextTypeApi } from 'api-typings/payments/payments';

@Component({
  selector: 'app-context-tag',
  template: `
    <fl-text
      [ngSwitch]="contextType"
      [fontType]="FontType.PARAGRAPH"
      [color]="FontColor.MID"
      [size]="TextSize.XXXSMALL"
      [textTransform]="TextTransform.UPPERCASE"
    >
      <ng-container *ngSwitchCase="'exam'" i18n="Context type exam">
        exam
      </ng-container>
      <ng-container
        *ngSwitchCase="'project_upgrade'"
        i18n="Context type project upgrade"
      >
        project upgrade
      </ng-container>
      <ng-container *ngSwitchCase="'milestone'" i18n="Context type milestone">
        milestone
      </ng-container>
      <ng-container
        *ngSwitchCase="'project_fee'"
        i18n="Context type project fee"
      >
        project fee
      </ng-container>
    </fl-text>
  `,
})
export class ContextTagComponent {
  FontType = FontType;
  FontColor = FontColor;
  TextSize = TextSize;
  TextTransform = TextTransform;

  @Input() contextType: ContextTypeApi;
}

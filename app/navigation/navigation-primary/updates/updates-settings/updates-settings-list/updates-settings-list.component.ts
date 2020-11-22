import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationsPreferenceEntry } from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { LinkIconPosition } from '@freelancer/ui/link';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import {
  FontType,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { isFormControl } from '@freelancer/utils';
import { NavigationUpdatesView } from '../../updates.model';

@Component({
  selector: 'app-updates-settings-list',
  template: `
    <fl-bit class="Heading" *ngIf="!hideHeading">
      <fl-button
        title="Update Settings Back"
        i18n-title="Update Settings Back Title"
        flTrackingLabel="UpdatesSettings-Back"
        [flMarginRight]="Margin.XXSMALL"
        (click)="handleBack()"
      >
        <fl-icon [name]="'ui-arrow-left-alt'" [size]="IconSize.SMALL"></fl-icon>
      </fl-button>
      <fl-text
        i18n="Updates Settings heading"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Notification Settings
      </fl-text>
    </fl-bit>
    <fl-bit class="Settings" [flShowMobile]="true">
      <fl-link
        i18n="Update Settings Back button"
        flTrackingLabel="UpdatesSettings-Back"
        [iconName]="'ui-arrow-left'"
        [iconPosition]="LinkIconPosition.LEFT"
        (click)="handleBack()"
      >
        Back
      </fl-link>
    </fl-bit>
    <fl-bit class="List" *ngIf="filters && filters.length > 0">
      <fl-text class="List-hint" i18n="Mark project categories updates hint">
        Please mark the categories of projects that you would like to receive
        notifications about.
      </fl-text>
      <ng-container *ngFor="let filter of filters">
        <ng-container *ngIf="settingsForm.get(filter.channel) as control">
          <fl-checkbox
            *ngIf="isFormControl(control)"
            class="List-content"
            flTrackingLabel="UpdateSettings-{{ filter.channel | pascalCase }}"
            [control]="control"
            [label]="filter.name"
          ></fl-checkbox>
        </ng-container>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./updates-settings-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesSettingsListComponent {
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  IconSize = IconSize;
  isFormControl = isFormControl;
  LinkIconPosition = LinkIconPosition;
  ListItemType = ListItemType;
  Margin = Margin;
  TextTransform = TextTransform;

  @Input() filters: ReadonlyArray<NotificationsPreferenceEntry>;
  @Input() settingsForm: FormGroup;
  @Input() hideHeading = false;

  @Output() clickBack = new EventEmitter<NavigationUpdatesView>();

  handleBack() {
    this.clickBack.emit(NavigationUpdatesView.LIST);
  }
}

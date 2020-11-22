import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsPreferenceEntry } from '@freelancer/datastore/collections';
import { fromPairs } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { NavigationUpdatesView } from '../updates.model';

@Component({
  selector: 'app-updates-settings',
  template: `
    <app-updates-settings-list
      [filters]="filters"
      [settingsForm]="settingsForm"
      [hideHeading]="hideHeading"
      (clickBack)="handleBack()"
    ></app-updates-settings-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatesSettingsComponent implements OnInit, OnDestroy {
  @Input() filters: ReadonlyArray<NotificationsPreferenceEntry>;
  @Input() hideHeading = false;

  @Output() clickBack = new EventEmitter<NavigationUpdatesView>();
  @Output()
  settingsUpdate = new EventEmitter<
    ReadonlyArray<NotificationsPreferenceEntry>
  >();

  formValueChangeSubscription?: Rx.Subscription;
  settingsForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.settingsForm = this.formBuilder.group(
      fromPairs(
        this.filters.map(setting => [setting.channel, setting.enabled]),
      ),
    );

    this.formValueChangeSubscription = this.settingsForm.valueChanges.subscribe(
      (values: { [channel: string]: boolean }) => {
        const changes = this.filters
          .filter(setting => setting.enabled !== values[setting.channel])
          .map((setting: NotificationsPreferenceEntry) => ({
            ...setting,
            enabled: values[setting.channel],
          }));
        if (changes.length) {
          this.settingsUpdate.emit(changes);
        }
      },
    );
  }

  ngOnDestroy() {
    if (this.formValueChangeSubscription) {
      this.formValueChangeSubscription.unsubscribe();
    }
  }

  handleBack() {
    this.clickBack.emit(NavigationUpdatesView.LIST);
  }
}

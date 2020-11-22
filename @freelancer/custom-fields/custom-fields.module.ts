import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import {
  DatastoreCustomFieldInfoConfigurationsModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { DirectivesModule } from '@freelancer/directives';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFormFieldComponent } from './custom-form-field/custom-form-field.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DatastoreCustomFieldInfoConfigurationsModule,
    DatastoreUsersModule,
    DirectivesModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [CustomFormFieldComponent],
  exports: [CustomFormFieldComponent],
  providers: [CustomFieldsService],
})
export class CustomFieldsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@freelancer/components';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { AlertComponent } from './elements/alert.component';
import { BodyComponent } from './elements/body.component';
import { ButtonInputComponent } from './elements/button-input.component';
import { CheckboxInputComponent } from './elements/checkbox-input.component';
import { HeadingComponent } from './elements/heading.component';
import { NumberInputComponent } from './elements/number-input.component';
import { RadioInputComponent } from './elements/radio-input.component';
import { SelectInputComponent } from './elements/select-input.component';
import { TextInputComponent } from './elements/text-input.component';
import { RichMessageComponent } from './rich-message.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ComponentsModule,
    TrackingModule,
    FormsModule,
  ],
  declarations: [
    RichMessageComponent,
    BodyComponent,
    CheckboxInputComponent,
    HeadingComponent,
    RadioInputComponent,
    TextInputComponent,
    NumberInputComponent,
    SelectInputComponent,
    ButtonInputComponent,
    AlertComponent,
  ],
  exports: [RichMessageComponent],
})
export class RichMessageModule {}

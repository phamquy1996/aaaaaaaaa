import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '@freelancer/directives';
import { UiModule } from '@freelancer/ui';
import { AutoCompleteRichTextComponent } from './auto-complete-rich-text/auto-complete-rich-text.component';
import {
  AutoCompleteComponent,
  AutoCompleteInputComponent,
  AutoCompleteSuggestionTemplateComponent,
} from './auto-complete.component';

@NgModule({
  imports: [CommonModule, DirectivesModule, UiModule],
  declarations: [
    AutoCompleteComponent,
    AutoCompleteInputComponent,
    AutoCompleteRichTextComponent,
    AutoCompleteSuggestionTemplateComponent,
  ],
  exports: [
    AutoCompleteComponent,
    AutoCompleteInputComponent,
    AutoCompleteSuggestionTemplateComponent,
  ],
})
export class AutoCompleteModule {}

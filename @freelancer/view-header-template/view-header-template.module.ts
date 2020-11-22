import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '@freelancer/directives';
import { UiModule } from '@freelancer/ui';
import { ViewHeaderTemplateDirective } from './view-header-template.directive';

@NgModule({
  imports: [CommonModule, UiModule, DirectivesModule],
  declarations: [ViewHeaderTemplateDirective],
  exports: [ViewHeaderTemplateDirective],
})
export class ViewHeaderTemplateModule {}

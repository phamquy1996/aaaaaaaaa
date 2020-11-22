import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoGrowDirective } from './auto-grow/auto-grow.directive';
import { HideDirective } from './hide/hide.directive';
import { RepeatDirective } from './repeat/repeat.directive';
import { TaggingDirective } from './tagging/tagging.directive';
import { VisibilityDirective } from './visibility/visibility.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AutoGrowDirective,
    HideDirective,
    RepeatDirective,
    TaggingDirective,
    VisibilityDirective,
  ],
  exports: [
    AutoGrowDirective,
    RepeatDirective,
    HideDirective,
    TaggingDirective,
    VisibilityDirective,
  ],
})
export class DirectivesModule {}

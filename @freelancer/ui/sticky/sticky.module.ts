import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StickyDirective } from './sticky.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [StickyDirective],
  exports: [StickyDirective],
})
export class StickyModule {}

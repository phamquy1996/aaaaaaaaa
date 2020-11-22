import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { LinkshimComponent } from './linkshim.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [LinkshimComponent],
  exports: [LinkshimComponent],
})
export class LinkshimModule {}

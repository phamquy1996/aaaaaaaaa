import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinkshimModule } from '@freelancer/components/linkshim';
import { LinkModule } from '@freelancer/ui/link';
import { AutoLinkDirective } from './auto-link.directive';

@NgModule({
  imports: [CommonModule, LinkshimModule, LinkModule],
  declarations: [AutoLinkDirective],
  exports: [AutoLinkDirective],
})
export class AutoLinkModule {}

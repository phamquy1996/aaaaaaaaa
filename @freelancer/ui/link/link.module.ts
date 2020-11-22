import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconModule } from '@freelancer/ui/icon';
import { LinkComponent } from './link.component';

@NgModule({
  imports: [CommonModule, RouterModule, IconModule],
  declarations: [LinkComponent],
  exports: [LinkComponent],
})
export class LinkModule {}

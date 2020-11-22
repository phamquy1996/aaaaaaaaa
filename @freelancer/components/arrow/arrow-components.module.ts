import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@freelancer/pipes';
import { UiModule } from '@freelancer/ui';
import { ArrowUpgradeItemComponent } from './arrow-upgrade-item/arrow-upgrade-item.component';

@NgModule({
  imports: [CommonModule, PipesModule, UiModule],
  declarations: [ArrowUpgradeItemComponent],
  exports: [ArrowUpgradeItemComponent],
})
export class ArrowComponentsModule {}

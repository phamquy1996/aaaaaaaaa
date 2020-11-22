import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@freelancer/components';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { OwnershipSelectComponent } from './ownership-select/ownership-select.component';
import { OwnershipUserComponent } from './ownership-user/ownership-user.component';

@NgModule({
  imports: [CommonModule, ComponentsModule, TrackingModule, UiModule],
  declarations: [OwnershipSelectComponent, OwnershipUserComponent],
  exports: [OwnershipSelectComponent, OwnershipUserComponent],
})
export class OwnershipModule {}

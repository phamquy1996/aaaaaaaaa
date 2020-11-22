import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DatastoreMembershipBenefitsModule,
  DatastoreSkillsModule,
  DatastoreUserSkillsModule,
  DatastoreUsersModule,
} from '@freelancer/datastore/collections';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SkillsCategoriesComponent } from './skills-categories/skills-categories.component';
import { SkillsCategoryComponent } from './skills-category/skills-category.component';
import { SkillsSelectedComponent } from './skills-selected/skills-selected.component';
import { SkillsComponent } from './skills.component';

@NgModule({
  imports: [
    CommonModule,
    DatastoreSkillsModule,
    DatastoreUsersModule,
    DatastoreUserSkillsModule,
    DatastoreMembershipBenefitsModule,
    PerfectScrollbarModule,
    TrackingModule,
    UiModule,
  ],
  declarations: [
    SkillsCategoriesComponent,
    SkillsCategoryComponent,
    SkillsSelectedComponent,
    SkillsComponent,
  ],
  exports: [SkillsComponent],
})
export class SkillsModule {}

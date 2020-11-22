import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoLinkModule } from '@freelancer/auto-link';
import { PipesModule } from '@freelancer/pipes';
import { UiModule } from '@freelancer/ui';
import { AutoCompleteModule } from './auto-complete/auto-complete.module';
import { ChatButtonComponent } from './chat-button/chat-button.component';
import { ChatButtonModule } from './chat-button/chat-button.module';
import { InteractiveTextComponent } from './interactive-text/interactive-text.component';
import { LinkshimModule } from './linkshim/linkshim.module';
import {
  RadioCardBodyComponent,
  RadioCardComponent,
} from './radio-card/radio-card.component';
import { SkillsModule } from './skills/skills.module';
import { UpgradeItemComponent } from './upgrade-item/upgrade-item.component';

@NgModule({
  imports: [
    AutoCompleteModule,
    AutoLinkModule,
    ChatButtonModule,
    CommonModule,
    LinkshimModule,
    PipesModule,
    SkillsModule,
    UiModule,
  ],
  declarations: [
    InteractiveTextComponent,
    RadioCardBodyComponent,
    RadioCardComponent,
    UpgradeItemComponent,
  ],
  exports: [
    AutoCompleteModule,
    ChatButtonComponent,
    InteractiveTextComponent,
    LinkshimModule,
    RadioCardBodyComponent,
    RadioCardComponent,
    SkillsModule,
    UpgradeItemComponent,
  ],
})
export class ComponentsModule {}

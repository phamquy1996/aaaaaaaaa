import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { CreateCollectionFormComponent } from './create-collection-form.component';
import { CreateCollectionModalComponent } from './create-collection-modal.component';

@NgModule({
  declarations: [CreateCollectionModalComponent, CreateCollectionFormComponent],
  imports: [CommonModule, UiModule],
  exports: [CreateCollectionFormComponent],
  entryComponents: [CreateCollectionModalComponent],
})
export class CreateCollectionModalModule {}

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '../ui.module';
import { ModalActionsComponent } from './modal-actions.component';
import { ModalContentComponent } from './modal-content.component';
import { ModalErrorComponent } from './modal-error.component';
import { ModalTitleComponent } from './modal-title.component';
import { ModalComponent } from './modal.component';
import { MODAL_SERVICE_PROVIDER } from './modal.service';

@NgModule({
  imports: [CommonModule, UiModule, RouterModule, ScrollingModule],
  declarations: [
    ModalComponent,
    ModalErrorComponent,
    ModalTitleComponent,
    ModalContentComponent,
    ModalActionsComponent,
  ],
  exports: [
    ModalComponent,
    ModalTitleComponent,
    ModalContentComponent,
    ModalActionsComponent,
  ],
  providers: [MODAL_SERVICE_PROVIDER],
})
export class ModalModule {}

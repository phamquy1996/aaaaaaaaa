import { NgModule } from '@angular/core';
import { ROUTES } from '@angular/router';
import { appModals } from './app-modal-routes';

@NgModule({
  providers: [
    // Modals have nothing to do with routes, but this is a hack to make the
    // CLI code splitting and ngc lazy module analysis and compilation work,
    // pending proper fix in https://github.com/angular/angular-cli/issues/4541
    { provide: ROUTES, useValue: appModals, multi: true },
  ],
})
export class AppModalsModule {}

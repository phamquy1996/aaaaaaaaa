import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterModule } from 'app/footer/footer.module';
import { NavigationModule } from 'app/navigation/navigation.module';
import { ToastAlertsModule } from 'app/toast-alerts/toast-alerts.module';
import { LoggedOutShellComponent } from './logged-out-shell.component';

const routes: Routes = [
  {
    path: '',
    component: LoggedOutShellComponent,
    loadChildren: () =>
      import('app/app-routing.module').then(m => m.AppRoutingModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NavigationModule,
    FooterModule,
    ToastAlertsModule,
  ],
  declarations: [LoggedOutShellComponent],
  exports: [RouterModule],
})
export class LoggedOutRoutingModule {}

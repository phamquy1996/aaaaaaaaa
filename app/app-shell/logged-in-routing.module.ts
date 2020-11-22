import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectivesModule } from '@freelancer/directives';
import { FooterModule } from 'app/footer/footer.module';
import { MaintenanceBannerModule } from 'app/maintenance-banner/maintenance-banner.module';
import { MessagingModule } from 'app/messaging/messaging.module';
import { NavigationModule } from 'app/navigation/navigation.module';
import { NotificationsBannerModule } from 'app/notifications-banner/notifications-banner.module';
import { ToastAlertsModule } from 'app/toast-alerts/toast-alerts.module';
import { ToastNotificationsModule } from 'app/toast-notifications/toast-notifications.module';
import { VerificationBannerModule } from 'app/verification-banner/verification-banner.module';
import { LoggedInShellComponent } from './logged-in-shell.component';

const routes: Routes = [
  {
    path: '',
    component: LoggedInShellComponent,
    loadChildren: () =>
      import('app/app-routing.module').then(m => m.AppRoutingModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    DirectivesModule,
    NavigationModule,
    MaintenanceBannerModule,
    VerificationBannerModule,
    ToastNotificationsModule,
    ToastAlertsModule,
    MessagingModule,
    NotificationsBannerModule,
    FooterModule,
  ],
  declarations: [LoggedInShellComponent],
  exports: [RouterModule],
})
export class LoggedInRoutingModule {}

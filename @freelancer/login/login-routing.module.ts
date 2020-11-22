import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundGuard } from '@freelancer/404';
import { AuthCallbackGuard } from './auth-callback-guard.service';
import { DummyComponent } from './dummy.component';
import { LoginGuard } from './login-guard.service';
import { LogoutGuard } from './logout-guard.service';

const routes: Routes = [
  {
    path: 'login',
    children: [
      {
        path: '',
        data: {
          bypassLoggedOutRestricted: {
            deloitte: true,
            native: true,
          },
        },
        canActivate: [LoginGuard],
        component: DummyComponent,
      },
      {
        path: '**',
        canActivate: [NotFoundGuard],
        component: DummyComponent,
      },
    ],
  },
  {
    path: 'logout',
    children: [
      {
        path: '',
        data: {
          bypassLoggedOutRestricted: {
            deloitte: true,
            native: true,
          },
          isLogoutPage: true,
        },
        canActivate: [LogoutGuard],
        component: DummyComponent,
      },
      {
        path: '**',
        canActivate: [NotFoundGuard],
        component: DummyComponent,
      },
    ],
  },
  {
    path: 'internal/auth/callback',
    data: {
      bypassLoggedOutRestricted: {
        deloitte: true,
        native: true,
      },
    },
    canActivate: [AuthCallbackGuard],
    component: DummyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotFoundRouteConfig } from '@freelancer/404';
import { PreloadRouteConfig } from '@freelancer/preload-route';
import { RedirectToPhpGuard } from '@freelancer/redirect-to-php';
import { ContainerSize } from '@freelancer/ui/container';
import { AppEmptyComponent } from './app-empty.component';
import { AppEmptyModule } from './app-empty.module';
import { LoggedInShellConfig } from './app-shell/logged-in-shell.component';
import { OptionalRedirectToThemeGuard } from './optional-redirect-to-theme-guard.service';
import { RedirectToDashboardGuard } from './redirect-to-dashboard-guard.service';
import { RedirectToThemeGuard } from './redirect-to-theme-guard.service';

// WARNING: Non lazy-loaded components are stricly forbidden here: you MUST use
// loadChildren if you want to add a new top-level route.
// tslint:disable-next-line:readonly-array
const routes: (Route & {
  data?: LoggedInShellConfig | PreloadRouteConfig | NotFoundRouteConfig;
})[] = [
  {
    path: '',
    canActivate: [RedirectToDashboardGuard],
    loadChildren: () =>
      import('app/home/home-page.module').then(m => m.HomePageModule),
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [RedirectToThemeGuard],
    data: {
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
      bypassLoggedOutRestricted: {
        deloitte: true,
        native: true,
      },
    },
    loadChildren: () =>
      import('app/login-signup/login-page/login-page.module').then(
        m => m.LoginPageModule,
      ),
  },
  {
    path: 'signup',
    canActivate: [RedirectToThemeGuard],
    data: {
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
      bypassLoggedOutRestricted: {
        deloitte: true,
        native: true,
      },
    },
    loadChildren: () =>
      import('app/login-signup/signup-page/signup-page.module').then(
        m => m.SignupPageModule,
      ),
  },
  // the `login` route defined above will override the one inside `@freelancer/login`.
  {
    path: '',
    data: {
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import('@freelancer/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'messages',
    data: {
      disableFooter: true,
      disableMessaging: true,
      fixedHeight: true,
    },
    loadChildren: () =>
      import('app/messaging/messaging-inbox/messaging-inbox.module').then(
        m => m.MessagingInboxModule,
      ),
  },
  {
    path: 'dashboard',
    data: {
      isMobilePrimaryView: true,
      enableMobileVerificationBanner: true,
    },
    loadChildren: () =>
      import('app/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'projects',
    data: {
      preloadModule: 'app/projects/project-view/project-view.module',
    },
    loadChildren: () =>
      import('app/projects/project-view/project-view.module').then(
        m => m.ProjectViewModule,
      ),
  },
  {
    path: 'contest',
    loadChildren: () =>
      import('app/contests/contests.module').then(m => m.ContestsModule),
  },
  {
    path: 'post-project',
    data: {
      disableFooter: true,
      adminOnlyMessaging: true,
      disableNavigation: true,
      disableNavigationChild: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
      isMobilePrimaryView: true,
    },
    loadChildren: () =>
      import('app/jobs/job-post/job-post.module').then(m => m.JobPostModule),
  },
  {
    path: 'freightlancer',
    loadChildren: () =>
      import('app/freightlancer/freightlancer.module').then(
        m => m.FreightlancerModule,
      ),
  },
  {
    path: 'branded-communities/post-project',
    data: {
      disableFooter: true,
      adminOnlyMessaging: true,
      disableNavigation: true,
      disableNavigationChild: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
      isMobilePrimaryView: true,
    },
    loadChildren: () =>
      import(
        'app/jobs/job-post/branded-communities/branded-communities-job-post.module'
      ).then(m => m.BrandedCommunitiesJobPostModule),
  },
  {
    path: 'arrow',
    loadChildren: () =>
      import('app/arrow/arrow.module').then(m => m.ArrowModule),
  },
  {
    path: 'pmi',
    data: {
      disableNavigation: true,
    },
    loadChildren: () => import('app/pmi/pmi.module').then(m => m.PmiModule),
  },
  {
    path: 'yara',
    data: {
      disableNavigation: true,
      disableVerificationBanner: true,
      disableMessaging: true,
    },
    loadChildren: () => import('app/yara/yara.module').then(m => m.YaraModule),
  },
  {
    path: 'partner-dashboard',
    data: {
      disableFooter: true,
      adminOnlyMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import('app/partner-dashboard/partner-dashboard.module').then(
        m => m.PartnerDashboardModule,
      ),
  },
  {
    path: 'deloitte',
    data: {
      disableNavigation: true,
    },
    loadChildren: () =>
      import('app/deloitte/deloitte.module').then(m => m.DeloitteModule),
  },
  {
    path: 'enterprise',
    loadChildren: () =>
      import('app/enterprise/enterprise.module').then(m => m.EnterpriseModule),
  },
  {
    path: 'globalfleet',
    loadChildren: () =>
      import('app/globalfleet/globalfleet.module').then(
        m => m.GlobalFleetModule,
      ),
  },
  {
    path: 'users/kyc',
    loadChildren: () => import('app/kyc/kyc.module').then(m => m.KYCModule),
  },
  {
    path: 'deposit',
    data: {
      disableChildNavigationActions: true,
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import(
        'app/payments/payments-deposit/payments-page/payments-page.module'
      ).then(m => m.PaymentsPageModule),
  },
  {
    path: 'cart',
    data: {
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import(
        'app/payments/cart/cart-process-page/cart-process-page.module'
      ).then(m => m.CartProcessPageModule),
  },
  {
    path: 'verify',
    data: {
      disableChildNavigationActions: true,
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import(
        'app/payments/payment-verify/payment-verify-page/payment-verify-page.module'
      ).then(m => m.PaymentVerifyPageModule),
  },
  {
    path: 'webapp-playground',
    loadChildren: () =>
      import('app/webapp-playground/webapp-playground.module').then(
        m => m.WebappPlaygroundModule,
      ),
  },
  {
    path: 'tutorial',
    loadChildren: () =>
      import('app/tutorial/tutorial.module').then(m => m.TutorialModule),
  },
  {
    path: 'verified',
    loadChildren: () =>
      import(
        'app/freelancer-verified/freelancer-verified-landing/freelancer-verified-landing.module'
      ).then(m => m.FreelancerVerifiedLandingModule),
  },
  {
    path: 'give',
    loadChildren: () =>
      import('app/referrals/give/give.module').then(m => m.GiveModule),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('app/tasks/tasks.module').then(m => m.TasksModule),
  },
  {
    path: 'academy',
    loadChildren: () =>
      import('app/academy/academy.module').then(m => m.AcademyModule),
  },
  {
    path: 'user/settings',
    data: {
      adminOnlyMessaging: true,
    },
    loadChildren: () =>
      import('app/user-settings/user-settings.module').then(
        m => m.UserSettingsModule,
      ),
  },
  {
    path: 'me',
    loadChildren: () =>
      import('app/user-me/user-me.module').then(m => m.UserMeModule),
  },
  {
    path: 'u/:username',
    loadChildren: () =>
      import('app/user-profile/user-profile.module').then(
        m => m.UserProfileModule,
      ),
  },
  {
    path: 'ideas/:username',
    data: {
      containerSize: ContainerSize.DESKTOP_XLARGE,
    },
    loadChildren: () =>
      import('app/discover-collections/collections.module').then(
        m => m.CollectionsModule,
      ),
  },
  {
    path: 'navigation',
    data: {
      disableFooter: true,
      disableMessaging: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import(
        'app/navigation/navigation-primary/navigation-pages/navigation-pages.module'
      ).then(m => m.NavigationPagesModule),
  },
  {
    path: 'discover',
    data: {
      containerSize: ContainerSize.DESKTOP_LARGE,
    },
    loadChildren: () =>
      import('app/discover/discover.module').then(m => m.DiscoverModule),
  },
  {
    path: 'payments/transactions',
    loadChildren: () =>
      import('app/transaction-history/transaction-history.module').then(
        m => m.TransactionHistoryModule,
      ),
  },
  {
    path: 'portfolio-items',
    data: {
      containerSize: ContainerSize.DESKTOP_LARGE,
    },
    loadChildren: () =>
      import('app/portfolio-item-page/portfolio-item-page.module').then(
        m => m.PortfolioItemPageModule,
      ),
  },
  {
    path: 'email-verify',
    loadChildren: () =>
      import('app/email-verify/email-verify.module').then(
        m => m.EmailVerifyModule,
      ),
  },
  {
    path: 'search',
    canActivate: [OptionalRedirectToThemeGuard],
    data: {
      isMobilePrimaryView: true,
      optionalRedirectToTheme: ['freightlancer'],
    },
    loadChildren: () =>
      import('app/search/search.module').then(m => m.SearchModule),
  },
  {
    path: 'googlecloud',
    loadChildren: () =>
      import(
        'app/branded-communities/google-landing/google-landing.module'
      ).then(m => m.GoogleLandingModule),
  },
  {
    path: 'facebook',
    data: {
      disablePostProjectButton: true,
    },
    loadChildren: () =>
      import(
        'app/branded-communities/facebook-landing/facebook-landing.module'
      ).then(m => m.FacebookLandingModule),
  },
  {
    path: 'groups',
    loadChildren: () =>
      import('app/groups/groups-routing.module').then(
        m => m.GroupsRoutingModule,
      ),
  },
  {
    path: 'internal',
    loadChildren: () =>
      import('app/internal/internal.module').then(m => m.InternalModule),
  },
  {
    path: 'manage',
    data: {
      isMobilePrimaryView: true,
    },
    loadChildren: () =>
      import('app/manage/manage.module').then(m => m.ManageModule),
  },
  {
    path: 'find',
    data: {
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import('app/find/find-page.module').then(m => m.FindPageModule),
  },
  {
    path: 'hire',
    data: {
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import('app/hire/hire-page.module').then(m => m.HirePageModule),
  },
  {
    path: 'notifications',
    redirectTo: '/navigation/updates',
  },
  {
    path: 'my-projects',
    redirectTo: '/manage',
  },
  {
    path: 'skill-select',
    redirectTo: '/sellers/skill-select.php',
  },
  {
    path: 'verify-phone',
    redirectTo: '/users/phoneverify.php',
  },
  {
    path: 'new-freelancer',
    data: {
      disableFooter: true,
      adminOnlyMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import('app/freelancer-onboarding/freelancer-onboarding.module').then(
        m => m.FreelancerOnboardingModule,
      ),
  },
  {
    path: 'membership',
    loadChildren: () =>
      import('app/membership/membership.module').then(m => m.MembershipModule),
  },
  {
    path: 'support-feedback',
    loadChildren: () =>
      import('app/support-feedback/support-feedback.module').then(
        m => m.SupportFeedbackModule,
      ),
  },
  // To bypass logged out redirect for SSO route
  {
    path: 'saml_sso/sso.php',
    data: {
      bypassLoggedOutRestricted: {
        deloitte: true,
        native: true,
      },
    },
    canActivate: [RedirectToPhpGuard],
    component: AppEmptyComponent,
  },
  {
    path: 'users/usersuspended.php',
    data: {
      bypassLoggedOutRestricted: {
        deloitte: true,
        native: true,
      },
    },
    canActivate: [RedirectToPhpGuard],
    component: AppEmptyComponent,
  },
  {
    path: 'support',
    children: [
      {
        path: '**',
        data: {
          bypassLoggedOutRestricted: {
            native: true,
          },
        },
        canActivate: [RedirectToPhpGuard],
        component: AppEmptyComponent,
      },
    ],
  },
  {
    path: 'on-behalf-project',
    loadChildren: () =>
      import('app/projects/on-behalf-project/on-behalf-project.module').then(
        m => m.OnBehalfProjectModule,
      ),
  },
  // To bypass logged out redirect for T&Cs
  {
    path: 'about/terms',
    data: {
      bypassLoggedOutRestricted: {
        native: true,
      },
    },
    canActivate: [RedirectToPhpGuard],
  },
  // To bypass logged out redirect for privacy policy
  {
    path: 'about/privacy',
    data: {
      bypassLoggedOutRestricted: {
        native: true,
      },
    },
    canActivate: [RedirectToPhpGuard],
  },
  {
    path: 'user/account-reactivation',
    data: {
      disableFooter: true,
      disableMessaging: true,
      disableNavigation: true,
      disableToastNotifications: true,
      disableVerificationBanner: true,
    },
    loadChildren: () =>
      import(
        'app/user-account-reactivation/user-account-reactivation.module'
      ).then(m => m.UserAccountReactivationModule),
  },
  // Catch-all route
  // TODO: instrument that so we can know which non-webapp pages are the most
  // visited, i.e. to prioritize future migrations.
  {
    path: '**',
    canActivate: [RedirectToPhpGuard],
    component: AppEmptyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AppEmptyModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}

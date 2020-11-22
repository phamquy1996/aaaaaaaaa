import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageGuard } from './home-page-guard.service';
import { HomePageMetaWrapperComponent } from './home-page-meta-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageMetaWrapperComponent,
    canActivate: [HomePageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

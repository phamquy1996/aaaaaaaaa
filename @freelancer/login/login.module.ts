import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DummyComponent } from './dummy.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [CommonModule, LoginRoutingModule, RouterModule],
  declarations: [DummyComponent],
})
export class LoginModule {}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CookieModule } from '@laurentgoudet/ngx-cookie';
import { THREATMETRIX_CONFIG } from './threatmetrix.config';
import { ThreatmetrixConfig } from './threatmetrix.interface';
import { ThreatmetrixService } from './threatmetrix.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, CookieModule.forChild()],
  providers: [ThreatmetrixService],
})
export class ThreatmetrixModule {
  static initialize(
    config?: ThreatmetrixConfig,
  ): ModuleWithProviders<ThreatmetrixModule> {
    return {
      ngModule: ThreatmetrixModule,
      providers: [{ provide: THREATMETRIX_CONFIG, useValue: config }],
    };
  }
}

import { NgModule } from '@angular/core';
import { BypassSecurityTrustResourceUrlPipe } from './bypass-security-trust-resource-url/bypass-security-trust-resource-url.pipe';
import { FreelancerCurrencyPipe } from './currency/currency.pipe';
import { DateRangePipe } from './date-range/date-range.pipe';
import { DurationPipe } from './duration/duration.pipe';
import { FileSizePipe } from './file-size/file-size.pipe';
import { IsOnlinePipe } from './is-online/is-online.pipe';
import { PascalCasePipe } from './pascal-case/pascal-case.pipe';
import { SanitisePipe } from './sanitise/sanitise.pipe';
import { StripUrlPipe } from './strip-url/strip-url.pipe';
import { TruncateFilenamePipe } from './truncate-filename/truncate-filename.pipe';

@NgModule({
  declarations: [
    BypassSecurityTrustResourceUrlPipe,
    FileSizePipe,
    FreelancerCurrencyPipe,
    DateRangePipe,
    DurationPipe,
    IsOnlinePipe,
    PascalCasePipe,
    SanitisePipe,
    TruncateFilenamePipe,
    StripUrlPipe,
  ],
  exports: [
    BypassSecurityTrustResourceUrlPipe,
    FileSizePipe,
    FreelancerCurrencyPipe,
    DateRangePipe,
    DurationPipe,
    IsOnlinePipe,
    PascalCasePipe,
    SanitisePipe,
    TruncateFilenamePipe,
    StripUrlPipe,
  ],
  providers: [
    BypassSecurityTrustResourceUrlPipe,
    FileSizePipe,
    FreelancerCurrencyPipe,
    DurationPipe,
    IsOnlinePipe,
    PascalCasePipe,
    SanitisePipe,
    TruncateFilenamePipe,
    StripUrlPipe,
  ],
})
export class PipesModule {}

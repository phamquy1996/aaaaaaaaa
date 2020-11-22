import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FileUploadLegacy } from './file-upload-legacy.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [FileUploadLegacy],
})
export class FileUploadLegacyModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@freelancer/ui';
import { FileDownloadComponent } from './file-download/file-download.component';
import { FilePreviewComponent } from './file-preview/file-preview.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [FilePreviewComponent, FileDownloadComponent],
  exports: [FilePreviewComponent, FileDownloadComponent],
})
export class FileStorageModule {}

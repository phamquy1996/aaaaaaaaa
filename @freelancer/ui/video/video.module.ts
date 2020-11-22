import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VgBufferingModule,
  VgControlsModule,
  VgCoreModule,
  VgOverlayPlayModule,
} from 'ngx-videogular';
import { VideoComponent } from './video.component';

@NgModule({
  declarations: [VideoComponent],
  exports: [VideoComponent],
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
})
export class VideoModule {}

import { Component, ViewChild } from '@angular/core';
import { VideoComponent } from '@freelancer/ui/video';
@Component({
  template: `
    <ng-container *flModalTitle i18n="Global Fleet Video modal title">
      Global Fleet Case Study Video
    </ng-container>
    <div class="MainBody">
      <fl-video
        [autoPlay]="true"
        [src]="
          'https://player.vimeo.com/external/445457190.hd.mp4?s=43e449d6487b0ce89982259379a5cf75dacc55b3&profile_id=175'
        "
        (canPlayThrough)="videoLoaded()"
        #video
      >
      </fl-video>
    </div>
  `,
  styleUrls: ['./globalfleet-modal.component.scss'],
})
export class GlobalfleetModalComponent {
  VideoComponent = VideoComponent;

  @ViewChild('video') video: VideoComponent;

  videoLoaded() {
    this.video.play();
  }
}

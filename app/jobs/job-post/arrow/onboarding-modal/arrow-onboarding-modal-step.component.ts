import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontType, TextSize } from '@freelancer/ui/text';
import { VideoComponent } from '@freelancer/ui/video';

@Component({
  selector: 'app-arrow-onboarding-modal-step',
  template: `
    <fl-video
      #video
      [isExternal]="false"
      [src]="videoUrl"
      [disableControls]="true"
      [flMarginBottom]="Margin.XLARGE"
      (canPlay)="videoCanPlay.emit($event)"
    ></fl-video>
    <fl-bit class="StepBody">
      <fl-heading
        i18n="Employer onboarding modal step title"
        [size]="TextSize.XLARGE"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.MID"
      >
        {{ heading }}
      </fl-heading>
      <fl-text
        i18n="Employer onboarding modal step description"
        class="StepDescription"
        [fontType]="FontType.PARAGRAPH"
        [size]="TextSize.SMALL"
      >
        {{ description }}
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./arrow-onboarding-modal-step.component.scss'],
})
export class ArrowOnboardingModalStepComponent {
  FontType = FontType;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;

  @Input() videoUrl: string;
  @Input() heading: string;
  @Input() description: string;
  @Output() videoCanPlay = new EventEmitter<Event>();

  @ViewChild('video') video: VideoComponent;

  playVideo() {
    this.video.play();
  }
}

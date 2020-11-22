import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  MediaDeviceResultStatus,
  MediaDevices,
  MediaDeviceStreamResult,
} from '@freelancer/media-devices';

type dataURI = string;

@Component({
  selector: 'fl-camera',
  template: `
    <video #video class="Video" autoplay muted playsinline></video>
    <canvas #canvas class="Snapshot"></canvas>
  `,
  styleUrls: ['./camera.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraComponent implements OnDestroy {
  @ViewChild('video', { read: ElementRef }) video: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { read: ElementRef }) canvas: ElementRef<
    HTMLCanvasElement
  >;

  @Input() cameraControls = false;

  @Input() imageType = 'image/png';

  @Input() videoConstraints: MediaTrackConstraints = {};

  @Input()
  set videoDevices(devices: MediaDeviceInfo[]) {
    this.activeDeviceIndex = -1;
    this.devices = devices;
  }

  private activeDeviceIndex: number;
  private activeMediaStream: MediaStream;
  private devices: MediaDeviceInfo[];

  constructor(private mediaDevices: MediaDevices) {}

  ngOnDestroy() {
    this.stopActiveMediaStream();
  }

  cycleDevice(): Promise<MediaDeviceStreamResult> {
    this.activeDeviceIndex += 1;
    return this.switchToDeviceByIndex(this.activeDeviceIndex);
  }

  getSnapshot(): dataURI | undefined {
    const videoElement = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const canvas2d = canvas.getContext('2d');

    if (!canvas2d) {
      return undefined;
    }

    canvas.height = videoElement.videoHeight;
    canvas.width = videoElement.videoWidth;
    canvas2d.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight,
    );

    return canvas.toDataURL(this.imageType, 1);
  }

  switchToDeviceByIndex(deviceIndex: number): Promise<MediaDeviceStreamResult> {
    const deviceCount = this.devices.length;
    const correctIndex = deviceIndex % deviceCount;
    const deviceToLoad = this.devices[correctIndex];
    const videoConstraints = {
      video: {
        ...this.videoConstraints,
        deviceId: deviceToLoad.deviceId,
      },
    };

    this.stopActiveMediaStream();

    return this.mediaDevices.getUserMedia(videoConstraints).then(result => {
      if (result.status === MediaDeviceResultStatus.SUCCESS) {
        this.setActiveStream(result.stream);
      }

      return result;
    });
  }

  private setActiveStream(stream: MediaStream) {
    this.activeMediaStream = stream;
    this.video.nativeElement.srcObject = stream;
  }

  private stopActiveMediaStream() {
    if (this.activeMediaStream) {
      this.mediaDevices.stopMediaStream(this.activeMediaStream);
    }
  }
}

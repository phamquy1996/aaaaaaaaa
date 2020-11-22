import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { mapTo } from 'rxjs/operators';

export const enum CallType {
  AUDIO = 'Audio',
  VIDEO = 'Video',
  NONE = 'NoCall',
}

@Injectable({
  providedIn: 'root',
})
export class Videochat {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private freelancerHttp: FreelancerHttp,
  ) {}

  notifyAction(action: 'accept' | 'reject', threadId: number): Promise<void> {
    return this.freelancerHttp
      .put(`messages/0.1/videochat/${threadId}?action=${action}`, undefined)
      .pipe(mapTo(undefined))
      .toPromise();
  }

  openCallWindow(action: CallType, threadId: number, accepting: boolean) {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'Cannot open videochat on page rendering. Please check code logic.',
      );
    }

    if (action === 'NoCall') {
      return;
    }

    const height = 575;
    const width = action === 'Video' ? 880 : 400;
    const url = {
      base: '/users/messages/videochat.php',
      audioOnly: `audioOnly=${action === 'Audio'}`,
      threadId: `threadId=${threadId}`,
      accepting: `accepting=${accepting}`,
    };

    window.open(
      `${url.base}?${url.audioOnly}&${url.threadId}&${url.accepting}`,
      'Freelancer Videochat',
      `width=${width},height=${height}`,
    );
  }
}

import { Injectable } from '@angular/core';
import { CalloutComponent } from './callout.component';

@Injectable({ providedIn: 'root' })
export class CalloutService {
  private activeHoverCallout: CalloutComponent;

  activateHover(callout: CalloutComponent) {
    if (this.activeHoverCallout) {
      this.activeHoverCallout.close();
    }

    this.activeHoverCallout = callout;
  }
}

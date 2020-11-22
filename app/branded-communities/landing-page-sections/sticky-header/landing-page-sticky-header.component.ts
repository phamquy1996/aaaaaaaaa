import { Component } from '@angular/core';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-landing-page-sticky-header',
  template: `
    <fl-bit
      class="StickyHeader"
      [flSticky]="true"
      (activated)="handleStickyActivation($event)"
    >
      <fl-container class="StickyHeader-container" [size]="headerSize">
        <fl-bit class="StickyHeader-content">
          <fl-bit class="StickyHeader-logos">
            <fl-picture
              *ngIf="stickyHeader"
              alt="Freelancer Icon On Landing Page Sticky Header"
              class="StickyHeader-freelancerIcon"
              i18n-alt="Sticky Header Freelancer Icon On Landing Page"
              [src]="'branded-communities/google-landing/freelancer-icon.svg'"
              [flHideMobile]="true"
            ></fl-picture>
          </fl-bit>
          <ng-content select="[tabs]"></ng-content>
        </fl-bit>
        <ng-content select="[button]"></ng-content>
      </fl-container>
    </fl-bit>
  `,
  styleUrls: ['./landing-page-sticky-header.component.scss'],
})
export class LandingPageStickyHeaderComponent {
  stickyHeader = false;
  headerSize = ContainerSize.DESKTOP_LARGE;

  handleStickyActivation(activated: boolean) {
    this.stickyHeader = activated;
  }
}

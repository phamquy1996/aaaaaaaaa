import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewProject } from '@freelancer/datastore/collections';
import { Assets } from '@freelancer/ui/assets';
import { HeadingType } from '@freelancer/ui/heading';
import { MapMarker } from '@freelancer/ui/map';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  template: `
    <fl-card *ngIf="project$ | async as project">
      <fl-card-header-title i18n="Deloitte Project Title">
        {{ project.title }}
      </fl-card-header-title>
      <fl-bit class="ProjectDisplayLocation" [flMarginBottom]="Margin.XXSMALL">
        <fl-text
          i18n="Deloitte Project Location label"
          [weight]="FontWeight.BOLD"
          [size]="TextSize.SMALL"
        >
          Project Location:&nbsp;
        </fl-text>
        <fl-text>
          {{ project.displayLocation }}
        </fl-text>
      </fl-bit>
      <fl-map [interactive]="true" [markers]="mapMarkers$ | async"></fl-map>
    </fl-card>
  `,
  styleUrls: ['./deloitte-additional-info-location-modal.component.scss'],
})
export class DeloitteAdditionalInfoLocationModalComponent implements OnInit {
  Margin = Margin;
  HeadingType = HeadingType;
  TextSize = TextSize;
  FontWeight = FontWeight;

  @Input() project$: Rx.Observable<ProjectViewProject>;

  mapMarkers$: Rx.Observable<ReadonlyArray<MapMarker>>;

  constructor(private assets: Assets) {}

  ngOnInit() {
    this.mapMarkers$ = this.project$.pipe(
      map(project => this.getLocationMarkersFromProject(project)),
    );
  }

  getLocationMarkersFromProject(
    project: ProjectViewProject,
  ): ReadonlyArray<MapMarker> {
    const markers = [];
    if (project.location?.mapCoordinates) {
      markers.push({
        location: project.location.mapCoordinates,
        icon: {
          url: this.assets.getUrl('project-view-page/map/default-marker.svg'),
        },
      });
    }
    return markers;
  }
}

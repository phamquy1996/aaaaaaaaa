import { Component } from '@angular/core';

@Component({
  selector: 'app-source-template-header',
  template: `
    <ng-content source="app-source-template-header-title"></ng-content>
    <ng-content></ng-content>
  `,
  styleUrls: ['./source-template-header.component.scss'],
})
export class SourceTemplateHeaderComponent {}

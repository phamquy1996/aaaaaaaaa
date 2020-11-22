import { Component, OnInit } from '@angular/core';
import { Hotjar } from './hotjar.service';

@Component({
  selector: `fl-tracking-hotjar`,
  template: `
    <ng-container></ng-container>
  `,
})
export class HotjarComponent implements OnInit {
  constructor(private hotjar: Hotjar) {}

  ngOnInit() {
    this.hotjar.insertScript();
  }
}

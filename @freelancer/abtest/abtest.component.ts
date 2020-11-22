import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Location } from '@freelancer/location';
import { ABTest } from './abtest.service';

@Component({
  selector: 'fl-abtest',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ABTestComponent implements OnInit {
  constructor(private abtest: ABTest, private location: Location) {}

  ngOnInit() {
    const overridesParam = new URL(this.location.href).searchParams.get(
      'overrides',
    );

    if (overridesParam) {
      const overridesMap = this.abtest.parseOverridesParam(overridesParam);
      this.abtest.setOverridesMap(overridesMap);
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { RichMessageBody } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-body',
  template: `
    <fl-bit>
      {{ element.text }}
    </fl-bit>
  `,
  styleUrls: ['./body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit {
  @Input() element: RichMessageBody;

  @HostBinding('class.IsBold') isBold: boolean;
  @HostBinding('class.IsItalic') isItalic: boolean;
  @HostBinding('class.IsSmall') isSmall: boolean;

  ngOnInit() {
    if (this.element.style) {
      this.isBold = this.element.style.includes('bold');
      this.isItalic = this.element.style.includes('italic');
      this.isSmall = this.element.style.includes('small');
    }
  }
}

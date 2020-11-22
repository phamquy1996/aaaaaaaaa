import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { trackByValue } from '@freelancer/ui/helpers';
import * as escapeStringRegexp from 'escape-string-regexp';

interface TextSection {
  text: string;
  highlighted: boolean;
}

// TODO: add appropriate highlights for text on mid/dark backgrounds, if ever necessary.
export enum HighlightBackground {
  LIGHT = 'light',
  INHERIT = 'inherit',
}

@Component({
  selector: 'fl-highlight-text',
  template: `
    <span
      *ngFor="let section of textSections; trackBy: trackBySectionValue"
      [ngClass]="{ Highlighted: !!section.highlighted }"
      [attr.data-background]="backgroundColor"
      >{{ section.text }}</span
    >
  `,
  styleUrls: ['./highlight-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightTextComponent implements OnChanges {
  trackByValue = trackByValue;

  @Input() text: string;
  @Input() highlight: string;
  @Input() backgroundColor = HighlightBackground.LIGHT;

  textSections: TextSection[];

  ngOnChanges() {
    if (!this.text || !this.highlight || this.highlight.trim() === '') {
      this.textSections = [{ text: this.text, highlighted: false }];
      return;
    }

    this.textSections = this.text
      .split(new RegExp(`(${escapeStringRegexp(this.highlight)})`, 'i'))
      .map((extract: string) => {
        if (extract.toLowerCase() === this.highlight.toLowerCase()) {
          return { text: extract, highlighted: true };
        }
        return { text: extract, highlighted: false };
      });
  }

  trackBySectionValue(_: number, section: TextSection): string | number {
    return section.text;
  }
}

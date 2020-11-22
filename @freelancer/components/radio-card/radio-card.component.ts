import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardLevel } from '@freelancer/ui/card';

@Component({
  selector: 'fl-radio-card-body',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioCardBodyComponent {}

@Component({
  selector: 'fl-radio-card',
  template: `
    <fl-card
      class="RadioCard"
      [edgeToEdge]="true"
      [level]="CardLevel.SECONDARY"
      [ngClass]="{ IsSelected: isSelected }"
      (click)="handleCardClicked(value)"
    >
      <fl-grid>
        <fl-col class="RadioCardPicture" [col]="3">
          <fl-picture
            [fullWidth]="true"
            [src]="pictureSrc"
            [alt]="pictureAlt"
          ></fl-picture>
        </fl-col>
        <fl-col [col]="9">
          <ng-content select="fl-radio-card-body"></ng-content>
        </fl-col>
      </fl-grid>
    </fl-card>
  `,
  styleUrls: ['./radio-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioCardComponent {
  CardLevel = CardLevel;

  @Input() pictureSrc: string;
  @Input() pictureAlt: string;
  @Input() control: FormControl;
  @Input() isSelected: boolean;
  @Input() value: string;

  handleCardClicked(value: string) {
    this.control.setValue(value);
  }
}

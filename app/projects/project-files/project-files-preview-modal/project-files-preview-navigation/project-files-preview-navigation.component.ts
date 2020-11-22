import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HoverColor, IconColor } from '@freelancer/ui/icon';

@Component({
  selector: 'app-project-files-preview-navigation',
  template: `
    <fl-icon
      flTrackingLabel="PreviousFileButton"
      [ngClass]="{ IsHidden: initial == 0 }"
      [name]="'ui-arrow-left-alt'"
      [color]="IconColor.DARK"
      [hoverColor]="HoverColor.PRIMARY"
      (click)="previousFile()"
    ></fl-icon>
    {{ initial + 1 }} / {{ count }}
    <fl-icon
      flTrackingLabel="NextFileButton"
      [ngClass]="{ IsHidden: initial + 1 == count }"
      [name]="'ui-arrow-right-alt'"
      [color]="IconColor.DARK"
      [hoverColor]="HoverColor.PRIMARY"
      (click)="nextFile()"
    ></fl-icon>
  `,
  styleUrls: ['./project-files-preview-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilesPreviewNavigationComponent {
  IconColor = IconColor;
  HoverColor = HoverColor;

  @Input() initial: number;
  @Input() count: number;

  @Output() navigate = new EventEmitter<number>();

  nextFile() {
    this.navigate.emit(this.initial + 1);
  }
  previousFile() {
    this.navigate.emit(this.initial - 1);
  }
}

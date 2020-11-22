import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@freelancer/ui';
import { ProjectSubmission } from '../exercise-g-dynamic-forms/dynamic-forms.component';

@Component({
  selector: 'app-tutorial-modal',
  template: `
    <app-dynamic-forms
      [flTrackingSection]="'WebappWorkshop.ModalForm'"
      (formSubmitted)="handleSubmission($event)"
    ></app-dynamic-forms>
  `,
  styleUrls: ['./tutorial-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialModalComponent {
  constructor(private modalRef: ModalRef<TutorialModalComponent>) {}

  // formSubmitted won't be an output if people just do the basic form. They'll need to add it for this.
  handleSubmission(submission: ProjectSubmission) {
    this.modalRef.close(submission);
  }
}

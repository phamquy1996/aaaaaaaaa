import { ModalService } from '@freelancer/ui';
import { ModalSize } from '@freelancer/ui/modal';
import { ProjectDeleteModalComponent } from 'app/projects/project-delete-modal/project-delete-modal.component';

// function to facilitate passing down the id into the modal
// by returning a function itself
export function getDeleteProject(
  projectId: number,
  modalService: ModalService,
) {
  return () =>
    modalService.open(ProjectDeleteModalComponent, {
      inputs: {
        projectId,
      },
      size: ModalSize.SMALL,
    });
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BackendPushResponse,
  BackendUpdateResponse,
} from '@freelancer/datastore';
import {
  DiscoverCollection,
  DiscoverCollectionsCollection,
} from '@freelancer/datastore/collections';
import { ModalRef } from '@freelancer/ui';
import { HeadingType } from '@freelancer/ui/heading';
import { TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit class="CreateCollectionModalContent">
      <fl-bit class="Header">
        <fl-heading
          *ngIf="!isUpdate; else editCollection"
          i18n="Create new collection modal title"
          [size]="TextSize.MID"
          [headingType]="HeadingType.H1"
        >
          Create new collection
        </fl-heading>
        <ng-template #editCollection>
          <fl-heading
            i18n="Edit collection modal title"
            [size]="TextSize.MID"
            [headingType]="HeadingType.H1"
          >
            Edit collection
          </fl-heading>
        </ng-template>
      </fl-bit>
      <fl-hr></fl-hr>
      <app-create-collection-form
        class="CreateCollectionForm"
        [discoverCollection]="discoverCollection"
        [isUpdate]="isUpdate"
        (cancel)="handleCancellation()"
        (create)="handleCreateResponse($event)"
        (update)="handleUpdateResponse($event)"
      ></app-create-collection-form>
    </fl-bit>
  `,
  styleUrls: ['./create-collection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCollectionModalComponent {
  TextSize = TextSize;
  HeadingType = HeadingType;

  @Input() discoverCollection?: DiscoverCollection;
  @Input() isUpdate?: boolean;

  constructor(private modalRef: ModalRef<CreateCollectionModalComponent>) {}

  handleCancellation() {
    this.modalRef.close('canceled');
  }

  handleCreateResponse(
    response: BackendPushResponse<DiscoverCollectionsCollection>,
  ) {
    if (response && response.status === 'success') {
      this.modalRef.close(response.id);
    }
  }

  handleUpdateResponse(
    response: BackendUpdateResponse<DiscoverCollectionsCollection>,
  ) {
    if (response && response.status === 'success') {
      this.modalRef.close('updated');
    }
  }
}

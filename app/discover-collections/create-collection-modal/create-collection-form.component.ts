import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BackendPushResponse,
  BackendUpdateResponse,
  Datastore,
  DatastoreDocument,
} from '@freelancer/datastore';
import {
  DiscoverCollection,
  DiscoverCollectionsCollection,
} from '@freelancer/datastore/collections';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { ButtonColor } from '@freelancer/ui/button';
import { InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import {
  dirtyAndValidate,
  maxLength,
  pattern,
  required,
} from '@freelancer/ui/validators';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { DiscoverCollectionTypeApi } from 'api-typings/users/users';

@Component({
  selector: 'app-create-collection-form',
  template: `
    <fl-bit
      class="CreateCollectionForm"
      flTrackingSection="CreateCollectionForm"
    >
      <fl-bit class="Body">
        <fl-bit>
          <fl-label
            i18n="Collection title field label"
            [weight]="FontWeight.BOLD"
          >
            Title
          </fl-label>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.XSMALL">
          <fl-input
            i18n="Collection title field input"
            flTrackingLabel="NameInput"
            [control]="nameFormControl"
            [type]="InputType.TEXT"
            [disabled]="
              (createResponsePromise && !(createResponsePromise | async)) ||
              (updateResponsePromise && !(updateResponsePromise | async))
            "
            [maxCharacter]="NAME_MAX_CHARS"
            [maxLength]="NAME_MAX_CHARS"
            [flMarginBottom]="Margin.XXXSMALL"
          ></fl-input>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.XXSMALL">
          <fl-label
            i18n="Collection description field label"
            [weight]="FontWeight.BOLD"
            [flMarginBottom]="Margin.XSMALL"
          >
            Description (optional)
          </fl-label>
        </fl-bit>
        <fl-bit [flMarginBottom]="Margin.XXSMALL">
          <fl-textarea
            i18n="Collection description field placeholder"
            flTrackingLabel="DescriptionInput"
            class="DescriptionMaxHeight"
            [control]="descriptionFormControl"
            [rows]="2"
            [maxCharacter]="DESCRIPTION_MAX_CHARS"
            [maxLength]="DESCRIPTION_MAX_CHARS"
          ></fl-textarea>
        </fl-bit>
        <ng-container *ngIf="createResponsePromise | async as response">
          <fl-banner-alert
            *ngIf="
              response.status === 'error' &&
              response.errorCode !== ErrorCodeApi.DISCOVER_COLLECTION_DUPLICATE
            "
            i18n="Generic error message for collection creation"
            [compact]="true"
            [type]="BannerAlertType.ERROR"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Could not create collection. Please try again.
          </fl-banner-alert>
        </ng-container>
        <ng-container *ngIf="updateResponsePromise | async as response">
          <fl-banner-alert
            *ngIf="
              response.status === 'error' &&
              response.errorCode !== ErrorCodeApi.DISCOVER_COLLECTION_DUPLICATE
            "
            i18n="Generic error message for collection update"
            [compact]="true"
            [type]="BannerAlertType.ERROR"
            [flMarginBottom]="Margin.XXSMALL"
          >
            Could not update collection. Please try again.
          </fl-banner-alert>
        </ng-container>
      </fl-bit>
      <fl-bit class="Footer">
        <fl-hr></fl-hr>
        <fl-bit class="CallToAction">
          <fl-button
            *ngIf="!isUpdate; else updateButton"
            i18n="Button to create a collection"
            flTrackingLabel="CreateCollectionButton"
            [color]="ButtonColor.SECONDARY"
            [busy]="createResponsePromise && !(createResponsePromise | async)"
            [disabled]="!formGroup.valid"
            (click)="createCollection()"
          >
            Create
          </fl-button>
          <ng-template #updateButton>
            <fl-button
              i18n="Button to update collection"
              flTrackingLabel="UpdateCollectionButton"
              [color]="ButtonColor.SECONDARY"
              [busy]="updateResponsePromise && !(updateResponsePromise | async)"
              [disabled]="formGroup.pristine || !formGroup.valid"
              (click)="updateCollection()"
            >
              Update
            </fl-button>
          </ng-template>
          <fl-button
            i18n="Button to cancel creation of collection"
            flTrackingLabel="CancelButton"
            [color]="ButtonColor.DEFAULT"
            [flMarginRight]="Margin.SMALL"
            (click)="cancelCreate()"
          >
            Cancel
          </fl-button>
        </fl-bit>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./create-collection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCollectionFormComponent implements OnInit {
  ButtonColor = ButtonColor;
  InputType = InputType;
  Margin = Margin;
  FontWeight = FontWeight;
  TextSize = TextSize;
  FontColor = FontColor;
  BannerAlertType = BannerAlertType;
  ErrorCodeApi = ErrorCodeApi;

  formGroup: FormGroup;
  nameFormControl: FormControl;
  descriptionFormControl: FormControl;
  createResponsePromise: Promise<
    BackendPushResponse<DiscoverCollectionsCollection>
  >;
  updateResponsePromise: Promise<
    BackendUpdateResponse<DiscoverCollectionsCollection>
  >;
  showErrorBanner = false;
  discoverCollectionDocument: DatastoreDocument<DiscoverCollectionsCollection>;

  readonly NAME_MAX_CHARS = 40;
  readonly DESCRIPTION_MAX_CHARS = 300;

  @Input() discoverCollection?: DiscoverCollection;
  @Input() isUpdate?: boolean;

  @Output() cancel = new EventEmitter();
  @Output() create = new EventEmitter<
    BackendPushResponse<DiscoverCollectionsCollection>
  >();
  @Output() update = new EventEmitter<
    BackendUpdateResponse<DiscoverCollectionsCollection>
  >();

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    const requiredErrorMsg = 'This field is required';

    this.nameFormControl = new FormControl(
      this.discoverCollection ? this.discoverCollection.name : '',
      [
        required(requiredErrorMsg),
        maxLength(
          this.NAME_MAX_CHARS,
          $localize`Please enter at most ${this.NAME_MAX_CHARS} characters`,
        ),
        pattern(/^(?!\s*$).+/, $localize`Please enter a valid title.`),
      ],
    );
    this.descriptionFormControl = new FormControl(
      this.discoverCollection ? this.discoverCollection.description : '',
      [
        maxLength(
          this.DESCRIPTION_MAX_CHARS,
          $localize`Please enter at most ${this.DESCRIPTION_MAX_CHARS} characters`,
        ),
      ],
    );
    this.formGroup = new FormGroup({
      name: this.nameFormControl,
      description: this.descriptionFormControl,
    });

    if (this.discoverCollection) {
      this.discoverCollectionDocument = this.datastore.document<
        DiscoverCollectionsCollection
      >('discoverCollections', this.discoverCollection.id);
    }
  }

  createCollection() {
    dirtyAndValidate(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }

    this.formGroup.disable();
    this.createResponsePromise = this.datastore.createDocument<
      DiscoverCollectionsCollection
    >('discoverCollections', {
      name: this.formGroup.value.name.trim(),
      description: this.formGroup.value.description.trim(),
      dateCreated: Date.now(),
      lastUpdated: Date.now(),
      isPrivate: false,
      type: DiscoverCollectionTypeApi.CUSTOM,
      previewItems: [],
      itemCount: 0,
    });
    this.createResponsePromise.then(response => {
      if (response.status === 'success') {
        this.create.emit(response);
      } else {
        this.formGroup.enable();
        if (response.errorCode === ErrorCodeApi.DISCOVER_COLLECTION_DUPLICATE) {
          const nameFormControl = this.formGroup.get('name');
          if (nameFormControl) {
            nameFormControl.setErrors({
              DISCOVER_COLLECTION_DUPLICATE:
                'You already have a collection with this title',
            });
          }
        }
      }
    });
  }

  updateCollection() {
    dirtyAndValidate(this.formGroup);
    if (!this.formGroup.valid || !this.discoverCollection) {
      return;
    }
    this.formGroup.disable();

    const updatedCollection = {
      ...this.discoverCollection,
      name: this.formGroup.value.name.trim(),
      description: this.formGroup.value.description.trim(),
      lastUpdated: Date.now(),
    };

    this.updateResponsePromise = this.discoverCollectionDocument.update(
      updatedCollection,
    );
    this.updateResponsePromise.then(response => {
      if (response.status === 'success') {
        this.update.emit(response);
      } else {
        this.formGroup.enable();
        if (response.errorCode === ErrorCodeApi.DISCOVER_COLLECTION_DUPLICATE) {
          const nameFormControl = this.formGroup.get('name');
          if (nameFormControl) {
            nameFormControl.setErrors({
              DISCOVER_COLLECTION_DUPLICATE:
                'You already have a collection with this title',
            });
          }
        }
      }
    });
  }

  cancelCreate() {
    this.cancel.emit();
  }
}

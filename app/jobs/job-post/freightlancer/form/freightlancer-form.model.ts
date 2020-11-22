import { UploadedFile } from 'app/groups/groups-common/group-feed-post-form/file-upload/file-upload.component';
import * as Rx from 'rxjs';

export const TIME_OPTIONS: ReadonlyArray<string> = [
  '',
  '1:00',
  '2:00',
  '3:00',
  '4:00',
  '5:00',
  '6:00',
  '7:00',
  '8:00',
  '9:30',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:30',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '00:00',
];

export const DEFAULT_FORM_VALUES = {
  name: '',
  loadItemForm: [],
  vehicleTypes: {
    otherVehicleTypes: [],
  },
  shipmentType: undefined,
  budgetType: undefined,
  currencyId: 3, // Set default currency to AUD
  budget: undefined,
  pickupAndDropoffForm: {
    pickupAddress: undefined,
    pickupDate: undefined,
    pickupTime: TIME_OPTIONS[0],
    dropoffAddress: undefined,
    dropoffDate: undefined,
    dropoffTime: TIME_OPTIONS[0],
  },
  contactDetails: {
    dropoffEmail: undefined,
    dropoffName: undefined,
    dropoffPhone: undefined,
    pickupEmail: undefined,
    pickupName: undefined,
    pickupPhone: undefined,
  },
  description: undefined,
};

export const BUDGET_MINIMUM = 1;

export enum ShipmentType {
  GENERAL = 'general',
  HOTSHOT = 'hotshot',
}

export const FREIGHT_SKILLS: ReadonlyArray<string> = ['Freight'];

export const RESOURCE_ID_PLACEHOLDER = -1;

export const LOAD_ITEM_CATEGORIES: ReadonlyArray<string> = [
  '',
  'Machinery up to 25T',
  'Trailers to be carried',
  'Bulk Products',
  'Portable building',
  'Rail Freight',
  'Machinery 50T and over',
  'Trailers to be towed',
  'General Full Load',
  'International Shipping',
  'Small Parcel',
  'Pilot Work',
  'Pallet/Skid',
  'Trucks/prime movers',
  'Shipping containers',
  'General Part Load',
  'Cars/boats/vans',
  'Livestock',
];

export const DEFAULT_ITEM_FORM_VALUES = {
  quantity: undefined,
  category: LOAD_ITEM_CATEGORIES[0],
  description: undefined,
  length: undefined,
  width: undefined,
  height: undefined,
  weight: undefined,
  imageControl: [],
  referenceNumber: undefined,
  itemControl: true,
};

export interface LoadFileUpload {
  showDialogSubject$: Rx.BehaviorSubject<boolean>;
  showDialogObservable$: Rx.Observable<boolean>;
  uploadedFiles: ReadonlyArray<UploadedFile>;
}

export interface LoadItemDetails {
  category: string;
  description: string;
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface PickupAndDropoffDetails {
  contactDetails: {
    dropoffEmail: string;
    dropoffName: string;
    dropoffPhone: string;
    pickupEmail: string;
    pickupName: string;
    pickupPhone: string;
  };
  locationAndDateDetails: {
    dropoffAddress: string;
    dropoffAddressPostcode: string;
    dropoffDate: Date | undefined;
    dropoffTime: string;
    pickupAddress: string;
    pickupAddressPostcode: string;
    pickupDate: Date | undefined;
    pickupTime: string;
  };
}

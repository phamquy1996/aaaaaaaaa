import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCustomFieldValidation } from './custom-field-validations.transformers';
import { CustomFieldValidationsCollection } from './custom-field-validations.types';

export function customFieldValidationsReducer(
  state: CollectionStateSlice<CustomFieldValidationsCollection> = {},
  action: CollectionActions<CustomFieldValidationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'customFieldValidations') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CustomFieldValidationsCollection>(
          state,
          transformIntoDocuments(
            result.validations,
            transformCustomFieldValidation,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}

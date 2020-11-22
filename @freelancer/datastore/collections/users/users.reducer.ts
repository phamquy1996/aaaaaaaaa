import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  Reference,
  transformIntoDocuments,
  uniq,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { transformCustomFieldValues } from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import { transformOnlineOfflineStatusType } from '../online-offline/online-offline.transformers';
import { OnlineOfflineCollection } from '../online-offline/online-offline.types';
import { UsersSelfCollection } from '../users-self/users-self.types';
import { transformUser } from './users.transformers';
import { UsersCollection } from './users.types';

function isArrayOfIds(
  ids: ReadonlyArray<number | undefined> | undefined,
): ids is ReadonlyArray<number> {
  return ids !== undefined && !!ids.filter(isDefined);
}

export function usersReducer(
  state: CollectionStateSlice<UsersCollection> = {},
  action:
    | CollectionActions<UsersCollection>
    | CollectionActions<OnlineOfflineCollection>
    | CollectionActions<UsersSelfCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'users') {
        const { result, ref, order } = action.payload;
        if (result.users) {
          return mergeDocuments<UsersCollection>(
            state,
            transformIntoDocuments(result.users, transformUser),
            order,
            ref,
          );
        }
        return state;
      }

      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'users') {
        const { result, ref, originalDocument } = action.payload;
        if (result && 'enterprise_metadata_values' in result) {
          const customFieldInfoConfigurationIds = uniq(
            result.enterprise_metadata_values.map(
              value => value.enterprise_metadata_field_id,
            ),
          );

          // Remove all the customFieldValue with the same customFieldInfoConfigurationId as the result
          // because we will overwrite them
          const originalEnterpriseMetadataValues = originalDocument.customFieldValues
            ? originalDocument.customFieldValues.filter(
                value =>
                  !customFieldInfoConfigurationIds.includes(
                    value.customFieldInfoConfigurationId,
                  ),
              )
            : [];

          const newCustomFieldWithValue = result.enterprise_metadata_values
            .filter(value => isDefined(value.value))
            .map(value => transformCustomFieldValues(value));

          return updateWebsocketDocuments<UsersCollection>(
            state,
            [originalDocument.id],
            user => ({
              ...user,
              enterprisemMetadataValues: [
                ...originalEnterpriseMetadataValues,
                ...newCustomFieldWithValue,
              ],
            }),
            { path: { collection: 'users', authUid: ref.path.authUid } },
          );
        }
      }
      if (action.payload.type === 'usersSelf') {
        const { originalDocument, ref, delta } = action.payload;

        const { enterpriseIds } = delta;
        if (originalDocument.id && isArrayOfIds(enterpriseIds)) {
          return updateWebsocketDocuments<UsersCollection>(
            state,
            [originalDocument.id],
            user => ({
              ...user,
              ...{
                enterpriseIds,
              },
            }),
            { path: { collection: 'users', authUid: ref.path.authUid } },
          );
        }
      }

      return state;
    }

    case 'WS_MESSAGE': {
      const ref: Reference<UsersCollection> = {
        path: { collection: 'users', authUid: action.payload.toUserId },
      };
      if (
        action.payload.parent_type === 'onlineoffline' &&
        action.payload.type === 'statusget'
      ) {
        const { data } = action.payload;
        return updateWebsocketDocuments<UsersCollection>(
          state,
          Object.keys(data),
          user => {
            // replace status and remove timestamp if it's different
            const status = transformOnlineOfflineStatusType(data[user.id]);
            const lastUpdatedTimestamp =
              user.onlineOfflineStatus &&
              user.onlineOfflineStatus.status === status
                ? user.onlineOfflineStatus.lastUpdatedTimestamp
                : undefined;
            return {
              ...user,
              onlineOfflineStatus: {
                status,
                lastUpdatedTimestamp,
              },
            };
          },
          ref,
        );
      }
      if (
        action.payload.parent_type === 'onlineoffline' &&
        action.payload.type === 'statuschange'
      ) {
        const { data } = action.payload;
        const storeUser = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          data.user.toString(),
        );
        if (storeUser) {
          return mergeWebsocketDocuments<UsersCollection>(
            state,
            transformIntoDocuments([storeUser], user => ({
              ...user,
              onlineOfflineStatus: {
                status: transformOnlineOfflineStatusType(data.to),
                lastUpdatedTimestamp: Date.now(),
              },
            })),
            ref,
          );
        }
      }
      return state;
    }

    default:
      return state;
  }
}

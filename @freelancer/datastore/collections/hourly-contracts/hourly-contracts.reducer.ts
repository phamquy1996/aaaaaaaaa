import {
  CollectionActions,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { BidsCollection } from '../bids/bids.types';
import { ProjectViewBidsCollection } from '../project-view-bids/project-view-bids.types';
import {
  transformHourlyContract,
  transformWSHourlyContract,
} from './hourly-contracts.transformers';
import { HourlyContractsCollection } from './hourly-contracts.types';

export function hourlyContractsReducer(
  state = {},
  action:
    | CollectionActions<HourlyContractsCollection>
    | CollectionActions<BidsCollection>
    | CollectionActions<ProjectViewBidsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'hourlyContracts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<HourlyContractsCollection>(
          state,
          transformIntoDocuments(
            result.hourly_contracts,
            transformHourlyContract,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      const { result } = action.payload;

      if (
        (action.payload.type === 'bids' ||
          action.payload.type === 'projectViewBids') &&
        !!result &&
        'hourly_contract' in result &&
        !!result.hourly_contract
      ) {
        const ref: Reference<HourlyContractsCollection> = {
          path: {
            collection: 'hourlyContracts',
            // Only project owner can award and create an hourly contract
            authUid: action.payload.ref.path.authUid,
          },
        };

        return mergeWebsocketDocuments<HourlyContractsCollection>(
          state,
          transformIntoDocuments(
            [result.hourly_contract],
            transformHourlyContract,
          ),
          ref,
        );
      }

      if (action.payload.type === 'hourlyContracts') {
        const { result: data, ref } = action.payload;

        return mergeWebsocketDocuments<HourlyContractsCollection>(
          state,
          transformIntoDocuments([data], transformHourlyContract),
          ref,
        );
      }

      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<HourlyContractsCollection> = {
        path: {
          collection: 'hourlyContracts',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'hourlyContractUpdate': {
            return mergeWebsocketDocuments<HourlyContractsCollection>(
              state,
              transformIntoDocuments(
                [action.payload.data.hourlyContract],
                transformWSHourlyContract,
              ),
              ref,
            );
          }
          default:
            return state;
        }
      }
      return state;
    }
    default:
      return state;
  }
}

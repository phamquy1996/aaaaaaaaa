import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { UserSkill } from './user-skills.model';
import { transformUserSkills } from './user-skills.transformers';
import { UserSkillsCollection } from './user-skills.types';

export function userSkillsReducer(
  state: CollectionStateSlice<UserSkillsCollection> = {},
  action: CollectionActions<UserSkillsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userSkills') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<UserSkillsCollection>(
          state,
          transformIntoDocuments([result], transformUserSkills),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH': {
      if (action.payload.type === 'userSkills') {
        const { document: object, ref } = action.payload;

        return mergeWebsocketDocuments<UserSkillsCollection>(
          state,
          transformIntoDocuments([object], u => u),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'userSkills') {
        const { document: object, ref } = action.payload;

        return removeDocumentById<UserSkillsCollection>(ref, state, object.id);
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'userSkills') {
        const { originalDocument, ref } = action.payload;

        // Due to the way userSkills is stored in the datastore a simple
        // removeDocumentById is not usable on its own as the skills are saved
        // in an array indexed by the usersId instead of being stored as single
        // objects indexed by skill id. We then merge back in the userSkills
        // object with an empty array as the DELETE endpoint is only used when
        // deleting all users skills.
        const emptyState = removeDocumentById(ref, state, ref.path.authUid);

        const userSkills: UserSkill = {
          id: originalDocument.id,
          skills: [],
        };

        return mergeWebsocketDocuments<UserSkillsCollection>(
          emptyState,
          transformIntoDocuments([userSkills], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_ERROR': {
      if (action.payload.type === 'userSkills') {
        const { originalDocument, ref } = action.payload;
        return mergeWebsocketDocuments<UserSkillsCollection>(
          state,
          transformIntoDocuments([originalDocument], o => o),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'userSkills') {
        const { delta, ref, originalDocument } = action.payload;

        return mergeWebsocketDocuments<UserSkillsCollection>(
          state,
          transformIntoDocuments([deepSpread(originalDocument, delta)], t => t),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'userSkills') {
        const { ref, originalDocument } = action.payload;

        return mergeWebsocketDocuments<UserSkillsCollection>(
          state,
          transformIntoDocuments([originalDocument], t => t),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}

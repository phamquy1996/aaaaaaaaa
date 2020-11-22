import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TimeTrackingSessionPutRawPayload } from './time-tracking-session.backend-model';
import { TimeTrackingSessionCollection } from './time-tracking-session.types';

export function timeTrackingSessionBackend(): Backend<
  TimeTrackingSessionCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const bidIdParamValue = getQueryParamValue(query, 'bidId');
      if (!bidIdParamValue.length) {
        throw new Error('Time tracking sessions must be queried by bid ID');
      }

      let params: any = {
        // boolean value to filter sessions with invoice or without
        invoiced: getQueryParamValue(query, 'invoiced')[0],
        invoice_ids: getQueryParamValue(query, 'invoiceId'),
      };

      const timeLastUpdateParamValues = getQueryParamValue(
        query,
        'timeLastUpdated',
      );

      if (timeLastUpdateParamValues.length === 2) {
        params = {
          ...params,
          from_time: timeLastUpdateParamValues[0] / 1000,
          to_time: timeLastUpdateParamValues[1] / 1000,
        };
      }

      if (
        !getQueryParamValue(query, 'trackingStoppedTime')[0] &&
        getQueryParamValue(query, 'manuallyTracked').length > 0 &&
        !getQueryParamValue(query, 'manuallyTracked')[0]
      ) {
        params = {
          ...params,
          active: true,
        };
      }

      return {
        endpoint: `projects/0.1/bids/${bidIdParamValue[0]}/time_tracking_sessions/`,
        params,
      };
    },
    push: (authUid, timeTrackingSession, extra) => {
      // Start a time tracking session
      if (
        !timeTrackingSession.manuallyTracked &&
        extra &&
        extra.action === 'START'
      ) {
        return {
          endpoint: `projects/0.1/time_tracking_sessions/`,
          asFormData: false,
          payload: {
            project_id: timeTrackingSession.projectId,
          },
          method: 'POST',
        };
      }

      const seconds = timeTrackingSession.duration / 1000;
      const startTime = timeTrackingSession.timeStarted / 1000;

      return {
        endpoint: `projects/0.1/bids/${timeTrackingSession.bidId}/time_tracking_sessions/`,
        asFormData: true,
        payload: {
          start_time: startTime,
          seconds,
          note: timeTrackingSession.note,
        },
        method: 'POST',
      };
    },
    set: undefined,
    update: (authUid, session, originalSession) => {
      const timeTrackingSessionId = originalSession.id;
      const endpoint = `projects/0.1/time_tracking_sessions/${timeTrackingSessionId}`;
      const method = 'PUT';
      let payload: TimeTrackingSessionPutRawPayload | undefined;

      if (session.trackingStoppedTime) {
        payload = {
          action: 'STOP',
        };
      }

      const { note } = session;
      if (note !== undefined) {
        if (payload) {
          throw new Error('Cannot update two requests at once');
        }

        payload = {
          action: 'UPDATE',
          note,
        };
      }

      if (payload) {
        return {
          endpoint,
          payload,
          method,
        };
      }
      throw new Error('Cannot update time tracking session');
    },
    remove: (authUid, timeTrackingSessionId, originalTimeTrackingSession) => ({
      endpoint: `projects/0.1/time_tracking_sessions/${timeTrackingSessionId}`,
      method: 'DELETE',
      payload: {},
    }),
  };
}

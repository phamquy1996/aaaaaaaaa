import {
  WebsocketTrackCreateEvent,
  WebsocketTrackPoint,
} from '@freelancer/datastore/core';
import { TrackApi, TrackPointApi } from './tracks.backend-model';
import { Track, TrackPoint } from './tracks.model';

export function transformTracks(track: TrackApi): Track {
  return {
    id: track.id,
    userId: track.userId,
    projectId: track.projectId,
    trackPoints: transformTrackPoints(track.trackPoints),
    timeStarted: track.timeStarted * 1000,
    timeFinished: track.timeFinished ? track.timeFinished * 1000 : undefined,
  };
}

function transformTrackPoints(
  trackPoints: ReadonlyArray<TrackPointApi>,
): ReadonlyArray<TrackPoint> {
  return trackPoints.map(trackPoint => ({
    longitude: trackPoint.longitude,
    latitude: trackPoint.latitude,
    timeCreated: trackPoint.timeCreated
      ? trackPoint.timeCreated * 1000
      : undefined,
  }));
}

export function transformWebsocketTrackCreateEvent(
  track: WebsocketTrackCreateEvent,
): Track {
  return {
    id: track.data.id,
    userId: track.data.userId,
    projectId: track.data.projectId,
    trackPoints: transformWebsocketTrackPoints(track.data.trackPoints),
    timeStarted: track.data.timeStarted * 1000,
    timeFinished: track.data.timeFinished
      ? track.data.timeFinished * 1000
      : undefined,
  };
}

function transformWebsocketTrackPoints(
  trackPoints: ReadonlyArray<WebsocketTrackPoint>,
): ReadonlyArray<TrackPoint> {
  return trackPoints.map(trackPoint =>
    transformWebsocketTrackPoint(trackPoint),
  );
}

export function transformWebsocketTrackPoint(
  trackPoint: WebsocketTrackPoint,
): TrackPoint {
  return {
    longitude: trackPoint.longitude,
    latitude: trackPoint.latitude,
    timeCreated: trackPoint.timeCreated
      ? trackPoint.timeCreated * 1000
      : undefined,
  };
}

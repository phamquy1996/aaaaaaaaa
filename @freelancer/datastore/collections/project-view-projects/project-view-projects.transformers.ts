import { RecursivePartial } from '@freelancer/datastore/core';
import { LocationApi, QualificationApi } from 'api-typings/common/common';
import {
  NDADetailsApi,
  NDASignatureApi,
  ProjectApi,
  ProjectAttachmentApi,
  ProjectLocalDetailsApi,
  ProjectsGetResultApi,
} from 'api-typings/projects/projects';
import { Location } from '../project-view-users/location.model';
import { transformProject } from '../projects/projects.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { transformLocation } from '../users/users-location.transformers';
import {
  NDADetails,
  NDASignature,
  ProjectAttachment,
  ProjectLocalDetails,
  ProjectViewProject,
  Qualification,
} from './project-view-projects.model';

// Transforms what the backend returns into a format your components can consume
// Should only be called in this collection's reducer
export function transformProjectViewProjects(
  project: ProjectApi,
  allSelectedBids: ProjectsGetResultApi['selected_bids'],
): ProjectViewProject {
  return {
    ...transformProject(project, allSelectedBids),

    // Extra things for freelancer pvp
    attachments: (project.attachments || []).map(attachment =>
      transformProjectAttachment(attachment),
    ),
    canPostReview: project.can_post_review || {},
    description: project.description,
    location: project.location
      ? transformLocation(project.location)
      : undefined,
    true_location: project.true_location
      ? transformLocation(project.true_location)
      : undefined,
    qualifications: project.qualifications
      ? project.qualifications.map(transformQualification)
      : [],
    skills: (project.jobs || []).map(transformSkill),
    ndaDetails: project.nda_details
      ? transformNDADetails(project.nda_details)
      : { signatures: [] },
    displayLocation: transformDisplayedLocation(
      project.true_location || project.location,
    ),
    localDetails: project.local_details
      ? transformProjectLocalDetails(project.local_details)
      : undefined,
    equipment: project.equipment,
    invitedFreelancers: (project.invited_freelancers || []).map(
      freelancer => freelancer.id,
    ),
    repostId: project.repost_id,
  };
}

// exactly the same as transformProjectViewProjects just with less required fields
export function transformProjectViewProjectsPush(
  projectIn: ProjectApi,
): ProjectViewProject {
  // add stuff we might be missing from API
  const project: ProjectApi = {
    ...projectIn,
    bid_stats: { bid_count: 0 },
    time_submitted: projectIn.time_submitted
      ? projectIn.time_submitted * 1000
      : Date.now(),
  };

  return transformProjectViewProjects(project, []);
}

function transformProjectAttachment(
  attachment: ProjectAttachmentApi,
): ProjectAttachment {
  return {
    id: attachment.id,
    filename: attachment.filename,
    timeSubmitted: (attachment.time_submitted || 0) * 1000, // Turn seconds to ms,
    url: `https://${attachment.url}`,
    accessHash: attachment.access_hash,
    contentType: attachment.content_type,
  };
}

export function transformQualification(
  qualification: QualificationApi,
): Qualification {
  return {
    id: qualification.id,
    description: qualification.description,
    iconName: qualification.icon_name,
    iconUrl: qualification.icon_url,
    insigniaId: qualification.insignia_id,
    level: qualification.level,
    name: qualification.name,
    scorePercentage: qualification.score_percentage,
    type: qualification.type,
    userPercentile: qualification.user_percentile,
  };
}

function transformNDADetails(ndaDetails: NDADetailsApi): NDADetails {
  return {
    hiddenDescription: ndaDetails.hidden_description,
    signatures: ndaDetails.signatures
      ? ndaDetails.signatures.map(transformNDASignatures)
      : [],
  };
}

function transformNDASignatures(signatures: NDASignatureApi): NDASignature {
  if (signatures.time_signed === undefined) {
    throw Error(`NDA signature does not have time signed`);
  }
  if (signatures.project_id === undefined) {
    throw Error(`NDA signature does not have project id`);
  }
  if (signatures.user_id === undefined) {
    throw Error(`NDA signature does not have user id`);
  }

  return {
    timeSigned: signatures.time_signed * 1000,
    projectId: signatures.project_id,
    userId: signatures.user_id,
  };
}

export function transformDisplayedLocation(
  location?: LocationApi,
): string | undefined {
  if (location && location.full_address) {
    return location.full_address;
  }

  if (location && location.country) {
    if (location.administrative_area && location.city) {
      return `${location.city}, ${location.administrative_area}, ${location.country.name}`;
    }

    if (location.city) {
      return `${location.city}, ${location.country.name}`;
    }

    if (location.administrative_area) {
      return `${location.administrative_area}, ${location.country.name}`;
    }

    return location.country.name;
  }

  return undefined;
}

export function transformDisplayedLocationOnUpdate(
  location?: RecursivePartial<Location>,
): string | undefined {
  if (location && location.fullAddress) {
    return location.fullAddress;
  }

  if (location && location.country) {
    if (location.administrativeArea && location.city) {
      return `${location.city}, ${location.administrativeArea}, ${location.country.name}`;
    }

    if (location.city) {
      return `${location.city}, ${location.country.name}`;
    }

    if (location.administrativeArea) {
      return `${location.administrativeArea}, ${location.country.name}`;
    }

    return location.country.name;
  }

  return '';
}

export function transformProjectLocalDetails(
  projectLocalDetails: ProjectLocalDetailsApi,
): ProjectLocalDetails {
  return {
    date: projectLocalDetails.date || undefined,
    // The backend returns a date object instead of a timestamp so * 1000 is unnecessary
    // tslint:disable-next-line: validate-millisecond-timestamps
    dateTimestamp: projectLocalDetails.date
      ? new Date(
          projectLocalDetails.date.year,
          projectLocalDetails.date.month - 1,
          projectLocalDetails.date.day,
        ).getTime()
      : undefined,
    endLocation: projectLocalDetails.end_location
      ? transformLocation(projectLocalDetails.end_location)
      : undefined,
    displayEndLocation: transformDisplayedLocation(
      projectLocalDetails.end_location,
    ),
  };
}

export function transformProjectViewProjectsUpdate(
  delta: RecursivePartial<ProjectViewProject>,
): RecursivePartial<ProjectViewProject> {
  return {
    ...delta,
    true_location: delta.location,
    localDetails: {
      date: delta.localDetails ? delta.localDetails.date : undefined,
      // The backend returns a date object instead of a timestamp so * 1000 is unnecessary
      // tslint:disable-next-line: validate-millisecond-timestamps
      dateTimestamp:
        delta.localDetails &&
        delta.localDetails.date &&
        delta.localDetails.date.year &&
        delta.localDetails.date.month &&
        delta.localDetails.date.day
          ? new Date(
              delta.localDetails.date.year,
              delta.localDetails.date.month - 1,
              delta.localDetails.date.day,
            ).getTime()
          : undefined,
      endLocation: delta.localDetails
        ? delta.localDetails.endLocation
        : undefined,
      displayEndLocation:
        transformDisplayedLocationOnUpdate(
          delta.localDetails ? delta.localDetails.endLocation : undefined,
        ) || undefined,
    },
    displayLocation:
      transformDisplayedLocationOnUpdate(
        delta.true_location || delta.location || undefined,
      ) || undefined,
    equipment: delta.equipment || undefined,
  };
}

export function transformLocationToApi(
  location: Location | undefined,
): LocationApi | undefined {
  return location && location.mapCoordinates
    ? {
        administrative_area: location.administrativeArea || '',
        country: {
          code: (location.country && location.country.code) || '',
          name: (location.country && location.country.name) || '',
        },
        full_address: location.fullAddress || '',
        latitude: location.mapCoordinates.latitude,
        longitude: location.mapCoordinates.longitude,
        vicinity: location.vicinity || '',
      }
    : undefined;
}

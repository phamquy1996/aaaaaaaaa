import {
  Backend,
  getQueryParamValue,
  objectKeysFilter,
  OrderByDirection,
  setDiff,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import {
  ProjectStatusApi,
  ProjectTypeApi,
} from 'api-typings/projects/projects';
import { transformEnterpriseMetadataValuePayload } from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import { convertUpgrade } from '../projects/projects.backend';
import { ProjectAction } from '../projects/projects.backend-model';
import { HireMeInitialBid } from '../projects/projects.model';
import { transformLocationToApi } from './project-view-projects.transformers';
import { ProjectViewProjectsCollection } from './project-view-projects.types';

export function projectViewProjectsBackend(): Backend<
  ProjectViewProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects`,
      params: {
        attachment_details: 'true',
        full_description: 'true',
        job_details: 'true',
        location_details: 'true',
        nda_details: 'true',
        projects: ids,
        project_collaboration_details: 'true',
        seo_urls: getQueryParamValue(query, 'seoUrl'),
        selected_bids: 'true',
        qualification_details: 'true',
        upgrade_details: 'true',
        review_availability_details: 'true',
        local_details: 'true',
        equipment_details: 'true',
        invited_freelancer_details: 'true',
      },
    }),
    push: (authUid, project) => {
      if (!project.description) {
        throw new Error('Project description is required!');
      }

      return {
        endpoint: 'projects/0.1/projects/',
        payload: {
          title: project.title,
          description: project.description,
          language: project.language,
          currency: { id: project.currency.id },
          budget: {
            ...project.budget,
            currency_id: project.currency.id,
            project_type: project.budget.projectType,
          },
          billing_code: project.billingCode,
          jobs: project.skills,
          type: project.type,
          bidperiod: project.bidPeriod,
          hourly_project_info:
            project.type === ProjectTypeApi.HOURLY
              ? project.hourlyProjectInfo
              : undefined,
          hireme: project.hireme ?? false,
          equipment: project.equipment,
          location: project.local
            ? transformLocationToApi(project.location)
            : undefined,
          local_details:
            project.local && project.localDetails
              ? {
                  end_location: project.localDetails.endLocation
                    ? transformLocationToApi(project.localDetails.endLocation)
                    : undefined,
                  date: project.localDetails.date
                    ? {
                        year: project.localDetails.date.year,
                        month: project.localDetails.date.month + 1,
                        day: project.localDetails.date.day,
                      }
                    : undefined,
                }
              : undefined,
          upgrades: {
            ...project.upgrades,
            recruiter: project.upgrades.assisted,
            project_management: project.upgrades.projectManagement,
            ip_contract: project.upgrades.ipContract,
            pf_only: project.upgrades.pfOnly,
            /**
             * Paid Recruiter upgrade intention but yet to be paid due to the
             * interaction of desktop PJP project posting and cart paid upgrade
             * flow.
             */
            unpaid_recruiter: project.upgrades.unpaidRecruiter,
          },
          nda_details: {
            hidden_description: project.ndaDetails?.hiddenDescription,
          },
          files: project.files ? project.files : [],
          hireme_initial_bid: transformHiremeBidToRaw(project.hiremeInitialBid),
          timeframe: project.timeframe
            ? {
                start_date: project.timeframe.startDate
                  ? Math.round(project.timeframe.startDate / 1000)
                  : undefined,
                end_date: project.timeframe.endDate
                  ? Math.round(project.timeframe.endDate / 1000)
                  : undefined,
              }
            : undefined,
          // TODO: T213935 - This is deprecated and will be removed.
          deloitte_details: project.deloitteDetails
            ? {
                billing_code: project.deloitteDetails.billingCode,
                industry_offering: {
                  project_type:
                    project.deloitteDetails.industryOffering.projectType,
                  practice: project.deloitteDetails.industryOffering.practice,
                  industry: project.deloitteDetails.industryOffering.industry,
                  offering: project.deloitteDetails.industryOffering.offering,
                },
                clearance: project.deloitteDetails.clearance,
                itar: project.deloitteDetails.itar ? 'Yes' : undefined,
              }
            : undefined,
          pool_ids: project.poolIds,
          enterprise_metadata_values: project.customFieldValues
            ? project.customFieldValues.map(customField =>
                transformEnterpriseMetadataValuePayload(customField),
              )
            : undefined,
          repost_id: project.repostId,
        },
      };
    },
    set: undefined,
    update: (authUid, document, originalDocument) => {
      if (
        document.status !== ProjectStatusApi.FROZEN &&
        document.status !== ProjectStatusApi.CLOSED &&
        !document.upgrades &&
        (!document.title || !document.description || !document.skills) &&
        !document.localDetails &&
        !checkBillingCodeValid(document.billingCode) &&
        !document.customFieldValues
      ) {
        throw new Error(`Could not update any fields of project`);
      }

      let payload:
        | ProjectViewProjectsCollection['Backend']['Update']['PayloadType']
        | undefined;
      let method: 'PUT' | 'POST' = 'PUT';
      let endpoint = `projects/0.1/projects/${originalDocument.id}/`;

      if (document.status === ProjectStatusApi.CLOSED) {
        payload = {
          action: ProjectAction.CLOSE,
        };
      }

      if (document.status === ProjectStatusApi.FROZEN) {
        payload = {
          action: ProjectAction.END_BIDDING,
        };
      }

      if (document.upgrades) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }

        const unconvertedUpgrades = setDiff(
          objectKeysFilter(document.upgrades, x => x),
          // exclude extend so even if users have bought extend item
          // datastore doesn't block them from getting another
          objectKeysFilter(
            originalDocument.upgrades,
            (val, key) => key !== 'extend' && val,
          ),
        );

        const upgrades = unconvertedUpgrades.map(convertUpgrade);

        payload = {
          action: ProjectAction.UPGRADE,
          'upgrades[]': upgrades,
        };
      }

      if (checkBillingCodeValid(document.billingCode)) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }

        payload = {
          action: ProjectAction.UPDATE,
          billing_code: document.billingCode,
        };
      }

      if (payload) {
        return {
          payload,
          endpoint,
          method,
        };
      }

      // Updating title, description, skills & optional NDA hidden description
      if (document.title && document.description && document.skills) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }

        method = 'POST';
        endpoint = `projects/editProject.php`;
        const {
          title,
          description,
          ndaDetails,
          hiremeOpenedForBidding,
        } = document;
        const jobIds = document.skills
          .filter(isDefined)
          .map(skill => skill.id)
          .filter(isDefined);

        payload = {
          projectId: originalDocument.id,
          title,
          description,
          jobs: jobIds,
        };

        if (hiremeOpenedForBidding) {
          payload = {
            ...payload,
            to_nonhireme: true,
          };
        }

        if (ndaDetails) {
          payload = {
            ...payload,
            hidden_description: ndaDetails.hiddenDescription,
          };
        }

        // TODO: T213935 - This is deprecated and will be removed.
        if (
          originalDocument.deloitteDetails &&
          document.deloitteDetails &&
          document.deloitteDetails.industryOffering &&
          document.timeframe
        ) {
          /**
           * tl;dr - The purpose of the code below is maintaining a nested form
           * state. For more details see:
           * {@link https://phabricator.tools.flnltd.com/D130480#inline-632530}
           */
          const mappedDeloitteDetails = {
            'deloitteDetails[billingCode]':
              document.deloitteDetails.billingCode,
            'deloitteDetails[clearance]': document.deloitteDetails.clearance,
            'deloitteDetails[industryOffering][projectType]':
              document.deloitteDetails.industryOffering.projectType,
            'deloitteDetails[industryOffering][practice]':
              document.deloitteDetails.industryOffering.practice,
            'deloitteDetails[industryOffering][industry]':
              document.deloitteDetails.industryOffering.industry,
            'deloitteDetails[industryOffering][offering]':
              document.deloitteDetails.industryOffering.offering,
            'deloitteDetails[itar]': document.deloitteDetails.itar,
            'timeframe[startDate]': (document.timeframe.startDate || 0) / 1000,
            'timeframe[endDate]': (document.timeframe.endDate || 0) / 1000,
          };

          payload = { ...payload, ...mappedDeloitteDetails };
        }

        if (document.hourlyProjectInfo?.commitment?.hours) {
          payload = {
            ...payload,
            commitment_hours: document.hourlyProjectInfo.commitment.hours,
          };
        }

        if (document.localDetails) {
          if (
            document.localDetails.endLocation &&
            document.localDetails.endLocation.mapCoordinates
          ) {
            const mappedEndLocation = {
              'local_details[end_location][latitude]':
                document.localDetails.endLocation.mapCoordinates.latitude,
              'local_details[end_location][longitude]':
                document.localDetails.endLocation.mapCoordinates.longitude,
              'local_details[end_location][vicinity]':
                document.localDetails.endLocation.vicinity || undefined,
              'local_details[end_location][full_address]':
                document.localDetails.endLocation.fullAddress || undefined,
              'local_details[end_location][administrative_area]':
                document.localDetails.endLocation.administrativeArea ||
                undefined,
              'local_details[end_location][country][name]': document
                .localDetails.endLocation.country
                ? document.localDetails.endLocation.country.name
                : undefined,
            };
            payload = { ...payload, ...mappedEndLocation };
          } else {
            // form-data does not evaluate null properly, so '' is used here for `blank` data
            const mappedEndLocation = {
              'local_details[end_location]': '',
            };
            payload = { ...payload, ...mappedEndLocation };
          }

          if (document.localDetails.date) {
            const mappedLocalDetails = {
              'local_details[date][year]': document.localDetails.date.year,
              'local_details[date][month]': document.localDetails.date.month,
              'local_details[date][day]': document.localDetails.date.day,
            };
            payload = { ...payload, ...mappedLocalDetails };
          } else {
            const mappedLocalDetails = {
              'local_details[date]': '',
            };
            payload = { ...payload, ...mappedLocalDetails };
          }
        }

        if (document.equipment) {
          const equipmentIds = document.equipment
            .filter(isDefined)
            .map(equipment => equipment.id)
            .filter(isDefined);
          payload = { ...payload, ...{ equipment_ids: equipmentIds } };
        } else {
          payload = { ...payload, ...{ 'equipment_ids[]': '' } };
        }

        if (document.location && document.location.mapCoordinates) {
          const mappedLocation = {
            project_geoInfo_lat: document.location.mapCoordinates.latitude,
            project_geoInfo_lng: document.location.mapCoordinates.longitude,
            project_geoInfo_vicinity: document.location.vicinity || undefined,
            project_geoInfo_administrative_area_level_1:
              document.location.administrativeArea || undefined,
            project_geoInfo_country: document.location.country
              ? document.location.country.name
              : undefined,
            project_geoInfo_formatted_address:
              document.location.fullAddress || undefined,
          };
          payload = { ...payload, ...mappedLocation };
        }

        return {
          isGaf: true,
          asFormData: true,
          payload,
          endpoint,
          method,
        };
      }

      // Updating project custom field values
      if (document.customFieldValues) {
        if (payload) {
          throw new Error(
            `Cannot update custom fields and other fields at the same time`,
          );
        }
        const customFieldValues = document.customFieldValues.filter(isDefined);
        if (!customFieldValues.length) {
          throw new Error('No custom fields to update.');
        }
        payload = {
          enterprise_metadata_values: customFieldValues.map(customFieldValue =>
            transformEnterpriseMetadataValuePayload(customFieldValue),
          ),
        };

        return {
          endpoint: 'projects/0.1/projects/enterprise_metadata_fields',
          method: 'POST',
          payload,
        };
      }

      throw new Error(`Could not update any fields of the project`);
    },
    remove: undefined,
  };
}
function transformHiremeBidToRaw(hiremeBid: HireMeInitialBid | undefined) {
  return hiremeBid
    ? {
        bidder_id: hiremeBid.bidderId,
        amount: hiremeBid.amount,
        period: hiremeBid.period,
      }
    : undefined;
}

function checkBillingCodeValid(billingCode: string | undefined): boolean {
  return billingCode !== null && billingCode !== undefined;
}

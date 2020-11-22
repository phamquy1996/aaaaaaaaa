import { Injectable } from '@angular/core';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import {
  Enterprise,
  HourlyContract,
  HourlyContractsCollection,
  Project,
} from '@freelancer/datastore/collections';
import {
  ProjectStatusFromBids,
  ProjectStatusHelper,
} from '@freelancer/project-status';
import { toNumber } from '@freelancer/utils';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
  ProjectCollaborationStatusApi,
} from 'api-typings/projects/projects';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HourlyContractHelper {
  constructor(
    private datastore: Datastore,
    private statusHelper: ProjectStatusHelper,
  ) {}

  /**
   * Fetches the hourly contracts collection on project that is owned by the
   * specified userId.
   *
   * When project is before (in)complete, fetch only the active contracts
   * Because after project is (in)complete, contracts will all be invalid
   */
  getHourlyContractsCollectionByUser(
    project$: Rx.Observable<Project | undefined>,
    userId$: Rx.Observable<number | string>,
  ): DatastoreCollection<HourlyContractsCollection> {
    return this.datastore.collection<HourlyContractsCollection>(
      'hourlyContracts',
      query =>
        Rx.combineLatest([userId$, project$]).pipe(
          map(([userId, project]) => {
            if (!project) {
              return query.null();
            }

            const ownerAccess = this.hasOwnerAccess(project, toNumber(userId));

            const isBidder = project.selectedBids.some(bid => bid.bidderId);

            // If user has owner access of the project they can view all hourly contracts attached to the project.
            if (ownerAccess) {
              const queryTemp = query.where('projectId', '==', project.id);
              // Only return active hourly contracts when there is no completed bid.
              // In the scenario with only one awarded bid,
              // this helps to filter out inactive hourly contract from an 'hourly fixed' bid
              // which is originally awarded as 'hourly hourly'.
              return project.selectedBids.some(
                bid =>
                  bid.completeStatus === BidCompleteStatusApi.COMPLETE ||
                  bid.completeStatus === BidCompleteStatusApi.INCOMPLETE,
              )
                ? queryTemp
                : queryTemp.where('active', '==', true);
            }

            // If a user is a bidder that on the project, they can only view their hourly contracts
            // attached to the project, therefore a bidderId must be specified in the query.
            if (isBidder) {
              const queryTemp = query
                .where('projectId', '==', project.id)
                .where('bidderId', '==', toNumber(userId));

              // The project status has to be checked for the specific user.
              const projectStatusForBidder = this.statusHelper.getProjectStatus(
                toNumber(userId),
                project,
              );

              // When project is in(complete) for the bidder, all contract are invalid
              return projectStatusForBidder ===
                ProjectStatusFromBids.COMPLETE ||
                projectStatusForBidder === ProjectStatusFromBids.INCOMPLETE
                ? queryTemp
                : queryTemp.where('active', '==', true);
            }

            return query.null();
          }),
        ),
    );
  }

  canViewHourlyTracking(
    project: Project,
    hourlyContracts: ReadonlyArray<HourlyContract>,
    userId: number,
  ): boolean {
    const isNonDeloitteLocal =
      project.local &&
      !(
        project.enterpriseIds &&
        project.enterpriseIds.includes(Enterprise.DELOITTE_DC)
      );

    const projectStatusFromBid = this.statusHelper.getProjectStatus(
      userId,
      project,
    );
    // If project does not have hourly contract, hourly tracking cannot be viewed.
    // Also if job is local do not show time tracking (unless deloitte).
    if (
      !hourlyContracts.length ||
      !hourlyContracts.some(contract => contract.projectId === project.id) ||
      isNonDeloitteLocal ||
      projectStatusFromBid === ProjectStatusFromBids.NO_FREELANCER_SELECTED
    ) {
      return false;
    }

    const ownerAccess = this.hasOwnerAccess(project, userId);
    if (ownerAccess) {
      return true;
    }

    const selectedBid = project.selectedBids.find(
      bid => bid.bidderId === toNumber(userId),
    );

    if (
      hourlyContracts.some(
        contract => contract.bidderId === toNumber(userId),
      ) &&
      selectedBid &&
      selectedBid.awardStatus === BidAwardStatusApi.AWARDED
    ) {
      return true;
    }
    return false;
  }

  private hasOwnerAccess(project: Project, userId: number): boolean {
    const isCollaborator = project.projectCollaborations
      .filter(
        collaborator =>
          collaborator.status === ProjectCollaborationStatusApi.ACTIVE,
      )
      .some(collab => collab.userId === userId);

    const isOwner = project.ownerId === toNumber(userId);

    return isOwner || isCollaborator;
  }
}

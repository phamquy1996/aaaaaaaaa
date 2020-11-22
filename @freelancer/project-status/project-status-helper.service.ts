import { Injectable } from '@angular/core';
import { Project } from '@freelancer/datastore/collections';
import {
  BidAwardStatusApi,
  BidCompleteStatusApi,
  ProjectCollaborationStatusApi,
  ProjectStatusApi,
  ProjectSubStatusApi,
} from 'api-typings/projects/projects';
import { ProjectStatusFromBids } from './project-status.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectStatusHelper {
  /* Compute real project status based on outdated project.status, project's
   * bids, and current user.
   * Yes this is a mess, but hopefully this is  t.e.m.p.o.r.a.r.y.
   * Docs: https://phabricator.tools.flnltd.com/w/team/hiring_experience/feature_specifications/project_states/101/
   * Copied logic from getBidBasedStatus in MinimalProject.php
   * Case 1: user has a bid on this project
   * Case 2: user has no bid on this project OR user owns this project
   */
  getProjectStatus(userId: number, project: Project): ProjectStatusFromBids {
    const outdatedProjectStatus: ProjectStatusApi = project.status;
    const userBid = project.selectedBids.filter(bid => bid.bidderId === userId);

    // bidList is current user's awarded bid if they have one, i.e. the awarded freelancer
    // Otherwise it includes all the selected bids of the project
    // For checking the two kinds of user viewing this project
    const bidList = userBid.length === 0 ? project.selectedBids : userBid;

    // Based on project.status
    switch (outdatedProjectStatus) {
      case ProjectStatusApi.ACTIVE:
        return ProjectStatusFromBids.OPEN;
      case ProjectStatusApi.PENDING:
        return ProjectStatusFromBids.PENDING;
      case ProjectStatusApi.DRAFT:
        return ProjectStatusFromBids.DRAFT;
      default:
    }

    const isCollaborator = project.projectCollaborations
      .filter(collab => collab.status === ProjectCollaborationStatusApi.ACTIVE)
      .some(collab => collab.userId === userId);

    // Check project status based on bid list
    if (
      bidList.some(
        bid =>
          bid.awardStatus === BidAwardStatusApi.AWARDED &&
          bid.completeStatus === BidCompleteStatusApi.PENDING,
      )
    ) {
      return userId === project.ownerId || isCollaborator
        ? ProjectStatusFromBids.IN_PROGRESS
        : ProjectStatusFromBids.ACCEPTED;
    }

    if (bidList.some(bid => bid.awardStatus === BidAwardStatusApi.PENDING)) {
      return ProjectStatusFromBids.AWAITING_ACCEPTANCE;
    }

    if (
      bidList.some(bid => bid.completeStatus === BidCompleteStatusApi.COMPLETE)
    ) {
      return ProjectStatusFromBids.COMPLETE;
    }

    if (
      bidList.some(
        bid => bid.completeStatus === BidCompleteStatusApi.INCOMPLETE,
      )
    ) {
      return ProjectStatusFromBids.INCOMPLETE;
    }
    /*
     * NOTE:
     * Project.selectedBid will only return the awarded or
     * pending award bids so cancelled, rejected and revoked case will never show
     */
    if (bidList.some(bid => bid.awardStatus === BidAwardStatusApi.CANCELED)) {
      return ProjectStatusFromBids.CANCELED;
    }

    if (bidList.some(bid => bid.awardStatus === BidAwardStatusApi.REJECTED)) {
      return ProjectStatusFromBids.REJECTED;
    }

    if (bidList.some(bid => bid.awardStatus === BidAwardStatusApi.REVOKED)) {
      return ProjectStatusFromBids.REVOKED;
    }

    /**
     * Only happens when the only selected bid ended with requirement changed reason
     * Ideally we should also check bid.awardStatus === 'cancelled' and bid.paidStatus ==='unpaid'
     * but currently project.selectedBids only return the pending award and awarded bids.
     */
    if (
      outdatedProjectStatus === ProjectStatusApi.CLOSED &&
      project.subStatus === ProjectSubStatusApi.CANCEL_SELLER
    ) {
      return ProjectStatusFromBids.NO_FREELANCER_SELECTED;
    }

    /**
     * When the code execution hits here it means that
     * employer hasn't awarded any bids but
     * employer clicked the end bidding button which
     * changes the project status to frozen and sub_status to frozen_timezone.
     * We want to return NO_FREELANCER_SELECTED status for this case.
     */
    if (
      project.status === ProjectStatusApi.FROZEN &&
      project.subStatus === ProjectSubStatusApi.FROZEN_TIMEOUT
    ) {
      return ProjectStatusFromBids.NO_FREELANCER_SELECTED;
    }

    // All other situations: project closed
    return ProjectStatusFromBids.CLOSED;
  }
}

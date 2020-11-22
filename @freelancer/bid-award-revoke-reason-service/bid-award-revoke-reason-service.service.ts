import { Injectable } from '@angular/core';
import { ResponseData } from '@freelancer/datastore';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { share } from 'rxjs/operators';

export interface BidAwardRevokeReasonsPostRawPayload {
  readonly projectId: number;
  readonly freelancerId: number;
  readonly reasonId: number;
  readonly otherFeedback: string;
}

export interface BidAwardRevokeReasonsPushResultAjax {
  readonly id: number;
  readonly projectId: number;
  readonly freelancerId: number;
  readonly reasonId: number;
  readonly otherFeedback: string;
}

// FIXME: What type can this return?
export type BidAwardRevokeReasonsPushErrorAjax = string;

@Injectable({
  providedIn: 'root',
})
export class BidAwardRevokeReasonService {
  constructor(private freelancerHttp: FreelancerHttp) {}
  saveBidAwardRevokeReason(
    revokeReasonRequest: BidAwardRevokeReasonsPostRawPayload,
  ): Promise<
    ResponseData<
      BidAwardRevokeReasonsPushResultAjax,
      BidAwardRevokeReasonsPushErrorAjax
    >
  > {
    const formData = new FormData();
    formData.append('projectId', `${revokeReasonRequest.projectId}`);
    formData.append('freelancerId', `${revokeReasonRequest.freelancerId}`);
    formData.append('reasonId', `${revokeReasonRequest.reasonId}`);
    formData.append('otherFeedback', `${revokeReasonRequest.otherFeedback}`);

    const response$ = this.freelancerHttp
      .post('buyer/saveBidAwardRevokeReason.php', formData, {
        isGaf: true,
      })
      .pipe(share());

    return response$.toPromise();
  }
}

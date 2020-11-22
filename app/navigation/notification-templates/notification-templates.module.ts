import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@freelancer/pipes';
import { TrackingModule } from '@freelancer/tracking';
import { UiModule } from '@freelancer/ui';
import { NotificationTemplateArticleCommentComponent } from './notification-template-article-comment.component';
import { NotificationTemplateAwardBadgeComponent } from './notification-template-award-badge.component';
import { NotificationTemplateAwardCreditComponent } from './notification-template-award-credit.component';
import { NotificationTemplateAwardMilestoneReminderComponent } from './notification-template-award-milestone-reminder.component';
import { NotificationTemplateAwardReminderComponent } from './notification-template-award-reminder.component';
import { NotificationTemplateAwardXpComponent } from './notification-template-award-xp.component';
import { NotificationTemplateAwardComponent } from './notification-template-award.component';
import { NotificationTemplateBidComponent } from './notification-template-bid.component';
import { NotificationTemplateContestEntryAwardedEmployerComponent } from './notification-template-contest-entry-awarded-employer.component';
import { NotificationTemplateContestEntryAwardedFreelancerComponent } from './notification-template-contest-entry-awarded-freelancer.component';
import { NotificationTemplateContestEntryBoughtEmployerComponent } from './notification-template-contest-entry-bought-employer.component';
import { NotificationTemplateContestEntryBoughtFreelancerComponent } from './notification-template-contest-entry-bought-freelancer.component';
import { NotificationTemplateContestEntryCommentedToFreelancerComponent } from './notification-template-contest-entry-commented-to-freelancer.component';
import { NotificationTemplateContestEntryRatedToFreelancerComponent } from './notification-template-contest-entry-rated-to-freelancer.component';
import { NotificationTemplateContestEntryReconsideredToFreelancerComponent } from './notification-template-contest-entry-reconsidered-to-freelancer.component';
import { NotificationTemplateContestEntryRejectedToFreelancerComponent } from './notification-template-contest-entry-rejected-to-freelancer.component';
import { NotificationTemplateContestEntryComponent } from './notification-template-contest-entry.component';
import { NotificationTemplateContestPcbNotificationFullViewComponent } from './notification-template-contest-pcb-notification-full-view.component';
import { NotificationTemplateContestPcbNotificationComponent } from './notification-template-contest-pcb-notification.component';
import { NotificationTemplateCreateMilestoneComponent } from './notification-template-create-milestone.component';
import { NotificationTemplateDefaultComponent } from './notification-template-default.component';
import { NotificationTemplateDenyComponent } from './notification-template-deny.component';
import { NotificationTemplateDraftContestComponent } from './notification-template-draft-contest.component';
import { NotificationTemplateFailingProjectComponent } from './notification-template-failing-project.component';
import { NotificationTemplateFollowerComponent } from './notification-template-follower.component';
import { NotificationTemplateGiveGetChildPartialMilestoneReleaseComponent } from './notification-template-giveget-child-partial-milestone-release.component';
import { NotificationTemplateGiveGetChildReceivedSignupBonusComponent } from './notification-template-giveget-child-received-signup-bonus.component';
import { NotificationTemplateGiveGetChildSignUpComponent } from './notification-template-giveget-child-signup.component';
import { NotificationTemplateGiveGetParentBonusComponent } from './notification-template-giveget-parent-bonus.component';
import { NotificationTemplateInviteToContestComponent } from './notification-template-invite-to-contest.component';
import { NotificationTemplateInviteUserBidComponent } from './notification-template-invite-user-bid.component';
import { NotificationTemplateInvoiceRequestedComponent } from './notification-template-invoice-requested.component';
import { NotificationTemplateLevelUpComponent } from './notification-template-level-up.component';
import { NotificationTemplateProjectCompletedComponent } from './notification-template-project-completed.component';
import { NotificationTemplateProjectFeedComponent } from './notification-template-project-feed.component';
import { NotificationTemplateQuickHireProjectComponent } from './notification-template-quick-hire-project.component';
import { NotificationTemplateReleaseMilestoneComponent } from './notification-template-release-milestone.component';
import { NotificationTemplateRequestEndProjectComponent } from './notification-template-request-end-project.component';
import { NotificationTemplateRequestMilestoneComponent } from './notification-template-request-milestone.component';
import { NotificationTemplateRequestToReleaseComponent } from './notification-template-request-to-release.component';
import { NotificationTemplateServiceApprovedComponent } from './notification-template-service-approved.component';
import { NotificationTemplateServiceProjectEndingComponent } from './notification-template-service-project-ending.component';
import { NotificationTemplateServiceProjectPostedComponent } from './notification-template-service-project-posted.component';
import { NotificationTemplateServiceRejectedComponent } from './notification-template-service-rejected.component';
import { NotificationTemplateShowcaseSourceApprovalComponent } from './notification-template-showcase-source-approval.component';
import { NotificationTemplateSignUpFreeTrialUpsellComponent } from './notification-template-sign-up-free-trial-upsell.component';
import { NotificationTemplateTaskCreateComponent } from './notification-template-task-create.component';

@NgModule({
  imports: [CommonModule, UiModule, TrackingModule, PipesModule],
  declarations: [
    NotificationTemplateArticleCommentComponent,
    NotificationTemplateAwardBadgeComponent,
    NotificationTemplateAwardComponent,
    NotificationTemplateAwardCreditComponent,
    NotificationTemplateAwardMilestoneReminderComponent,
    NotificationTemplateAwardReminderComponent,
    NotificationTemplateAwardXpComponent,
    NotificationTemplateBidComponent,
    NotificationTemplateContestEntryAwardedEmployerComponent,
    NotificationTemplateContestEntryAwardedFreelancerComponent,
    NotificationTemplateContestEntryBoughtEmployerComponent,
    NotificationTemplateContestEntryBoughtFreelancerComponent,
    NotificationTemplateContestEntryCommentedToFreelancerComponent,
    NotificationTemplateContestEntryComponent,
    NotificationTemplateContestEntryRatedToFreelancerComponent,
    NotificationTemplateContestEntryReconsideredToFreelancerComponent,
    NotificationTemplateContestEntryRejectedToFreelancerComponent,
    NotificationTemplateContestPcbNotificationComponent,
    NotificationTemplateContestPcbNotificationFullViewComponent,
    NotificationTemplateCreateMilestoneComponent,
    NotificationTemplateDefaultComponent,
    NotificationTemplateDenyComponent,
    NotificationTemplateDraftContestComponent,
    NotificationTemplateFailingProjectComponent,
    NotificationTemplateFollowerComponent,
    NotificationTemplateGiveGetChildSignUpComponent,
    NotificationTemplateGiveGetChildReceivedSignupBonusComponent,
    NotificationTemplateGiveGetChildPartialMilestoneReleaseComponent,
    NotificationTemplateGiveGetParentBonusComponent,
    NotificationTemplateInviteToContestComponent,
    NotificationTemplateInviteUserBidComponent,
    NotificationTemplateInvoiceRequestedComponent,
    NotificationTemplateLevelUpComponent,
    NotificationTemplateProjectCompletedComponent,
    NotificationTemplateProjectFeedComponent,
    NotificationTemplateQuickHireProjectComponent,
    NotificationTemplateReleaseMilestoneComponent,
    NotificationTemplateRequestEndProjectComponent,
    NotificationTemplateRequestMilestoneComponent,
    NotificationTemplateRequestToReleaseComponent,
    NotificationTemplateServiceApprovedComponent,
    NotificationTemplateServiceProjectEndingComponent,
    NotificationTemplateServiceProjectPostedComponent,
    NotificationTemplateServiceRejectedComponent,
    NotificationTemplateShowcaseSourceApprovalComponent,
    NotificationTemplateSignUpFreeTrialUpsellComponent,
    NotificationTemplateTaskCreateComponent,
  ],
  exports: [
    NotificationTemplateArticleCommentComponent,
    NotificationTemplateAwardBadgeComponent,
    NotificationTemplateAwardComponent,
    NotificationTemplateAwardCreditComponent,
    NotificationTemplateAwardMilestoneReminderComponent,
    NotificationTemplateAwardReminderComponent,
    NotificationTemplateAwardXpComponent,
    NotificationTemplateBidComponent,
    NotificationTemplateContestEntryAwardedEmployerComponent,
    NotificationTemplateContestEntryAwardedFreelancerComponent,
    NotificationTemplateContestEntryBoughtEmployerComponent,
    NotificationTemplateContestEntryBoughtFreelancerComponent,
    NotificationTemplateContestEntryCommentedToFreelancerComponent,
    NotificationTemplateContestEntryComponent,
    NotificationTemplateContestEntryRatedToFreelancerComponent,
    NotificationTemplateContestEntryReconsideredToFreelancerComponent,
    NotificationTemplateContestEntryRejectedToFreelancerComponent,
    NotificationTemplateContestPcbNotificationComponent,
    NotificationTemplateContestPcbNotificationFullViewComponent,
    NotificationTemplateCreateMilestoneComponent,
    NotificationTemplateDefaultComponent,
    NotificationTemplateDenyComponent,
    NotificationTemplateDraftContestComponent,
    NotificationTemplateFailingProjectComponent,
    NotificationTemplateFollowerComponent,
    NotificationTemplateGiveGetChildPartialMilestoneReleaseComponent,
    NotificationTemplateGiveGetChildReceivedSignupBonusComponent,
    NotificationTemplateGiveGetChildSignUpComponent,
    NotificationTemplateGiveGetParentBonusComponent,
    NotificationTemplateInviteToContestComponent,
    NotificationTemplateInviteUserBidComponent,
    NotificationTemplateInvoiceRequestedComponent,
    NotificationTemplateLevelUpComponent,
    NotificationTemplateProjectCompletedComponent,
    NotificationTemplateProjectFeedComponent,
    NotificationTemplateQuickHireProjectComponent,
    NotificationTemplateReleaseMilestoneComponent,
    NotificationTemplateRequestEndProjectComponent,
    NotificationTemplateRequestMilestoneComponent,
    NotificationTemplateRequestToReleaseComponent,
    NotificationTemplateServiceApprovedComponent,
    NotificationTemplateServiceProjectEndingComponent,
    NotificationTemplateServiceProjectPostedComponent,
    NotificationTemplateServiceRejectedComponent,
    NotificationTemplateShowcaseSourceApprovalComponent,
    NotificationTemplateSignUpFreeTrialUpsellComponent,
    NotificationTemplateTaskCreateComponent,
  ],
})
export class NotificationTemplatesModule {}

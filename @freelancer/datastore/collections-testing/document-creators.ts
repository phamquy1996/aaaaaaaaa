import { AuthServiceInterface } from '@freelancer/auth';
import {
  BannersCollection,
  BidRestrictionsCollection,
  BidsCollection,
  BidSummariesCollection,
  BidUpgradeFeesCollection,
  BillingAgreementsCollection,
  CategoryPageContentCollection,
  CertificationsCollection,
  ContestBudgetRangesCollection,
  ContestEntriesCollection,
  ContestFeesCollection,
  ContestQuickviewEntriesCollection,
  ContestsCollection,
  ContestViewContestsCollection,
  ContestViewEntriesCollection,
  ContestViewEntryIdsCollection,
  CountriesCollection,
  CurrenciesCollection,
  CustomFieldInfoConfigurationsCollection,
  DashboardWidgetsCollection,
  DomainsCollection,
  EducationsCollection,
  EncodedUrlCollection,
  ExchangeRatesCollection,
  ExperiencesCollection,
  FeedCollection,
  FeedMetaCollection,
  FeedPostsCollection,
  FreelancerReputationsCollection,
  FreelancerReputationsRehireRatesCollection,
  generateBannerObjects,
  generateBidObjects,
  generateBidRestrictionsObject,
  GenerateBidRestrictionsOptions,
  GenerateBidsOptions,
  generateBidSummariesObject,
  GenerateBidSummariesOptions,
  generateBidUpgradeFeesObject,
  GenerateBidUpgradeFeesOptions,
  generateBillingAgreementObject,
  GenerateBillingAgreementOptions,
  generateCategoryPageContent,
  GenerateCategoryPageContentOptions,
  generateCertificationObject,
  GenerateCertificationOptions,
  generateContestBudgetRangesObjects,
  GenerateContestEntriesOptions,
  generateContestEntryObject,
  generateContestEntryObjects,
  GenerateContestEntryOptions,
  generateContestFeesObject,
  GenerateContestFeesOptions,
  generateContestObject,
  GenerateContestOptions,
  GenerateContestQuickviewEntriesOptions,
  generateContestQuickviewEntryObjects,
  generateContestViewContestObject,
  GenerateContestViewContestOptions,
  GenerateContestViewEntriesOptions,
  generateContestViewEntryIdsObject,
  GenerateContestViewEntryIdsOptions,
  generateContestViewEntryObjects,
  generateCountryObjects,
  GenerateCountryOptions,
  generateCurrencyObjects,
  generateCustomFieldInfoConfigurationObjects,
  GenerateCustomFieldInfoConfigurationOptions,
  generateDashboardWidgetObjects,
  GenerateDashboardWidgetsOptions,
  generateDomainObject,
  generateEducationObject,
  GenerateEducationOptions,
  generateEncodedUrlObject,
  GenerateEncodedUrlOptions,
  generateExchangeRateObject,
  GenerateExchangeRatesOptions,
  generateExperienceObject,
  GenerateExperienceOptions,
  generateFeedMetaObjects,
  GenerateFeedMetaOptions,
  generateFeedObject,
  GenerateFeedOptions,
  generateFeedPostObjects,
  GenerateFeedPostsOptions,
  generateFreelancerReputationsObjects,
  GenerateFreelancerReputationsOptions,
  generateFreelancerReputationsRehireRatesObjects,
  GenerateGrantItemOptions,
  generateGrantsObjects,
  GenerateGroupMemberOptions,
  generateGroupMembersObject,
  GenerateGroupOptions,
  generateGroupPermissionsObject,
  GenerateGroupPermissionsOptions,
  GenerateGroupSelfOptions,
  generateGroupsObject,
  generateGroupsSelf,
  generateHourlyContractObject,
  GenerateHourlyContractOptions,
  generateLanguagesObject,
  generateManageViewOpenBidsObjects,
  GenerateManageViewOpenBidsOptions,
  generateMembershipBenefitObject,
  GenerateMembershipBenefitOptions,
  generateMessage,
  GenerateMessageOptions,
  generateMessages,
  GenerateMessagesOptions,
  generateMilestoneObject,
  GenerateMilestoneOptions,
  generateNotificationAcceptedObject,
  generateNotificationAwardObject,
  GenerateNotificationAwardOptions,
  generateNotificationBidObject,
  GenerateNotificationBidOptions,
  generateNotificationPreferenceObjects,
  GenerateNotificationPreferenceObjectsOptions,
  GenerateNotificationProjectAcceptedOptions,
  generateOnBehalfProject,
  GenerateOnBehalfProjectOptions,
  generateOnlineOfflineObjects,
  GenerateOnlineOfflineOptions,
  generatePortfolioObject,
  generatePortfolioObjects,
  GeneratePortfolioOptions,
  GeneratePortfoliosOptions,
  generatePredictedSkillsObject,
  GeneratePredictedSkillsOptions,
  generatePreferredBillingAgreementObject,
  GeneratePreferredBillingAgreementOptions,
  generateProfileViewUserObject,
  generateProfileViewUserObjects,
  GenerateProfileViewUserOptions,
  GenerateProfileViewUsersOptions,
  generateProjectBidInfoObject,
  GenerateProjectBidInfoOptions,
  generateProjectBookmarkObject,
  GenerateProjectBookmarkOptions,
  generateProjectBudgetOptions,
  GenerateProjectBudgetOptionsOptions,
  generateProjectCollaborationObject,
  generateProjectCollaborationObjects,
  GenerateProjectCollaborationOptions,
  GenerateProjectCollaborationsOptions,
  generateProjectFeedObjects,
  GenerateProjectFeedOptions,
  generateProjectObject,
  GenerateProjectOptions,
  generateProjectUpgradeFeeObjects,
  GenerateProjectUpgradeFeesOptions,
  generateProjectViewBidObjects,
  GenerateProjectViewBidsOptions,
  generateProjectViewProjectObject,
  GenerateProjectViewProjectOptions,
  generateProjectViewUserObject,
  generateProjectViewUserObjects,
  GenerateProjectViewUserOptions,
  GenerateProjectViewUsersOptions,
  generatePublicationObject,
  GeneratePublicationOptions,
  generateRecentProjectsAndContestsObjects,
  GenerateRecentProjectsAndContestsOptions,
  generateReferralInvitationCheckObject,
  GenerateReferralInvitationCheckOptions,
  generateReviewObject,
  GenerateReviewOptions,
  generateSimilarFreelancersObject,
  GenerateSimilarFreelancersOptions,
  generateSimilarShowcasesObject,
  GenerateSimilarShowcasesOptions,
  generateSiteStatsObject,
  GenerateSiteStatsOptions,
  generateSkillObjects,
  generateSuggestedSkillsObject,
  GenerateSuggestedSkillsOptions,
  generateTaxObject,
  GenerateTaxOptions,
  generateThread,
  GenerateThreadsOptions,
  generateTimeTrackingPunches,
  GenerateTimeTrackingPunchesOptions,
  generateTimeTrackingSession,
  GenerateTimeTrackingSessionOptions,
  generateTopSkillObjects,
  GenerateTopSkillsOptions,
  generateUniversityObjects,
  GenerateUniversityOptions,
  generateUserBalanceObjects,
  generateUserBidLimitObject,
  GenerateUserBidLimitOptions,
  GenerateUserCalifornianStatusesOptions,
  generateUserCalifornianStatusObjects,
  generateUserGiveGetDetailsObject,
  GenerateUserGiveGetDetailsOptions,
  generateUserHasGivenFeedbackObject,
  GenerateUserHasGivenFeedbackOptions,
  generateUserInfoObject,
  GenerateUserInfoOptions,
  generateUserObject,
  generateUserObjects,
  GenerateUserOptions,
  generateUserProfileObject,
  generateUserRequiresGdprObject,
  GenerateUserRequiresGdprOptions,
  generateUserSelfObject,
  GenerateUserSelfOptions,
  generateUsersLocationObject,
  GenerateUsersLocationOptions,
  GenerateUsersOptions,
  GenerateUsersProfileOptions,
  GrantsCollection,
  GroupMembersCollection,
  GroupPermissionsCollection,
  GroupsCollection,
  GroupsSelfCollection,
  HourlyContractsCollection,
  LanguagesCollection,
  ManageViewOpenBidsCollection,
  MembershipBenefitsCollection,
  MessagesCollection,
  MilestonesCollection,
  NewsfeedCollection,
  NotificationsPreferencesCollection,
  OnBehalfProjectsCollection,
  OnlineOfflineCollection,
  PortfoliosCollection,
  PredictedSkillsCollection,
  PreferredBillingAgreementsCollection,
  ProfileViewUsersCollection,
  ProjectBidInfoCollection,
  ProjectBookmarksCollection,
  ProjectBudgetOptionsCollection,
  ProjectCollaborationsCollection,
  ProjectFeedCollection,
  ProjectsCollection,
  ProjectUpgradeFeesCollection,
  ProjectViewBidsCollection,
  ProjectViewProjectsCollection,
  ProjectViewUsersCollection,
  PublicationsCollection,
  ReferralInvitationCheckCollection,
  ReviewsCollection,
  SimilarFreelancersCollection,
  SimilarShowcasesCollection,
  SiteStatsCollection,
  SkillsCollection,
  SuggestedSkillsCollection,
  TaxCollection,
  ThreadsCollection,
  TimeTrackingPunchesCollection,
  TimeTrackingSessionCollection,
  TopSkillsCollection,
  UniversitiesCollection,
  UserBalancesCollection,
  UserBidLimitCollection,
  UserCalifornianStatusesCollection,
  UserGiveGetDetailsCollection,
  UserHasGivenFeedbackCollection,
  UserInfoCollection,
  UserRecentProjectsAndContestsCollection,
  UserRequiresGdprCollection,
  UsersCollection,
  UsersLocationCollection,
  UsersProfileCollection,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import {
  DatastoreCollectionType,
  DatastoreFetchCollectionType,
  DatastorePushCollectionType,
  DatastoreUpdateCollectionType,
} from '@freelancer/datastore/core';
import {
  DatastoreTestingController,
  generateId,
  MutationPropagator,
  PushTransformer,
  RequestErrorCode,
  SearchTransformer,
  UpdateTransformer,
} from '@freelancer/datastore/testing';
import { take } from 'rxjs/operators';

let globalAuth: AuthServiceInterface | undefined;
let globalDatastoreController: DatastoreTestingController | undefined;

function getAuth(): AuthServiceInterface {
  if (!globalAuth) {
    throw new Error('Missing Auth. Did you forget to call `setAuth()?`');
  }

  return globalAuth;
}

export function setAuth(auth: AuthServiceInterface) {
  globalAuth = auth;
}

function getDatastoreController(): DatastoreTestingController {
  if (!globalDatastoreController) {
    throw new Error('Missing Datastore. Did you forget to call `setAuth()?`');
  }

  return globalDatastoreController;
}

export function setDatastoreController(
  datastoreController: DatastoreTestingController,
) {
  globalDatastoreController = datastoreController;
}

function createDoc<
  C extends DatastoreCollectionType,
  Config,
  DocumentType extends C['DocumentType'] = C['DocumentType']
>(
  collectionName: C['Name'],
  generateDocument: (config?: Config) => DocumentType,
): (config?: Config) => Promise<DocumentType>;
function createDoc<
  C extends DatastoreCollectionType,
  Config,
  DocumentType extends C['DocumentType'] = C['DocumentType']
>(
  collectionName: C['Name'],
  generateDocument: (config: Config) => DocumentType,
): (config: Config) => Promise<DocumentType>;
function createDoc<
  C extends DatastoreCollectionType,
  Config,
  DocumentType extends C['DocumentType'] = C['DocumentType']
>(
  collectionName: C['Name'],
  generateDocument: (config: Config) => DocumentType,
): (config: Config) => Promise<DocumentType> {
  return async (config: Config) => {
    const document = generateDocument(config);
    await getDatastoreController().createRawDocument(collectionName, document);
    return document;
  };
}

function createDocs<
  C extends DatastoreCollectionType,
  Config,
  DocumentType extends C['DocumentType'] = C['DocumentType']
>(
  collectionName: C['Name'],
  generateDocuments: (config?: Config) => ReadonlyArray<DocumentType>,
): (config?: Config) => Promise<ReadonlyArray<DocumentType>>;
function createDocs<
  C extends DatastoreCollectionType,
  Config,
  DocumentType extends C['DocumentType'] = C['DocumentType']
>(
  collectionName: C['Name'],
  generateDocuments: (config: Config) => ReadonlyArray<DocumentType>,
): (config: Config) => Promise<ReadonlyArray<DocumentType>>;
function createDocs<
  C extends DatastoreCollectionType,
  Config,
  DocumentType extends C['DocumentType'] = C['DocumentType']
>(
  collectionName: C['Name'],
  generateDocuments: (config: Config) => ReadonlyArray<DocumentType>,
): (config: Config) => Promise<ReadonlyArray<DocumentType>> {
  return async (config: Config) => {
    const documents = generateDocuments(config);
    await Promise.all(
      documents.map(document =>
        getDatastoreController().createRawDocument(collectionName, document),
      ),
    );
    return documents;
  };
}

// #region Controller functions

export function createRawDocument<
  C extends DatastoreCollectionType & DatastorePushCollectionType
>(collectionName: C['Name'], document: C['DocumentType']) {
  return getDatastoreController().createRawDocument<C>(
    collectionName,
    document,
  );
}

export function resetDatastoreState<C extends DatastoreCollectionType>(
  collectionName?: C['Name'],
) {
  return getDatastoreController().resetState<C>(collectionName);
}

export function printDatastoreState() {
  return getDatastoreController().printState();
}

export function addMutationPropagator<
  C1 extends DatastoreCollectionType & DatastorePushCollectionType,
  C2 extends DatastoreCollectionType & DatastorePushCollectionType
>(propagator: MutationPropagator<C1, C2>) {
  return getDatastoreController().addMutationPropagator<C1, C2>(propagator);
}

export function addPushTransformer<
  C extends DatastoreCollectionType & DatastorePushCollectionType
>(collectionName: C['Name'], transformer: PushTransformer<C>) {
  return getDatastoreController().addPushTransformer<C>(
    collectionName,
    transformer,
  );
}

export function addUpdateTransformer<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
>(collectionName: C['Name'], transformer: UpdateTransformer<C>) {
  return getDatastoreController().addUpdateTransformer<C>(
    collectionName,
    transformer,
  );
}

export function addSearchTransformer<C extends DatastoreCollectionType>(
  collectionName: C['Name'],
  transformer: SearchTransformer<C>,
) {
  return getDatastoreController().addSearchTransformer<C>(
    collectionName,
    transformer,
  );
}

export function makeCollectionFail<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
>(collectionName: C['Name'], errorCode: RequestErrorCode<C> = 'UNKNOWN_ERROR') {
  return getDatastoreController().makeCollectionFail<C>(
    collectionName,
    errorCode,
  );
}

export function makeCollectionPending<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
>(collectionName: C['Name']) {
  return getDatastoreController().makeCollectionPending<C>(collectionName);
}

// #endregion Controller functions

// #region Helper functions for creating account.

export async function signup(userOptions: GenerateUserOptions = {}) {
  const userId = userOptions.userId || generateId();

  const isLoggedIn = await getAuth()
    .isLoggedIn()
    .pipe(take(1))
    .toPromise();
  if (!isLoggedIn) {
    console.warn(
      `User ${userId} has been created before calling signupAndLogin - it will not be visible to logged in users`,
    );
  }

  const user = await createDoc<UsersCollection, GenerateUserOptions>(
    'users',
    generateUserObject,
  )({ userId, ...userOptions });

  return user;
}

export async function signupAndLogin(
  userOptions: GenerateUserOptions = {},
  userSelfOptions: GenerateUserSelfOptions = {},
) {
  // We have to "login" first because otherwise the datastore documents are not
  // accessible to the user that just signed up. See `signup()`

  // Log in
  const userId = userOptions.userId || generateId();
  getAuth().setSession(userId.toString(), '');

  const user = await createDoc<UsersCollection, GenerateUserOptions>(
    'users',
    generateUserObject,
  )({ userId, ...userOptions });

  await createDoc<UsersSelfCollection, GenerateUserOptions>(
    'usersSelf',
    generateUserSelfObject,
  )({ userId, ...userSelfOptions });

  return user;
}

// #endregion Helper functions for creating account.

// #region Single object creation functions. These should all be singular.

export const createBidRestriction = createDoc<
  BidRestrictionsCollection,
  GenerateBidRestrictionsOptions
>('bidRestrictions', generateBidRestrictionsObject);

export const createBidSummary = createDoc<
  BidSummariesCollection,
  GenerateBidSummariesOptions
>('bidSummaries', generateBidSummariesObject);

export const createBidUpgradeFee = createDoc<
  BidUpgradeFeesCollection,
  GenerateBidUpgradeFeesOptions
>('bidUpgradeFees', generateBidUpgradeFeesObject);

export const createBillingAgreement = createDoc<
  BillingAgreementsCollection,
  GenerateBillingAgreementOptions
>('billingAgreements', generateBillingAgreementObject);

export const createCategoryPageContent = createDoc<
  CategoryPageContentCollection,
  GenerateCategoryPageContentOptions
>('categoryPageContent', generateCategoryPageContent);

export const createCertification = createDoc<
  CertificationsCollection,
  GenerateCertificationOptions
>('certifications', generateCertificationObject);

export const createContest = createDoc<
  ContestsCollection,
  GenerateContestOptions
>('contests', generateContestObject);

export const createContestEntry = createDoc<
  ContestEntriesCollection,
  GenerateContestEntryOptions
>('contestEntries', generateContestEntryObject);

export const createContestViewContest = createDoc<
  ContestViewContestsCollection,
  GenerateContestViewContestOptions
>('contestViewContests', generateContestViewContestObject);

export const createDomain = createDoc<DomainsCollection, {}>(
  'domains',
  generateDomainObject,
);

export const createEducation = createDoc<
  EducationsCollection,
  GenerateEducationOptions
>('educations', generateEducationObject);

export const createEncodedUrl = createDoc<
  EncodedUrlCollection,
  GenerateEncodedUrlOptions
>('encodedUrl', generateEncodedUrlObject);

export const createExperience = createDoc<
  ExperiencesCollection,
  GenerateExperienceOptions
>('experiences', generateExperienceObject);

export const createHourlyContract = createDoc<
  HourlyContractsCollection,
  GenerateHourlyContractOptions
>('hourlyContracts', generateHourlyContractObject);

export const createLanguage = createDoc<LanguagesCollection, {}>(
  'languages',
  generateLanguagesObject,
);

export const createMembershipBenefit = createDoc<
  MembershipBenefitsCollection,
  GenerateMembershipBenefitOptions
>('membershipBenefits', generateMembershipBenefitObject);

export const createMessage = createDoc<
  MessagesCollection,
  GenerateMessageOptions
>('messages', generateMessage);

export const createMilestone = createDoc<
  MilestonesCollection,
  GenerateMilestoneOptions
>('milestones', generateMilestoneObject);

export const createNewsfeedProjectAccepted = createDoc<
  NewsfeedCollection,
  GenerateNotificationProjectAcceptedOptions,
  ReturnType<typeof generateNotificationAcceptedObject>
>('newsfeed', generateNotificationAcceptedObject);

export const createNewsfeedProjectAwarded = createDoc<
  NewsfeedCollection,
  GenerateNotificationAwardOptions,
  ReturnType<typeof generateNotificationAwardObject>
>('newsfeed', generateNotificationAwardObject);

export const createNewsfeedProjectBidOn = createDoc<
  NewsfeedCollection,
  GenerateNotificationBidOptions,
  ReturnType<typeof generateNotificationBidObject>
>('newsfeed', generateNotificationBidObject);

/* This actually creates a single portfolio item, not a whole portfolio */
export const createPortfolio = createDoc<
  PortfoliosCollection,
  GeneratePortfolioOptions
>('portfolios', generatePortfolioObject);

export const createProfileViewUser = createDoc<
  ProfileViewUsersCollection,
  GenerateProfileViewUserOptions
>('profileViewUsers', generateProfileViewUserObject);

export const createProjectBidInfo = createDoc<
  ProjectBidInfoCollection,
  GenerateProjectBidInfoOptions
>('projectBidInfo', generateProjectBidInfoObject);

export const createProjectBookmark = createDoc<
  ProjectBookmarksCollection,
  GenerateProjectBookmarkOptions
>('projectBookmarks', generateProjectBookmarkObject);

export const createProject = createDoc<
  ProjectsCollection,
  GenerateProjectOptions
>('projects', generateProjectObject);

export const createProjectViewProject = createDoc<
  ProjectViewProjectsCollection,
  GenerateProjectViewProjectOptions
>('projectViewProjects', generateProjectViewProjectObject);

export const createProjectViewUser = createDoc<
  ProjectViewUsersCollection,
  GenerateProjectViewUserOptions
>('projectViewUsers', generateProjectViewUserObject);

export const createPublication = createDoc<
  PublicationsCollection,
  GeneratePublicationOptions
>('publications', generatePublicationObject);

export const createReview = createDoc<ReviewsCollection, GenerateReviewOptions>(
  'reviews',
  generateReviewObject,
);

export const createReferralInvitationCheck = createDoc<
  ReferralInvitationCheckCollection,
  GenerateReferralInvitationCheckOptions
>('referralInvitationCheck', generateReferralInvitationCheckObject);

export const createSimilarFreelancers = createDoc<
  SimilarFreelancersCollection,
  GenerateSimilarFreelancersOptions
>('similarFreelancers', generateSimilarFreelancersObject);

export const createSimilarShowcases = createDoc<
  SimilarShowcasesCollection,
  GenerateSimilarShowcasesOptions
>('similarShowcases', generateSimilarShowcasesObject);

export const createSiteStat = createDoc<
  SiteStatsCollection,
  GenerateSiteStatsOptions
>('siteStats', generateSiteStatsObject);

export const createSuggestedSkills = createDoc<
  SuggestedSkillsCollection,
  GenerateSuggestedSkillsOptions
>('suggestedSkills', generateSuggestedSkillsObject);

export const createTax = createDoc<TaxCollection, GenerateTaxOptions>(
  'tax',
  generateTaxObject,
);

export const createTimeTrackingPunches = createDocs<
  TimeTrackingPunchesCollection,
  GenerateTimeTrackingPunchesOptions
>('timeTrackingPunches', generateTimeTrackingPunches);

export const createTimeTrackingSession = createDoc<
  TimeTrackingSessionCollection,
  GenerateTimeTrackingSessionOptions
>('timeTrackingSession', generateTimeTrackingSession);

export const createThread = createDoc<
  ThreadsCollection,
  GenerateThreadsOptions
>('threads', generateThread);

export const createUserBidLimit = createDoc<
  UserBidLimitCollection,
  GenerateUserBidLimitOptions
>('userBidLimit', generateUserBidLimitObject);

export const createUserGiveGetDetail = createDoc<
  UserGiveGetDetailsCollection,
  GenerateUserGiveGetDetailsOptions
>('userGiveGetDetails', generateUserGiveGetDetailsObject);

export const createUserHasGivenFeedback = createDoc<
  UserHasGivenFeedbackCollection,
  GenerateUserHasGivenFeedbackOptions
>('userHasGivenFeedback', generateUserHasGivenFeedbackObject);

export const createUserInfo = createDoc<
  UserInfoCollection,
  GenerateUserInfoOptions
>('userInfo', generateUserInfoObject);

export const createUserLocation = createDoc<
  UsersLocationCollection,
  GenerateUsersLocationOptions
>('usersLocation', generateUsersLocationObject);

export const createUserRequiresGdpr = createDoc<
  UserRequiresGdprCollection,
  GenerateUserRequiresGdprOptions
>('userRequiresGdpr', generateUserRequiresGdprObject);

export const createUser = createDoc<UsersCollection, GenerateUserOptions>(
  'users',
  generateUserObject,
);

export const createUsersProfile = createDoc<
  UsersProfileCollection,
  GenerateUsersProfileOptions
>('usersProfile', generateUserProfileObject);

export const createUsersSelf = createDoc<
  UsersSelfCollection,
  GenerateUserOptions
>('usersSelf', generateUserSelfObject);

// #endregion Single object creation functions. These should all be singular.

// #region Multiple object creation functions. These should all be plural.

export const createBanners = createDocs<BannersCollection, {}>(
  'banners',
  generateBannerObjects,
);

export const createBids = createDocs<BidsCollection, GenerateBidsOptions>(
  'bids',
  generateBidObjects,
);

export const createProjectCollaboration = createDoc<
  ProjectCollaborationsCollection,
  GenerateProjectCollaborationOptions
>('projectCollaborations', generateProjectCollaborationObject);

export const createProjectCollaborations = createDocs<
  ProjectCollaborationsCollection,
  GenerateProjectCollaborationsOptions
>('projectCollaborations', generateProjectCollaborationObjects);

export const createContestEntries = createDocs<
  ContestEntriesCollection,
  GenerateContestEntriesOptions
>('contestEntries', generateContestEntryObjects);

export const createContestViewEntryIds = createDoc<
  ContestViewEntryIdsCollection,
  GenerateContestViewEntryIdsOptions
>('contestViewEntryIds', generateContestViewEntryIdsObject);

export const createContestFees = createDoc<
  ContestFeesCollection,
  GenerateContestFeesOptions
>('contestFees', generateContestFeesObject);

export const createContestQuickviewEntries = createDocs<
  ContestQuickviewEntriesCollection,
  GenerateContestQuickviewEntriesOptions
>('contestQuickviewEntries', generateContestQuickviewEntryObjects);

export const createContestViewEntries = createDocs<
  ContestViewEntriesCollection,
  GenerateContestViewEntriesOptions
>('contestViewEntries', generateContestViewEntryObjects);

export const createContestBudgetRanges = createDocs<
  ContestBudgetRangesCollection,
  {}
>('contestBudgetRanges', generateContestBudgetRangesObjects);

export const createCountries = createDocs<
  CountriesCollection,
  GenerateCountryOptions
>('countries', generateCountryObjects);

export const createCurrencies = createDocs<CurrenciesCollection, {}>(
  'currencies',
  generateCurrencyObjects,
);

export const createDashboardWidgets = createDocs<
  DashboardWidgetsCollection,
  GenerateDashboardWidgetsOptions
>('dashboardWidgets', generateDashboardWidgetObjects);

export const createExchangeRates = createDocs<
  ExchangeRatesCollection,
  GenerateExchangeRatesOptions
>('exchangeRates', (options: GenerateExchangeRatesOptions) =>
  options.currencyCodes.map(generateExchangeRateObject),
);

export const createFreelancerReputations = createDocs<
  FreelancerReputationsCollection,
  GenerateFreelancerReputationsOptions
>('freelancerReputations', generateFreelancerReputationsObjects);

export const createFreelancerReputationsRehireRates = createDocs<
  FreelancerReputationsRehireRatesCollection,
  GenerateFreelancerReputationsOptions
>(
  'freelancerReputationsRehireRates',
  generateFreelancerReputationsRehireRatesObjects,
);

export const createManageViewOpenBids = createDocs<
  ManageViewOpenBidsCollection,
  GenerateManageViewOpenBidsOptions
>('manageViewOpenBids', generateManageViewOpenBidsObjects);

export const createMessages = createDocs<
  MessagesCollection,
  GenerateMessagesOptions
>('messages', generateMessages);

export const createNotificationsPreferences = createDocs<
  NotificationsPreferencesCollection,
  GenerateNotificationPreferenceObjectsOptions
>('notificationsPreferences', generateNotificationPreferenceObjects);

export const createOnlineOffline = createDocs<
  OnlineOfflineCollection,
  GenerateOnlineOfflineOptions
>('onlineOffline', generateOnlineOfflineObjects);

/* This actually creates a list of portfolio items, not multiple portfolios */
export const createPortfolios = createDocs<
  PortfoliosCollection,
  GeneratePortfoliosOptions
>('portfolios', generatePortfolioObjects);

export const createPredictedSkill = createDoc<
  PredictedSkillsCollection,
  GeneratePredictedSkillsOptions
>('predictedSkills', generatePredictedSkillsObject);

export const createPreferredBillingAgreement = createDoc<
  PreferredBillingAgreementsCollection,
  GeneratePreferredBillingAgreementOptions
>('preferredBillingAgreements', generatePreferredBillingAgreementObject);

export const createProfileViewUsers = createDocs<
  ProfileViewUsersCollection,
  GenerateProfileViewUsersOptions
>('profileViewUsers', generateProfileViewUserObjects);

export const createProjectBudgetOptions = createDocs<
  ProjectBudgetOptionsCollection,
  GenerateProjectBudgetOptionsOptions
>('projectBudgetOptions', generateProjectBudgetOptions);

export const createProjectFeed = createDocs<
  ProjectFeedCollection,
  GenerateProjectFeedOptions
>('projectFeed', generateProjectFeedObjects);

export const createProjectUpgradeFees = createDocs<
  ProjectUpgradeFeesCollection,
  GenerateProjectUpgradeFeesOptions
>('projectUpgradeFees', generateProjectUpgradeFeeObjects);

export const createProjectViewBids = createDocs<
  ProjectViewBidsCollection,
  GenerateProjectViewBidsOptions
>('projectViewBids', generateProjectViewBidObjects);

export const createProjectViewUsers = createDocs<
  ProjectViewUsersCollection,
  GenerateProjectViewUsersOptions
>('projectViewUsers', generateProjectViewUserObjects);

export const createSkills = createDocs<SkillsCollection, {}>(
  'skills',
  generateSkillObjects,
);

export const createTopSkills = createDocs<
  TopSkillsCollection,
  GenerateTopSkillsOptions
>('topSkills', generateTopSkillObjects);

export const createUniversities = createDocs<
  UniversitiesCollection,
  GenerateUniversityOptions
>('universities', generateUniversityObjects);

export const createUserBalances = createDocs<UserBalancesCollection, {}>(
  'userBalances',
  generateUserBalanceObjects,
);

export const createUserCalifornianStatuses = createDocs<
  UserCalifornianStatusesCollection,
  GenerateUserCalifornianStatusesOptions
>('userCalifornianStatuses', generateUserCalifornianStatusObjects);

export const createUserRecentProjectsAndContests = createDocs<
  UserRecentProjectsAndContestsCollection,
  GenerateRecentProjectsAndContestsOptions
>('userRecentProjectsAndContests', generateRecentProjectsAndContestsObjects);

export const createUsers = createDocs<UsersCollection, GenerateUsersOptions>(
  'users',
  generateUserObjects,
);

export const createOnBehalfProject = createDoc<
  OnBehalfProjectsCollection,
  GenerateOnBehalfProjectOptions
>('onBehalfProjects', generateOnBehalfProject);

export const createCustomFieldInfoConfigurations = createDocs<
  CustomFieldInfoConfigurationsCollection,
  ReadonlyArray<GenerateCustomFieldInfoConfigurationOptions>
>('customFieldInfoConfigurations', generateCustomFieldInfoConfigurationObjects);

export const createGroups = createDocs<
  GroupsCollection,
  ReadonlyArray<GenerateGroupOptions>
>('groups', generateGroupsObject);

export const createGroupsSelf = createDocs<
  GroupsSelfCollection,
  GenerateGroupSelfOptions
>('groupsSelf', generateGroupsSelf);

export const createGroupMembers = createDocs<
  GroupMembersCollection,
  ReadonlyArray<GenerateGroupMemberOptions>
>('groupMembers', generateGroupMembersObject);

export const createGroupPermissions = createDocs<
  GroupPermissionsCollection,
  GenerateGroupPermissionsOptions
>('groupPermissions', generateGroupPermissionsObject);

export const createFeedPost = createDoc<
  FeedPostsCollection,
  GenerateFeedPostsOptions
>('feedPosts', generateFeedPostObjects);

export const createFeedMeta = createDoc<
  FeedMetaCollection,
  GenerateFeedMetaOptions
>('feedMeta', generateFeedMetaObjects);

export const createFeedItem = createDoc<FeedCollection, GenerateFeedOptions>(
  'feed',
  generateFeedObject,
);

export const createGrants = createDocs<
  GrantsCollection,
  ReadonlyArray<GenerateGrantItemOptions>
>('grants', generateGrantsObjects);

// #endregion Multiple object creation functions. These should all be plural.

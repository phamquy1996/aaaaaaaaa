import { ProjectBudgetOption } from '../project-budget-options/project-budget-options.model';
import { Skill } from '../skills/skills.model';

/**
 * This stores the value of the fields in PJP which can be saved as a draft.
 * It consist of fields for both Projects and Contests. In the DB, this is
 * stored as a stringified JSON in the `draft` table.
 *
 * Note that all fields are nullable except for the id, title, and description.
 * An id is required for the documents that we keep in the datastore. Also, we
 * only begin saving drafts when there's a title and description.
 *
 * Additionally, the reason for choosing `null` over `undefined` is that the
 * field whose value is `undefined` gets removed from the resulting string when
 * we `JSON.stringify` the object. We want to avoid having inconsistent format
 * in the DB so we used `null` instead.
 *
 * There is also an inconsistent type for contestUpgrades where it initially
 * contains `ContestUpgrade`. When the contest type card is selected, it now
 * contains an array of selected upgrades (T92144).
 *
 * Lastly, the corresponding type of the following fields are currently defined
 * in `JobPostModule`. In order to declare the types properly, we must move
 * the definitions to a model file so that they can be imported here (T92109):
 * - contestDurationType: DurationType
 * - jobType: JobType
 * - projectBudgetType: BudgetType
 */
export interface PostJobPageFormState {
  readonly communitySelection?: CommunityListItem;
  readonly contestDuration: number | null;
  readonly contestDurationType: string | null;
  readonly contestPrize: number | null;
  readonly contestType: ContestUpgradeCardOption | null;
  readonly currencyId: number | null;
  readonly description: string;
  readonly hasBillingCode?: boolean | null;
  readonly billingCode?: string | null;
  readonly audience?: AudienceType | null;
  readonly id: number;
  readonly isLocal: boolean | null;
  readonly jobType: string | null;
  readonly projectBudgetRange: ProjectBudgetOption | null;
  readonly projectBudgetType: string | null;
  readonly projectType: ProjectUpgradeCardOption | null;
  readonly skills: ReadonlyArray<Skill> | null;
  readonly submitDate: number | null;
  readonly templateSelection?: TemplateListItem;
  readonly title: string;
  readonly userId: number;
}

/**
 * This is to store the state of the AFLN PJP form state in order to save as a draft. The fields have `null`
 * because when you call `.reset()` on the form group, the form controls in it are all set to `null`
 * as the default value unless overridden.
 */
export interface ArrowPostJobFormState {
  readonly ownershipType?: OwnershipType | null;
  readonly ownershipUser?: string | null;
  readonly ownershipHasPartner?: boolean | null;
  readonly ownershipPartner?: string | null;
  readonly title: string | null;
  readonly description: string | null;
  readonly ndaHiddenDescription: string | null;
  readonly skills: ReadonlyArray<Skill>;
  readonly hasDeadline: boolean;
  readonly startDate?: Date;
  readonly completionDate?: Date | null;
  readonly audience?: string | null;
  readonly budgetType: string | null;
  readonly currencyId: number;
  readonly budget:
    | {
        readonly minimum: number | null;
        readonly maximum?: number | null;
      }
    | string
    | null;
  readonly customBudget?: {
    readonly minimum: number | string | null;
    readonly maximum: number | string | null;
  };
  readonly upgrades: { readonly [key: string]: boolean };
}

export enum ContestUpgradeCardOption {
  BASIC = 'basic',
  GUARANTEED = 'guaranteed',
}

export enum ProjectUpgradeCardOption {
  STANDARD = 'standard',
  RECRUITER = 'recruiter',
}

export enum OwnershipType {
  SELF = 'self',
  OTHER_USER = 'otherUser',
}

export enum CommunityListItem {
  FACEBOOK = 'facebook',
  FREELANCER = 'freelancer',
}

export enum TemplateListItem {
  FACEBOOK_PIXEL = 'facebook-pixel',
  FACEBOOK_PIXEL_AND_CATALOG = 'facebook-pixel-and-catalog',
  ADVANCED_MATCHING = 'advanced-matching',
  OTHER = 'other',
}
// TODO: Change this to be generic (Maybe internal/external).
export enum AudienceType {
  FLNLTD = 'flnltd',
  FLNLTD_AND_MARKETPLACE = 'flnltd_and_marketplace',
}

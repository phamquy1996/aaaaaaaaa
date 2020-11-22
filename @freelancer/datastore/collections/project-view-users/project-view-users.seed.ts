import { mapValues } from '@freelancer/datastore/core';
import { assertNever } from '@freelancer/utils';
import {
  UserChosenRoleApi,
  UserSanctionPenaltyTypeApi,
} from 'api-typings/users/users';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { Qualification } from '../project-view-projects/project-view-projects.model';
import {
  FreelancerReputationKeys,
  generateFreelancerReputationObjects,
  generateReputationObject,
} from '../reputation/reputation-data.seed';
import { Reputation } from '../reputation/reputation.model';
import { Skill } from '../skills/skills.model';
import { graphicDesignSkill, phpSkill } from '../skills/skills.seed';
import { User } from '../users/users.model';
import { generateUserObject, verifiedUser } from '../users/users.seed';
import { Badge } from './badge.model';
import { Location } from './location.model';
import {
  generateLocationObject,
  LocationCountryCode,
  LocationPreset,
  locationPresets,
} from './location.seed';
import {
  MembershipPackage,
  ProjectViewUser,
  UserSanction,
} from './project-view-users.model';
import { UserStatus } from './user-status.model';

export interface GenerateProjectViewUsersOptions {
  readonly users: ReadonlyArray<User>;
  readonly currencyCode?: CurrencyCode;
}

export function generateProjectViewUserObjects({
  users,
  currencyCode = CurrencyCode.USD,
  location,
}: GenerateProjectViewUsersOptions & {
  readonly location?: Location;
}): ReadonlyArray<ProjectViewUser> {
  const reputationObjects = generateFreelancerReputationObjects({
    userIds: users.map(user => user.id),
  });

  return users.map((user, index) => ({
    ...generateProjectViewUserObject({
      user,
      currencyCode,
      reputation: reputationObjects[index],
      location,
    }),
  }));
}

export interface GenerateProjectViewUserOptions {
  readonly user: User;
  readonly currencyCode?: CurrencyCode;
  readonly skills?: ReadonlyArray<Skill>;
  readonly membershipPackage?: MembershipPackage;
  readonly location?: Location;
  readonly preferredFreelancer?: boolean;
  readonly registrationDate?: number;
  readonly reputation?: Reputation;
  readonly status?: UserStatus;
  readonly tagLine?: string;
  readonly sanctions?: ReadonlyArray<UserSanction>;
  readonly escrowComInteractionRequired?: boolean;
  readonly hasLinkedEscrowComAccount?: boolean;
}

export function generateProjectViewUserObject({
  user,
  currencyCode = CurrencyCode.USD,
  skills = generateSkills(),
  location = projectViewUserLocations[LocationPreset.SEATTLE],
  membershipPackage = generateFreeMembershipPackage(),
  preferredFreelancer = false,
  registrationDate = Date.now(),
  reputation = generateReputationObject({ userIds: [user.id] })[0],
  tagLine = 'This is my tagline.',
  sanctions = [],
}: GenerateProjectViewUserOptions): ProjectViewUser {
  const {
    id,
    username,
    displayName,
    role,
    chosenRole,
    status,
    poolIds,
    enterpriseIds,
    escrowComInteractionRequired,
    hasLinkedEscrowComAccount,
  } = user;

  return {
    ...generateUserObject({
      userId: id,
      username,
      displayName,
      role,
      chosenRole,
      currencyCode,
      userStatus: status,
      poolIds,
      enterpriseIds,
      escrowComInteractionRequired,
      hasLinkedEscrowComAccount,
    }),

    badges: generateBadges(),
    skills,
    membershipPackage,
    preferredFreelancer,
    primaryCurrency: generateCurrencyObject(currencyCode),
    registrationDate,
    qualifications: generateQualifications(),
    chosenRole: chosenRole || UserChosenRoleApi.EMPLOYER,
    reputation,
    tagLine,
    status: status || verifiedUser().userStatus,
    location,
    sanctions,
  };
}

/**
 * This is different to `location.seed.ts#generateLocationObject` by the country
 * field, even though they return the same `Location` type.
 */
// See `generateProjectViewUserCountry` below
export const projectViewUserLocations = mapValues(
  locationPresets,
  ({ countryCode, city, mapCoordinates, vicinity, administrativeArea }) =>
    generateLocationObject({
      country: generateProjectViewUserCountry(countryCode),
      city,
      mapCoordinates,
      vicinity,
      administrativeArea,
    }),
);

// ----- Location mixins -----
export function fromSydney(): Pick<GenerateProjectViewUserOptions, 'location'> {
  return {
    location: projectViewUserLocations[LocationPreset.SYDNEY],
  };
}

export function fromMelbourne(): Pick<
  GenerateProjectViewUserOptions,
  'location'
> {
  return {
    location: projectViewUserLocations[LocationPreset.MELBOURNE],
  };
}

export function fromKualaLumpur(): Pick<
  GenerateProjectViewUserOptions,
  'location'
> {
  return {
    location: projectViewUserLocations[LocationPreset.KUALA_LUMPUR],
  };
}

export function fromDhaka(): Pick<GenerateProjectViewUserOptions, 'location'> {
  return {
    location: projectViewUserLocations[LocationPreset.DHAKA],
  };
}

export function fromKarachi(): Pick<
  GenerateProjectViewUserOptions,
  'location'
> {
  return {
    location: projectViewUserLocations[LocationPreset.KARACHI],
  };
}

export function fromMumbai(): Pick<GenerateProjectViewUserOptions, 'location'> {
  return {
    location: projectViewUserLocations[LocationPreset.MUMBAI],
  };
}

export function fromSeattle(): Pick<
  GenerateProjectViewUserOptions,
  'location'
> {
  return {
    location: projectViewUserLocations[LocationPreset.SEATTLE],
  };
}

/**
 * This differs from the `countries` collection since that hits a separate API
 * endpoint. We get this if we hit users_get with the location_details projection.
 *
 * The `countries` collection has a `phoneCode`, while this has a `flagUrl` instead.
 * The `id` and `code` also seem to be uppercase vs lowercase in this.
 */
export function generateProjectViewUserCountry(code: LocationCountryCode) {
  switch (code) {
    case LocationCountryCode.AU:
      return {
        id: 'au',
        code: 'au',
        name: 'Australia',
        flagUrl: '/img/flags/png/au.png',
      };
    case LocationCountryCode.BD:
      return {
        id: 'bd',
        code: 'bd',
        name: 'Bangladesh',
        flagUrl: '/img/flags/png/bd.png',
      };
    case LocationCountryCode.IN:
      return {
        id: 'in',
        code: 'in',
        name: 'India',
        flagUrl: '/img/flags/png/in.png',
      };
    case LocationCountryCode.MY:
      return {
        id: 'my',
        code: 'my',
        name: 'Malaysia',
        flagUrl: '/img/flags/png/my.png',
      };
    case LocationCountryCode.PK:
      return {
        id: 'pk',
        code: 'pk',
        name: 'Pakistan',
        flagUrl: '/img/flags/png/pk.png',
      };
    case LocationCountryCode.US:
      return {
        id: 'us',
        code: 'us',
        name: 'United States',
        flagUrl: '/img/flags/png/us.png',
      };

    default:
      assertNever(code);
  }
}

export function generateQualifications(): ReadonlyArray<Qualification> {
  return [
    {
      id: 2,
      description: 'US English Level 1',
      iconName: 'us_eng_1',
      iconUrl: 'us_eng_1.png',
      level: 1,
      name: 'US English - Level 1',
    },
    {
      id: 3,
      description: 'General Orientation',
      level: 1,
      name: 'General Orientation',
    },
    {
      id: 161,
      description: '"HTML Level 3"',
      iconName: 'html_3',
      iconUrl: 'html_3.png',
      level: 3,
      name: 'HTML - Level 3"',
      scorePercentage: 100,
      type: 'HTML',
      userPercentile: 1,
    },
    {
      id: 69,
      description: 'Freelancer Orientation',
      iconName: 'freelancer_orientation',
      iconUrl: 'freelancer_orientation.png',
    },
    {
      id: 171,
      description: 'JavaScript Level 2"',
      iconName: 'javascript_2',
      iconUrl: 'javascript_2.png',
    },
  ];
}

function generateBadges(): ReadonlyArray<Badge> {
  return [
    {
      id: 1,
      name: 'The Prospector',
      description: 'Post your first project.',
      timeAwarded: 1481700485652000,
      iconUrl: '/img/badges/badge_1.png',
    },
    {
      id: 2,
      name: 'Entrepreneur',
      description: 'Post 50 projects.',
      timeAwarded: 1559809160278000,
      iconUrl: '/img/badges/badge_2.png',
    },
    {
      id: 4,
      name: 'Nine-to-Fiver ',
      description: 'Win a project and accept the offer.',
      timeAwarded: 1484182114224000,
      iconUrl: '/img/badges/badge_4.png',
    },
    {
      id: 8,
      name: 'The Giver',
      description: 'Award your project to a Freelancer.',
      timeAwarded: 1487760543899000,
      iconUrl: '/img/badges/badge_8.png',
    },
    {
      id: 9,
      name: 'The Rainmaker',
      description: 'Award 50 projects.',
      timeAwarded: 1561004447766000,
      iconUrl: '/img/badges/badge_9.png',
    },
    {
      id: 13,
      name: 'The Adventurer',
      description: 'Complete your first project.',
      timeAwarded: 1481855462140000,
      iconUrl: '/img/badges/badge_13.png',
    },
    {
      id: 16,
      name: 'The Seeker',
      description: 'Bid on 20 projects.',
      timeAwarded: 1524706845691000,
      iconUrl: '/img/badges/badge_16.png',
    },
    {
      id: 21,
      name: 'The Speculator',
      description: 'Sponsor 1 bid.',
      timeAwarded: 1527676455930000,
      iconUrl: '/img/badges/badge_21.png',
    },
    {
      id: 27,
      name: 'Smart Money',
      description: 'Create 10 Milestones. ',
      timeAwarded: 1521076752971000,
      iconUrl: '/img/badges/badge_27.png',
    },
    {
      id: 28,
      name: 'Mover and Shaker',
      description: 'Create 50 Milestones.',
      timeAwarded: 1526876404272000,
      iconUrl: '/img/badges/badge_28.png',
    },
    {
      id: 31,
      name: 'All Star',
      description: 'Receive a 5-star rating for a project.',
      timeAwarded: 1519105238585000,
      iconUrl: '/img/badges/badge_31.png',
    },
    {
      id: 37,
      name: 'High Roller',
      description:
        'Complete a project worth over $500USD (or equivalent) on Freelancer.com.',
      timeAwarded: 1519104610971000,
      iconUrl: '/img/badges/badge_37.png',
    },
    {
      id: 38,
      name: 'Warren Buffet',
      description: 'Complete a project worth over $1000 USD.',
      timeAwarded: 1527123533046000,
      iconUrl: '/img/badges/badge_38.png',
    },
    {
      id: 45,
      name: 'Full Service',
      description:
        'Successfully complete a contest, then use the design to complete a project.',
      timeAwarded: 1549518941897000,
      iconUrl: '/img/badges/badge_45.png',
    },
    {
      id: 50,
      name: 'The Perfectionist',
      description: 'Edited a bid.',
      timeAwarded: 1474565192666000,
      iconUrl: '/img/badges/badge_50.png',
    },
    {
      id: 55,
      name: 'The Collector',
      description: 'Reach a balance of 5,000 credits.',
      timeAwarded: 1481700486965000,
      iconUrl: '/img/badges/badge_55.png',
    },
    {
      id: 63,
      name: 'The Deal-Closer',
      description: 'Get awarded 95% of projects (for over 5 projects)',
      timeAwarded: 1564018710420000,
      iconUrl: '/img/badges/badge_63.png',
    },
    {
      id: 66,
      name: 'The Regular',
      description: 'Log in every day for 1 week.',
      timeAwarded: 1496817208353000,
      iconUrl: '/img/badges/badge_66.png',
    },
    {
      id: 67,
      name: 'Frequent Visitor',
      description: 'Log in in every day for 1 month.',
      timeAwarded: 1506410827134000,
      iconUrl: '/img/badges/badge_67.png',
    },
    {
      id: 69,
      name: 'Contest Host',
      description: 'Post a contest.',
      timeAwarded: 1527733001258000,
      iconUrl: '/img/badges/badge_69.png',
    },
    {
      id: 75,
      name: 'The Selector',
      description: 'Award 1 contest.',
      timeAwarded: 1527733001555000,
      iconUrl: '/img/badges/badge_75.png',
    },
    {
      id: 78,
      name: 'Punch it Live!',
      description: 'Post a Priority Project.',
      timeAwarded: 1527831275660000,
      iconUrl: '/img/badges/badge_78.png',
    },
    {
      id: 81,
      name: 'The Investor',
      description: 'Post a featured project.',
      timeAwarded: 1481700486152000,
      iconUrl: '/img/badges/badge_81.png',
    },
    {
      id: 88,
      name: 'Insta-Hire',
      description: 'Use Hire Me to employ a Freelancer.',
      timeAwarded: 1527733001960000,
      iconUrl: '/img/badges/badge_88.png',
    },
    {
      id: 91,
      name: 'Fast Responder',
      description: 'Bid within 2 minutes of a project being listed.',
      timeAwarded: 1484182192954000,
      iconUrl: '/img/badges/badge_91.png',
    },
    {
      id: 93,
      name: 'The Verified',
      description: 'Verify your payment method',
      timeAwarded: 1481700486653000,
      iconUrl: '/img/badges/badge_93.png',
    },
    {
      id: 94,
      name: 'Backup plan!',
      description: 'Verify a backup payment method',
      timeAwarded: 1559096645522000,
      iconUrl: '/img/badges/badge_94.png',
    },
    {
      id: 95,
      name: 'Quick Pick',
      description: 'Award your project within 24 hours of posting',
      timeAwarded: 1517293840485000,
      iconUrl: '/img/badges/badge_95.png',
    },
    {
      id: 96,
      name: 'Speedy Hire',
      description: 'Award 15 projects within 24 hours of posting',
      timeAwarded: 1559114843750000,
      iconUrl: '/img/badges/badge_96.png',
    },
    {
      id: 97,
      name: 'Lightning Employment',
      description: 'Award 30 projects within 24 hours of posting',
      timeAwarded: 1559190728466000,
      iconUrl: '/img/badges/badge_97.png',
    },
  ];
}

export function generateSkills(): ReadonlyArray<Skill> {
  return [phpSkill(), graphicDesignSkill()];
}

// ----- Membership types -----
export function generateFreeMembershipPackage(): MembershipPackage {
  return {
    bidLimit: 8,
    bidRefreshRate: 1,
    id: 1,
    skillChangeLimit: 5,
    skillLimit: 20,
    name: 'free',
    servicePostingLimit: 1,
    timeBidRefreshed: 328717000,
  };
}

export function generatePlusMembershipPackage(): MembershipPackage {
  return {
    bidLimit: 100,
    bidRefreshRate: 1,
    id: 1,
    skillChangeLimit: 15,
    skillLimit: 86,
    name: 'plus',
    servicePostingLimit: 10,
    timeBidRefreshed: 328717000,
  };
}

export function activeUserSanction(
  duration?: number,
): Pick<GenerateProjectViewUserOptions, 'sanctions'> {
  const now = Date.now();
  return {
    sanctions: [
      {
        startDate: now,
        endDate: now + (duration || 60 * 1000),
        penalty: UserSanctionPenaltyTypeApi.BID_RESTRICTION,
      },
    ],
  };
}

export function userWithReviews({
  count,
  userId,
}: {
  readonly count: number;
  readonly userId: number;
}): Pick<GenerateProjectViewUserOptions, 'reputation'> {
  return {
    reputation: generateReputationObject({
      reputationOptions: {
        [FreelancerReputationKeys.TOTAL]: { min: count, max: count },
        [FreelancerReputationKeys.REVIEWSPERCENTAGE]: { min: 1, max: 1 },
      },
      userIds: [userId],
    })[0],
  };
}

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { assertNever } from '@freelancer/utils';
import { ProjectUpgradeOptionsApi } from 'api-typings/projects/projects';

export enum UpgradeTagSize {
  MID = 'mid',
  SMALL = 'small',
}

/** cart subtype IDs for project upgrade items */
export enum UpgradeSubType {
  RECRUITER = 15,
  EXTEND = 17,
  URGENT = 5,
  NONPUBLIC = 3,
  HIDEBIDS = 2,
  FULLTIME = 4,
  NDA = 7,
  IP_CONTRACT = 10,
  SUCCESS_BUNDLE = 11,
  NON_COMPETE = 12,
  TECHNICAL_COPILOT = 13,
  PF_ONLY = 14,
  FEATURED = 1,
  NOT_FOUND = -1,
}

export enum UpgradeType {
  ASSISTED = 'assisted',
  EXTENDED = 'extended',
  FEATURED = 'featured',
  FULL_TIME = 'full time',
  GUARANTEED = 'guaranteed',
  HIGHLIGHT = 'highlight',
  IP_AGREEMENT = 'ip agreement',
  NDA = 'nda',
  PRIVATE = 'private',
  TECHNICAL_COPILOT = 'technical co-pilot',
  SEALED = 'sealed',
  TOP_CONTEST = 'top contest',
  URGENT = 'urgent',
  QUALIFIED = 'qualified',
}

export enum UpgradeName {
  // not using ASSISTED please, is deprecated
  ASSISTED = 'Recruiter',
  RECRUITER = 'Recruiter',
  EXTENDED = 'Extended',
  FEATURED = 'Featured',
  FULL_TIME = 'Full Time',
  GUARANTEED = 'Guaranteed',
  HIGHLIGHT = 'Highlight',
  IP_AGREEMENT = 'IP Agreement',
  NDA = 'NDA',
  PRIVATE = 'Private',
  TECHNICAL_COPILOT = 'Technical Co-pilot',
  SEALED = 'Sealed',
  TOP_CONTEST = 'Top Contest',
  URGENT = 'Urgent',
  QUALIFIED = 'Qualified',
}

/** cart subtype IDs for bid upgrade items */
export enum BidUpgradeSubType {
  SPONSORED = 1,
  HIGHLIGHT = 2,
  SEALED = 3,
  NOT_FOUND = -1,
}

export enum BidUpgradeName {
  SPONSORED = 'Sponsored',
  HIGHLIGHT = 'Highlight',
  SEALED = 'Sealed',
}

export enum BidUpgradeType {
  SPONSORED = 'sponsored',
  HIGHLIGHT = 'highlight',
  SEALED = 'sealed',
}

// Mapping bid upgrade types to full names suitable for display.
export function getBidUpgradeName(upgrade: BidUpgradeType): BidUpgradeName {
  switch (upgrade) {
    case BidUpgradeType.SPONSORED:
      return BidUpgradeName.SPONSORED;
    case BidUpgradeType.HIGHLIGHT:
      return BidUpgradeName.HIGHLIGHT;
    case BidUpgradeType.SEALED:
      return BidUpgradeName.SEALED;
    default:
      return assertNever(upgrade);
  }
}

// This function maps upgrade name to subtype, which is a number
export function transformBidUpgradeSubType(
  upgrade: BidUpgradeType,
): BidUpgradeSubType {
  switch (upgrade) {
    case BidUpgradeType.SPONSORED:
      return BidUpgradeSubType.SPONSORED;
    case BidUpgradeType.HIGHLIGHT:
      return BidUpgradeSubType.HIGHLIGHT;
    case BidUpgradeType.SEALED:
      return BidUpgradeSubType.SEALED;
    default:
      return assertNever(upgrade);
  }
}

// Mapping upgrade types to full names suitable for display.
export function getUpgradeName(upgrade: UpgradeType): UpgradeName {
  switch (upgrade) {
    case UpgradeType.ASSISTED:
      return UpgradeName.ASSISTED;
    case UpgradeType.EXTENDED:
      return UpgradeName.EXTENDED;
    case UpgradeType.FEATURED:
      return UpgradeName.FEATURED;
    case UpgradeType.FULL_TIME:
      return UpgradeName.FULL_TIME;
    case UpgradeType.GUARANTEED:
      return UpgradeName.GUARANTEED;
    case UpgradeType.HIGHLIGHT:
      return UpgradeName.HIGHLIGHT;
    case UpgradeType.IP_AGREEMENT:
      return UpgradeName.IP_AGREEMENT;
    case UpgradeType.NDA:
      return UpgradeName.NDA;
    case UpgradeType.PRIVATE:
      return UpgradeName.PRIVATE;
    case UpgradeType.TECHNICAL_COPILOT:
      return UpgradeName.TECHNICAL_COPILOT;
    case UpgradeType.SEALED:
      return UpgradeName.SEALED;
    case UpgradeType.TOP_CONTEST:
      return UpgradeName.TOP_CONTEST;
    case UpgradeType.URGENT:
      return UpgradeName.URGENT;
    case UpgradeType.QUALIFIED:
      return UpgradeName.QUALIFIED;
    default:
      return assertNever(upgrade);
  }
}

export function isUpgradeType(upgrade: string): upgrade is UpgradeType {
  // FIXME: https://phabricator.tools.flnltd.com/T136805#2339368
  // this needs any because the types might not match (since this is a guard)
  return Object.values(UpgradeType).includes(upgrade as any);
}

// Do not change the order unless specs have been modified.
// Specs from https://confluence.flnltd.com/pages/viewpage.action?pageId=20022705
export function getUpgradeOrder(upgrade: UpgradeType): number {
  switch (upgrade) {
    case UpgradeType.URGENT:
      return 1;
    case UpgradeType.FEATURED:
      return 2;
    case UpgradeType.PRIVATE:
      return 3;
    case UpgradeType.HIGHLIGHT:
      return 4;
    case UpgradeType.FULL_TIME:
      return 5;
    case UpgradeType.GUARANTEED:
      return 6;
    case UpgradeType.SEALED:
      return 7;
    case UpgradeType.NDA:
      return 8;
    case UpgradeType.ASSISTED:
      return 9;
    case UpgradeType.TOP_CONTEST:
      return 10;
    case UpgradeType.EXTENDED:
    case UpgradeType.IP_AGREEMENT:
    case UpgradeType.TECHNICAL_COPILOT:
    case UpgradeType.QUALIFIED:
      return 11;
    default:
      return assertNever(upgrade);
  }
}

// This function maps upgrade name to subtype, which is a number
export function transformUpgradeSubType(subType: string) {
  switch (subType) {
    // TODO: the name `assisted` should be deprecated
    case ProjectUpgradeOptionsApi.RECRUITER:
    case 'assisted':
      return UpgradeSubType.RECRUITER;
    case ProjectUpgradeOptionsApi.EXTEND:
    case 'extend':
      return UpgradeSubType.EXTEND;
    case ProjectUpgradeOptionsApi.URGENT:
      return UpgradeSubType.URGENT;
    case ProjectUpgradeOptionsApi.NONPUBLIC:
    case 'private':
      return UpgradeSubType.NONPUBLIC;
    case ProjectUpgradeOptionsApi.HIDEBIDS:
    case 'sealed':
      return UpgradeSubType.HIDEBIDS;
    case ProjectUpgradeOptionsApi.FULLTIME:
    case 'full time':
      return UpgradeSubType.FULLTIME;
    case ProjectUpgradeOptionsApi.NDA:
    case 'NDA':
      return UpgradeSubType.NDA;
    case ProjectUpgradeOptionsApi.IP_CONTRACT:
    case 'ipContract':
    case 'ip agreement':
      return UpgradeSubType.IP_CONTRACT;
    case ProjectUpgradeOptionsApi.SUCCESS_BUNDLE:
      return UpgradeSubType.SUCCESS_BUNDLE;
    case ProjectUpgradeOptionsApi.NON_COMPETE:
      return UpgradeSubType.NON_COMPETE;
    case ProjectUpgradeOptionsApi.PROJECT_MANAGEMENT:
      return UpgradeSubType.TECHNICAL_COPILOT;
    case ProjectUpgradeOptionsApi.PF_ONLY:
      return UpgradeSubType.PF_ONLY;
    case ProjectUpgradeOptionsApi.FEATURED:
      return UpgradeSubType.FEATURED;
    default:
      return UpgradeSubType.NOT_FOUND;
  }
}

// Cases refer to ProjectUpgrades type in Projects collection
// Need to change both if modified type name
export function transformUpgradeType(upgrade: string): UpgradeType | undefined {
  switch (upgrade) {
    // Cases that in the project Upgrade object
    case 'recruiter':
    case 'assisted':
      return UpgradeType.ASSISTED;
    case 'featured':
      return UpgradeType.FEATURED;
    case 'fulltime':
      return UpgradeType.FULL_TIME;
    case 'ipContract':
      return UpgradeType.IP_AGREEMENT;
    case 'NDA': // from ProjectUpgrades
    case 'nda': // from ContestUpgrade
      return UpgradeType.NDA;
    case 'nonpublic': // from ProjectUpgrades
    case 'private': // from ContestUpgrade
      return UpgradeType.PRIVATE;
    case 'projectManagement':
      return UpgradeType.TECHNICAL_COPILOT;
    case 'sealed':
      return UpgradeType.SEALED;
    case 'urgent':
      return UpgradeType.URGENT;
    case 'qualified':
      return UpgradeType.QUALIFIED;

    // Cases not yet returned from the API in project object
    case 'topContest':
      return UpgradeType.TOP_CONTEST;
    case 'highlight':
      return UpgradeType.HIGHLIGHT;
    case 'extend':
      return UpgradeType.EXTENDED;
    case 'guaranteed':
      return UpgradeType.GUARANTEED;
    default:
  }
}
@Component({
  selector: 'fl-upgrade-tag',
  template: `
    <ng-container [ngSwitch]="upgradeType">
      <ng-container
        *ngSwitchCase="UpgradeType.ASSISTED"
        i18n="Recruiter upgrade tag"
      >
        Recruiter
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.EXTENDED"
        i18n="Extended upgrade tag"
      >
        Extended
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.FEATURED"
        i18n="Featured upgrade tag"
      >
        Featured
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.FULL_TIME"
        i18n="Full Time upgrade tag"
      >
        Full Time
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.GUARANTEED"
        i18n="Guaranteed upgrade tag"
      >
        Guaranteed
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.HIGHLIGHT"
        i18n="Highlight upgrade tag"
      >
        Highlight
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.IP_AGREEMENT"
        i18n="IP Agreement upgrade tag"
      >
        IP Agreement
      </ng-container>
      <ng-container *ngSwitchCase="UpgradeType.NDA" i18n="NDA upgrade tag">
        NDA
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.PRIVATE"
        i18n="Private upgrade tag"
      >
        Private
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.TECHNICAL_COPILOT"
        i18n="Technical Co-pilot upgrade tag"
      >
        Technical Co-pilot
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.SEALED"
        i18n="Sealed upgrade tag"
      >
        Sealed
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.TOP_CONTEST"
        i18n="Top Contest upgrade tag"
      >
        Top Contest
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.URGENT"
        i18n="Urgent upgrade tag"
      >
        Urgent
      </ng-container>
      <ng-container
        *ngSwitchCase="UpgradeType.QUALIFIED"
        i18n="Qualified upgrade tag"
      >
        Qualified
      </ng-container>
      <ng-container
        *ngSwitchCase="BidUpgradeType.SPONSORED"
        i18n="Sponsoled upgrade tag"
      >
        Sponsored
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./upgrade-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradeTagComponent {
  BidUpgradeType = BidUpgradeType;
  UpgradeType = UpgradeType;

  @HostBinding('attr.data-upgrade-type')
  @Input()
  upgradeType: UpgradeType | BidUpgradeType;

  @HostBinding('attr.data-size')
  @Input()
  size: UpgradeTagSize = UpgradeTagSize.MID;
}

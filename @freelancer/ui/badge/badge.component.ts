import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';
import { CorporateBadgeType } from './corporate-badge-type';
import { ExamBadgeType } from './exam-badge-type';
import { MembershipBadgeType } from './membership-badge-type';
import { PreferredFreelancerBadgeType } from './preferred-freelancer-badge-type';
import { UserBadgeType } from './user-badge-type';
import { VerifiedBadgeType } from './verified-badge-type';

export enum BadgeSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
}

export enum BadgeType {
  CORPORATE = 'corporate',
  MEMBERSHIP = 'membership',
  EXAM = 'exam',
  PREFERRED_FREELANCER = 'preferred-freelancer',
  USER = 'user',
  VERIFIED = 'verified',
}

export type Badge =
  | { type: BadgeType.CORPORATE; badge: CorporateBadgeType }
  | { type: BadgeType.MEMBERSHIP; badge: MembershipBadgeType }
  | { type: BadgeType.EXAM; badge: ExamBadgeType }
  | {
      type: BadgeType.PREFERRED_FREELANCER;
      badge: PreferredFreelancerBadgeType;
    }
  | { type: BadgeType.USER; badge: UserBadgeType }
  | {
      type: BadgeType.VERIFIED;
      badge: VerifiedBadgeType;
    };

@Component({
  selector: 'fl-badge',
  template: `
    <fl-picture
      class="BadgePicture"
      *ngIf="badge"
      [fullWidth]="true"
      [src]="'badges/' + badge.type + '/' + badge.badge"
      [alt]="badge.badge"
    ></fl-picture>
  `,
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent implements OnChanges {
  @HostBinding('attr.data-size')
  @Input()
  size = BadgeSize.MID;

  @Input() badge: Badge;

  @HostBinding('attr.data-type') type: BadgeType;

  @HostBinding('class.IsPreferredFreelancer') isPreferredFreelancer = false;

  ngOnChanges() {
    if (this.badge) {
      this.type = this.badge.type;

      // TODO: Remove hack when component is refactored in T96403
      if (
        this.badge.type === BadgeType.PREFERRED_FREELANCER &&
        this.badge.badge === PreferredFreelancerBadgeType.PREFERRED_FREELANCER
      ) {
        this.isPreferredFreelancer = true;
      }
    }
  }
}

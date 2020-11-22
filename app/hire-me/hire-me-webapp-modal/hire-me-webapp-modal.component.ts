import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore, DatastoreDocument } from '@freelancer/datastore';
import {
  ProfileViewUsersCollection,
  ProjectsCollection,
  ProjectViewProject,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { CardSize } from '@freelancer/ui/card';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { TextSize } from '@freelancer/ui/text';
import { toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { HireMeUser } from '../hire-me.component';

@Component({
  selector: 'app-hire-me-modal',
  template: `
    <fl-card
      *ngIf="hireMeUser$ | async as hireMeUser"
      class="DarkCard"
      [edgeToEdge]="true"
      [size]="CardSize.SMALL"
    >
      <fl-bit class="CardBackground">
        <fl-heading
          class="CardHeading PaddedSection"
          i18n="User Profile Hire Me Component Heading"
          [color]="HeadingColor.LIGHT"
          [headingType]="HeadingType.H2"
          [size]="TextSize.SMALL"
        >
          Contact {{ hireMeUser.profileUserDisplayName }} about your job
        </fl-heading>

        <fl-bit class="CardContents PaddedSection">
          <app-hire-me
            flTrackingSection="UserProfileHireMeModal"
            defaultMessage="Hi {{
              hireMeUser.profileUserDisplayName
            }}, I noticed your profile and would like to offer you my project. We can discuss any details over chat."
            i18n-defaultMessage="User Profile Hire Me module default message"
            [isResponsive]="true"
            [hireMeUser]="hireMeUser"
            [refProject]="refProject"
          ></app-hire-me>
        </fl-bit>
      </fl-bit>
    </fl-card>
  `,
  styleUrls: ['./hire-me-webapp-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HireMeWebappModalComponent implements OnInit {
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  TextSize = TextSize;
  CardSize = CardSize;

  @Input() profileUserId: number;
  @Input() refProject?: ProjectViewProject;

  hireMeUser$: Rx.Observable<HireMeUser>;
  profileViewUsersDocument: DatastoreDocument<ProfileViewUsersCollection>;

  constructor(private auth: Auth, private datastore: Datastore) {}

  ngOnInit(): void {
    this.profileViewUsersDocument = this.datastore.document<
      ProfileViewUsersCollection
    >('profileViewUsers', this.profileUserId);

    const usersDoc = this.datastore.document<UsersCollection>(
      'users',
      this.auth.getUserId(),
    );

    const authUserId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));
    const loggedUserHasProjects$ = this.refProject
      ? Rx.of(true)
      : this.datastore
          .collection<ProjectsCollection>('projects', query =>
            query.where('ownerId', '==', authUserId$).limit(1),
          )
          .valueChanges()
          .pipe(map(projects => projects.length > 0));

    this.hireMeUser$ = Rx.combineLatest([
      this.profileViewUsersDocument.valueChanges(),
      usersDoc.valueChanges(),
      loggedUserHasProjects$,
    ]).pipe(
      map(([profileUser, loggedInUser, loggedUserHasProjects]) => ({
        authId: loggedInUser.id,
        profileUserId: profileUser.id,
        isDeloitteDcUser: !!profileUser.isDeloitteDcUser,
        profileUserDisplayName: profileUser.publicName || profileUser.username,
        profileUserLocation: profileUser.location,
        paymentVerified: loggedInUser.status.paymentVerified,
        emailVerified: loggedInUser.status.emailVerified,
        defaultCurrency: loggedInUser.currency,
        loggedUserIsRookie: !loggedUserHasProjects,
        profileUserHourlyRate: profileUser.hourlyRate,
      })),
    );
  }
}

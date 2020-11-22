import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Datastore, DatastoreCollection } from '@freelancer/datastore';
import { UserRecentProjectsAndContestsCollection } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-my-projects',
  template: `
    <app-my-projects-list
      flTrackingSection="NavigationPrimary"
      [recentJobs]="
        userRecentProjectsAndContestsCollection.valueChanges() | async
      "
    ></app-my-projects-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsComponent implements OnInit {
  userRecentProjectsAndContestsCollection: DatastoreCollection<
    UserRecentProjectsAndContestsCollection
  >;

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    this.userRecentProjectsAndContestsCollection = this.datastore.collection<
      UserRecentProjectsAndContestsCollection
    >('userRecentProjectsAndContests');
  }
}

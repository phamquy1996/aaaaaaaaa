import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Datastore, RequestStatus } from '@freelancer/datastore';
import {
  Contest,
  ContestsCollection,
  ThreadProject,
  ThreadProjectsCollection,
} from '@freelancer/datastore/collections';
import { CardBorderRadius, CardSize } from '@freelancer/ui/card';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor, LinkWeight } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-share-job',
  template: `
    <ng-container *ngIf="status$ | async as status">
      <fl-card
        class="CardContainer"
        [borderRadius]="CardBorderRadius.LARGE"
        [ngClass]="{ 'CardContainer--fromOther': !fromMe }"
        [size]="CardSize.SMALL"
        [maxContent]="false"
        [edgeToEdge]="true"
      >
        <fl-bit
          class="MainContainer"
          [ngClass]="{
            'MainContainer--fromMe': fromMe,
            'MainContainer--fromOther': !fromMe,
            'MainContainer--inactive': status.error,
            'MainContainer--loaded': status.ready || status.error
          }"
        >
          <!-- Loading State -->
          <fl-bit
            class="LoadingContainer"
            *ngIf="!status.ready && !status.error"
          >
            <fl-spinner
              flTrackingLabel="ShareJobRichMessageInitialisationSpinner"
              [size]="SpinnerSize.SMALL"
              [color]="fromMe ? SpinnerColor.LIGHT : SpinnerColor.PRIMARY"
            ></fl-spinner>
          </fl-bit>
          <fl-bit
            *ngIf="status.ready || status.error"
            class="ImageContainer"
            [ngClass]="{
              'ImageContainer--inactive': status.error
            }"
            [flMarginRight]="Margin.XXSMALL"
          >
            <fl-icon
              *ngIf="type === 'share_project' && status.ready"
              [color]="IconColor.LIGHT"
              [name]="'ui-computer'"
            ></fl-icon>
            <fl-icon
              *ngIf="type === 'share_contest' && status.ready"
              [color]="IconColor.LIGHT"
              [name]="'ui-trophy'"
            ></fl-icon>
          </fl-bit>
          <fl-bit
            class="DescriptionContainer"
            *ngIf="status.ready || status.error"
          >
            <fl-link
              class="ShareJobTitle"
              *ngIf="status.ready"
              flTrackingLabel="ShareJobRichMessage"
              [link]="jobLink$ | async"
              [color]="fromMe ? LinkColor.LIGHT : LinkColor.INHERIT"
              [hoverColor]="
                fromMe ? LinkHoverColor.LIGHT : LinkHoverColor.INHERIT
              "
              [weight]="LinkWeight.BOLD"
              [flMarginBottom]="Margin.XXSMALL"
              [newTab]="true"
            >
              <fl-text
                [maxLines]="2"
                [color]="FontColor.INHERIT"
                [size]="TextSize.INHERIT"
              >
                {{ (job$ | async)?.title }}
              </fl-text>
            </fl-link>
            <fl-text
              *ngIf="status.error"
              i18n="Job is not available for viewing"
              [color]="FontColor.DARK"
              [weight]="FontWeight.BOLD"
              [maxLines]="2"
              [flMarginBottom]="Margin.XXSMALL"
            >
              Unavailable job
            </fl-text>
            <fl-bit class="BottomContainer">
              <fl-icon
                *ngIf="status.ready"
                [color]="fromMe ? IconColor.LIGHT : IconColor.MID"
                [name]="'ui-clock-alt-v2'"
                [size]="IconSize.SMALL"
                [flMarginRight]="Margin.XXSMALL"
              ></fl-icon>
              <fl-text
                *ngIf="status.ready"
                [color]="fromMe ? FontColor.LIGHT : FontColor.MID"
                [maxLines]="2"
              >
                {{ (job$ | async)?.timeSubmitted | date: 'LLL dd, yyyy' }}
              </fl-text>
              <fl-text
                *ngIf="status.error"
                i18n="Job is not available for viewing"
                [color]="FontColor.MID"
              >
                This job is no longer available to view.
              </fl-text>
            </fl-bit>
          </fl-bit>
        </fl-bit>
      </fl-card>
    </ng-container>
  `,
  styleUrls: ['./share-job.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareJobComponent implements OnInit, OnChanges {
  CardBorderRadius = CardBorderRadius;
  CardSize = CardSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconSize = IconSize;
  IconColor = IconColor;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkWeight = LinkWeight;
  TextSize = TextSize;
  Margin = Margin;
  SpinnerColor = SpinnerColor;
  SpinnerSize = SpinnerSize;

  @Input() jobId: number;
  @Input() type: string;
  @HostBinding('class.FromMe')
  @Input()
  fromMe: boolean;

  jobLink$: Rx.Observable<string>;
  job$: Rx.Observable<ThreadProject | Contest>;
  status$: Rx.Observable<
    RequestStatus<ThreadProjectsCollection | ContestsCollection>
  >;
  private jobId$ = new Rx.ReplaySubject<number>(1);

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    if (this.type === 'share_project') {
      const projectDoc = this.datastore.document<ThreadProjectsCollection>(
        'threadProjects',
        this.jobId$,
      );
      const project$ = projectDoc.valueChanges();
      this.job$ = project$;
      this.status$ = projectDoc.status$;
    } else {
      const contestDoc = this.datastore.document<ContestsCollection>(
        'contests',
        this.jobId$,
      );
      const contest$ = contestDoc.valueChanges();
      this.job$ = contest$;
      this.status$ = contestDoc.status$;
    }

    this.jobLink$ = this.job$.pipe(
      map(job => {
        if (this.type === 'share_project') {
          return `/projects/${job.seoUrl}`;
        }

        return `/${job.seoUrl}`;
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('jobId' in changes) {
      this.jobId$.next(changes.jobId.currentValue);
    }
  }
}

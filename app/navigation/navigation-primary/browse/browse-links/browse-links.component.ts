import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Feature } from '@freelancer/feature-flags';
import { IconSize } from '@freelancer/ui/icon';
import { LinkIconPosition, LinkUnderline } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize, TextTransform } from '@freelancer/ui/text';

@Component({
  selector: 'app-browse-links',
  template: `
    <fl-bit [flMarginBottom]="Margin.MID">
      <fl-bit
        class="Heading"
        *flFeature="Feature.SEARCH_POOLS"
        [flMarginBottom]="Margin.SMALL"
      >
        <fl-text
          i18n="Browse Type heading"
          [size]="TextSize.XXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          Search By Type
        </fl-text>
      </fl-bit>
      <fl-bit class="Body">
        <fl-grid [flMarginBottom]="Margin.MID">
          <fl-col [col]="12" [colTablet]="4" *flFeature="Feature.SEARCH_POOLS">
            <app-browse-links-item
              description="Browse available projects to work on"
              i18n-description="Browse Projects Search description"
              title="Projects"
              i18n-title="Browse Projects title"
              [icon]="'ui-computer-outline'"
              [link]="'/search/projects/'"
              [trackingLabel]="'Browse-Type-SearchProjects'"
            ></app-browse-links-item>
          </fl-col>
          <fl-col
            [col]="12"
            [colTablet]="4"
            *flFeature="Feature.SEARCH_CONTESTS"
          >
            <app-browse-links-item
              description="Browse available contests to enter"
              i18n-description="Browse Contests Search description"
              title="Contests"
              i18n-title="Browse Contests title"
              [icon]="'ui-trophy-outline'"
              [link]="'/search/contests/'"
              [trackingLabel]="'Browse-Type-SearchContests'"
            ></app-browse-links-item>
          </fl-col>
          <fl-col [col]="12" [colTablet]="4" *flFeature="Feature.SEARCH_POOLS">
            <app-browse-links-item
              description="Browse for your favourite freelancer"
              i18n-description="Browse Freelancers Search description"
              title="Freelancers"
              i18n-title="Browse Freelancers title"
              [icon]="'ui-user-outline'"
              [link]="'/search/users/'"
              [trackingLabel]="'Browse-Type-SearchFreelancers'"
            ></app-browse-links-item>
          </fl-col>
        </fl-grid>
      </fl-bit>

      <fl-bit class="Heading" [flMarginBottom]="Margin.SMALL">
        <fl-text
          i18n="Browse Products heading"
          [flMarginRight]="Margin.MID"
          [size]="TextSize.XXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          Discover Our Products
        </fl-text>
        <fl-link
          i18n="Browse Products view all"
          flTrackingLabel="Browse-Products-ViewAll"
          [flShowMobile]="true"
          [iconName]="'ui-arrow-right'"
          [iconPosition]="LinkIconPosition.RIGHT"
          [iconSize]="IconSize.XSMALL"
          [link]="'/'"
          [underline]="LinkUnderline.NEVER"
        >
          View All
        </fl-link>
      </fl-bit>
      <fl-bit class="Body">
        <fl-grid>
          <fl-col [col]="12" [colTablet]="4">
            <app-browse-links-item
              *flFeature="Feature.SHOWCASE"
              description="Get inspiration from the world’s best"
              i18n-description="Browse Showcase description"
              title="Showcase"
              i18n-title="Browse Showcase title"
              [icon]="'ui-showcase-outline'"
              [link]="'/showcase'"
              [trackingLabel]="'Browse-Products-Showcase'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.COMMUNITY"
              description="Browse resources for your business and career"
              i18n-description="Browse Community description"
              title="Community"
              i18n-title="Browse Community title"
              [icon]="'ui-file-notes-outline'"
              [link]="'/community'"
              [trackingLabel]="'Browse-Products-Community'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.BOOKMARKS"
              description="Browse your bookmarked projects and contests"
              i18n-description="Browse Bookmarks description"
              title="Bookmarks"
              i18n-title="Browse Bookmarks title"
              [icon]="'ui-bookmark'"
              [link]="'/jobs/bookmark'"
              [trackingLabel]="'Browse-Products-Bookmarks'"
            ></app-browse-links-item>
            <app-browse-links-item
              description="Browse the Help Center or get in touch with us"
              i18n-description="Browse Customer Support description"
              title="Customer Support"
              i18n-title="Browse Customer Support title"
              [icon]="'ui-question-outline'"
              [link]="'/support'"
              [trackingLabel]="'Browse-Products-CustomerSupport'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.EXAMS"
              description="Prove your skills and win more work"
              i18n-description="Browse Exams description"
              title="Exams"
              i18n-title="Browse Exams title"
              [icon]="'ui-badge-outline'"
              [link]="'/exam/exams/index.php'"
              [trackingLabel]="'Browse-Products-Exams'"
            ></app-browse-links-item>
          </fl-col>
          <fl-col [col]="12" [colTablet]="4">
            <app-browse-links-item
              *flFeature="Feature.RECRUITER"
              description="Find the perfect freelancer for your project"
              i18n-description="Browse Recruiter description"
              title="Recruiter"
              i18n-title="Browse Recruiter title"
              [icon]="'ui-community-outline'"
              [link]="'/recruiter'"
              [trackingLabel]="'Browse-Products-Recruiter'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.LOCAL_JOBS"
              description="Get help in any location, anywhere in the world"
              i18n-description="Browse Local Jobs description"
              title="Local Jobs"
              i18n-title="Browse Local Jobs title"
              [icon]="'ui-pin-outline'"
              [link]="'/local'"
              [trackingLabel]="'Browse-Products-Local Jobs'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.ENTERPRISE_PAGE"
              description="Turn your organization’s ideas into reality"
              i18n-description="Browse Enterprise description"
              title="Enterprise"
              i18n-title="Browse Enterprise title"
              [icon]="'ui-globe'"
              [link]="'/enterprise/'"
              [trackingLabel]="'Browse-Products-Enterprise'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.PREFERRED_FREELANCER_PROGRAM"
              description="Access exclusive projects and stand out from the crowd"
              i18n-description="Browse Preferred Freelancers description"
              title="Preferred Freelancers"
              i18n-title="Browse Preferred Freelancers title"
              [icon]="'ui-flag-outline'"
              [link]="'/preferred-freelancer-program'"
              [trackingLabel]="'Browse-Products-PreferredFreelancers'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.FREELANCER_VERIFIED"
              description="Increase your chances of winning projects"
              i18n-description="Browse Freelancer Verified description"
              title="Freelancer Verified"
              i18n-title="Browse Freelancer Verified title"
              [icon]="'ui-user-verified'"
              [link]="'/verified'"
              [trackingLabel]="'Browse-Products-FreelancerVerified'"
            ></app-browse-links-item>
          </fl-col>
          <fl-col [col]="12" [colTablet]="4">
            <!--
              <app-browse-links-item
                description="Learn from experts and improve your skills"
                i18n-description="Browse Education description"
                title="Education"
                i18n-title="Browse Education title"
                [icon]="'ui-auction-outline'"
                [link]="'/academy'"
                [trackingLabel]="'Browse-Products-Education'"
              ></app-browse-links-item>
            -->
            <app-browse-links-item
              *flFeature="Feature.CONTEST_POST"
              description="Tap freelancers worldwide and crowdsource your idea"
              i18n-description="Browse Contests Search description"
              title="Contests"
              i18n-title="Browse Contests title"
              [icon]="'ui-trophy-outline'"
              [link]="'/contest'"
              [trackingLabel]="'Browse-Products-SearchContests'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.MEMBERSHIPS"
              description="Get more earning opportunities and better savings"
              i18n-description="Browse Membership description"
              title="Membership"
              i18n-title="Browse Membership title"
              [icon]="'ui-id-card-outline'"
              [link]="'/membership'"
              [trackingLabel]="'Browse-Products-Membership'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.INSIGHTS"
              description="Review your site activity and performance"
              i18n-description="Browse Insights description"
              title="Insights"
              i18n-title="Browse Insights title"
              [icon]="'ui-setting-filter-v2'"
              [link]="'/insights'"
              [trackingLabel]="'Browse-Products-Insights'"
            ></app-browse-links-item>
            <app-browse-links-item
              *flFeature="Feature.PROJECT_MANAGEMENT_PAGE"
              description="Finish your projects on time, on budget and without the hassle"
              i18n-description="Browse project management description"
              title="Project Management"
              i18n-title="Browse project management title "
              [icon]="'ui-project-management'"
              [link]="'/project-management'"
              [trackingLabel]="'Browse-Products-ProjectManagement'"
            ></app-browse-links-item>
          </fl-col>
        </fl-grid>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./browse-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseLinksComponent {
  Feature = Feature;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkIconPosition = LinkIconPosition;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  TextTransform = TextTransform;
}

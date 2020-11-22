import { Inject, Injectable } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  GrantEntity,
  GrantsCollection,
} from '@freelancer/datastore/collections';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import { isDefined } from '@freelancer/utils';
import { EntityTypeApi } from 'api-typings/common/common';
import { GrantedPermissionApi } from 'api-typings/grants/grants';
import * as Rx from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import {
  EntityGrantedPermissionsMap,
  Partner,
  PartnerDashboardFeature,
  PARTNER_DASHBOARD_FEATURE_PERMISSIONS_MAP,
  PARTNER_TO_ENTERPRISE_ID_MAP,
  PARTNER_TO_POOL_ID_MAP,
} from './partner-dashboard.config';

@Injectable()
export class PartnerDashboardAccess {
  constructor(
    private datastore: Datastore,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {}

  /**
   * Returns a list of all the partners available in this version of the webapp
   * build
   */
  getPartners(): Rx.Observable<Partner[]> {
    if (this.uiConfig.theme === 'arrow') {
      return Rx.of([Partner.ARROW]);
    }
    if (this.uiConfig.theme === 'deloitte') {
      return Rx.of([Partner.DELOITTE]);
    }
    return Rx.of([Partner.FACEBOOK, Partner.IBM]);
  }

  private getResources(
    partner$: Rx.Observable<Partner>,
  ): Rx.Observable<ReadonlyArray<GrantEntity>> {
    return partner$.pipe(
      switchMap(partner => {
        if (!partner) {
          return Rx.of([]);
        }

        const resources: GrantEntity[] = [];

        const enterpriseId = PARTNER_TO_ENTERPRISE_ID_MAP[partner];
        const poolId = PARTNER_TO_POOL_ID_MAP[partner];

        if (enterpriseId) {
          resources.push({
            id: enterpriseId,
            entityType: EntityTypeApi.ENTERPRISE,
          });
        }

        if (poolId) {
          resources.push({
            id: poolId,
            entityType: EntityTypeApi.POOL,
          });
        }
        return Rx.of(resources);
      }),
    );
  }

  private getUserPermissions(
    partner$: Rx.Observable<Partner>,
  ): Rx.Observable<EntityGrantedPermissionsMap> {
    return this.datastore
      .collection<GrantsCollection>('grants', query =>
        query.where('resource', 'in', this.getResources(partner$)),
      )
      .valueChanges()
      .pipe(
        map(grants =>
          grants.reduce((obj, grant) => {
            const previousPermissions = obj[grant.resource.entityType];
            obj[grant.resource.entityType] = previousPermissions
              ? [...previousPermissions, ...grant.grantedPermissions]
              : grant.grantedPermissions;
            return obj;
          }, {} as EntityGrantedPermissionsMap),
        ),
      );
  }

  /**
   * Checks if a user can access a particular dashboard
   */
  checkDashboardAccess(
    partner$: Rx.Observable<Partner>,
  ): Rx.Observable<boolean> {
    return partner$.pipe(
      switchMap(partner =>
        this.getAccessibleDashboards().pipe(
          map(accessibleDashboards => accessibleDashboards.includes(partner)),
        ),
      ),
    );
  }

  /**
   * Returns a list of dashboards that the user can access. Users can access a dashboard if they can access any feature on that dashboard
   */
  getAccessibleDashboards(): Rx.Observable<Partner[]> {
    return this.getPartners().pipe(
      map(partners =>
        partners.map(partner =>
          this.getUserPermissions(Rx.of(partner)).pipe(
            map(userPermissions =>
              this.checkAccess(
                Object.values(PartnerDashboardFeature),
                userPermissions,
              )
                ? partner
                : undefined,
            ),
            take(1),
          ),
        ),
      ),
      switchMap(partnerObservableList =>
        partnerObservableList.length
          ? Rx.combineLatest(partnerObservableList).pipe(
              map(list => list.filter(isDefined)),
            )
          : Rx.of([]),
      ),
    );
  }
  /**
   * Checks whether a single feature is accessible by the user on a particular dashboard.
   */
  checkFeatureAccess(
    feature: PartnerDashboardFeature,
    partner: Partner,
  ): Rx.Observable<boolean> {
    return this.getUserPermissions(Rx.of(partner)).pipe(
      map(userPermissions => this.checkAccess([feature], userPermissions)),
    );
  }

  /**
   * Returns true if the user has access to at least one feature in the list.
   */
  private checkAccess(
    features: PartnerDashboardFeature[],
    userPermissions: EntityGrantedPermissionsMap,
  ): boolean {
    return features.some(feature =>
      // A user has access to a feature if they have every permission for every
      // entity type in the feature permissions map.
      (Object.entries(PARTNER_DASHBOARD_FEATURE_PERMISSIONS_MAP[feature]) as [
        EntityTypeApi,
        GrantedPermissionApi[],
      ][]).every(([entityType, permissions]) => {
        const userEntityTypePermissions = userPermissions[entityType];
        return (
          !!userEntityTypePermissions &&
          permissions.every(permission =>
            userEntityTypePermissions.includes(permission),
          )
        );
      }),
    );
  }
}

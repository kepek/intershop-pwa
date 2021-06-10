// tslint:disable: project-structure ish-ordered-imports
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSortable, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';
import { CamfilB2bOrganizationUser } from '../../models/camfil-b2b-organization/camfil-b2b-organization.model';
import { ActivatedRoute, Router } from '@angular/router';

export interface OrganizationFilter {
  search?: string;
  fullAccessUsers?: boolean;
  activeUsers?: boolean;
}

export const sortingDataAccessor = (data, sortHeaderId) => sortHeaderId.split('.').reduce((o, i) => o?.[i], data);

export const filterPredicate = (data: CamfilB2bOrganizationUser, filter: string): boolean => {
  const filters = JSON.parse(filter) as OrganizationFilter;

  // Filter "search"
  let search = true;

  if (filters.search?.length) {
    search = JSON.stringify(data).trim().toLowerCase().indexOf(filters.search.trim().toLowerCase()) !== -1;
  }

  // Filter "fullAccessUsers"
  let fullAccessUsers = true;

  if (filters.fullAccessUsers) {
    fullAccessUsers = !!data.roleIDs.find(
      role => role === 'APP_B2B_ACCOUNT_OWNER' || role === 'APP_B2B_CUSTOMER_ADMIN_USER'
    );
  }

  // Filter "activeUsers"
  let activeUsers = true;

  if (filters.activeUsers) {
    activeUsers = data.active === filters.activeUsers;
  }

  return search && activeUsers && fullAccessUsers;
};

// tslint:disable-next-line: use-component-change-detection
@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class OrganizationPageDataSourceComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private organizationFacade: CamOrganizationManagementFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  private get currentFilter(): OrganizationFilter {
    return {
      ...OrganizationPageDataSourceComponent.defaultFilterValues,
      ...(this.dataSource.filter?.length ? JSON.parse(this.dataSource.filter) : {}),
    };
  }

  static defaultSortValues: MatSortable = {
    id: 'customer.customerNo',
    start: 'desc',
    disableClear: false,
  };

  static defaultFilterValues: OrganizationFilter = {
    search: '',
    activeUsers: true,
    fullAccessUsers: false,
  };

  private destroy$ = new Subject();

  dataSource = new MatTableDataSource<CamfilB2bOrganizationUser>([]);

  dataSourceColumns: string[] = [
    'customer.customerNo',
    'customer.companyName',
    'department',
    'customer.preferredInvoiceToAddress.city',
    'login',
    'roleIDs',
    'active',
    'edit',
  ];

  private isDefaultSortApplied = false;

  private isDefaultFilterApplied = false;

  static serializeFilter<T extends {}>(filterObject: T): string {
    if (!filterObject) {
      return;
    }

    return JSON.stringify(filterObject).trim();
  }

  static deserializeFilter<T>(filterString: string): T {
    if (!filterString) {
      return;
    }

    return { ...JSON.parse(filterString) };
  }

  static serializeSort<T extends Sort>(sort: T): string {
    if (!sort?.direction) {
      return;
    }

    return JSON.stringify(sort);
  }

  static deserializeSort<T extends MatSortable>(sortString: string): T {
    if (!sortString) {
      return;
    }

    const sort = JSON.parse(sortString) as Sort;

    if (!sort.active) {
      return;
    }

    return OrganizationPageDataSourceComponent.mapSortToSortable(sort) as T;
  }

  static mapSortToSortable(sort: Sort): MatSortable {
    return {
      id: sort.active,
      start: sort.direction as PropType<MatSortable, 'start'>,
      disableClear: OrganizationPageDataSourceComponent.defaultSortValues.disableClear,
    };
  }

  static mapSortableToSort(sortable: MatSortable): Sort {
    return {
      active: sortable.id,
      direction: sortable.start,
    };
  }

  private initDataSource() {
    this.users$()
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(users => {
        this.dataSource.data = users;
      });
  }

  applySort(sortable: MatSortable) {
    if (!sortable?.id) {
      return;
    }

    const matSort = this.dataSource.sort;
    const toState = 'active';
    const { id } = sortable;

    matSort.sort({ ...sortable, id: undefined });
    matSort.sort(sortable);

    // ugly hack since setting sort does not update UI when doing that programmatically
    // https://github.com/angular/components/issues/10242
    (matSort.sortables.get(id) as MatSortHeader)._setAnimationTransitionState({ toState });
  }

  private applyDefaultSortIfNotSet() {
    if (!this.isDefaultSortApplied) {
      this.applySort(OrganizationPageDataSourceComponent.defaultSortValues);
    }

    this.isDefaultSortApplied = true;
  }

  private initDataSourceSort() {
    this.dataSource.sortingDataAccessor = sortingDataAccessor;

    this.applyDefaultSortIfNotSet();

    this.dataSource.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe((sort: Sort) => {
      if (this.isDefaultSortApplied) {
        this.router
          .navigate([], {
            queryParams: { sort: OrganizationPageDataSourceComponent.serializeSort(sort) },
            queryParamsHandling: 'merge',
          })
          .then(() => {
            // noop
          });
      }
    });
  }

  private applyDefaultFilterIfNotSet() {
    if (!this.isDefaultFilterApplied) {
      this.applyFilter(OrganizationPageDataSourceComponent.defaultFilterValues);
    }

    this.isDefaultFilterApplied = true;
  }

  private initDataSourceFilter() {
    this.applyDefaultFilterIfNotSet();

    // @ts-ignore
    this.dataSource?._filter.subscribe((filter: string) => {
      if (this.isDefaultFilterApplied) {
        this.router
          .navigate([], {
            queryParams: { filter },
            queryParamsHandling: 'merge',
          })
          .then(() => {
            // noop
          });
      }
    });
  }

  applyFilter(filterValues: OrganizationFilter) {
    if (!filterValues) {
      return;
    }

    this.dataSource.filter = OrganizationPageDataSourceComponent.serializeFilter({
      ...this.currentFilter,
      ...filterValues,
    });
  }

  private initDataSourceFilterQueryParamsObserver() {
    this.activatedRoute.queryParams
      .pipe(
        map(({ filter }) => OrganizationPageDataSourceComponent.deserializeFilter<OrganizationFilter>(filter)),
        whenTruthy()
      )
      .subscribe(filter => {
        this.applyFilter(filter);
      });
  }

  private initDataSourceSortQueryParamsObserver() {
    this.activatedRoute.queryParams
      .pipe(
        whenTruthy(),
        map(({ sort }) => OrganizationPageDataSourceComponent.deserializeSort<MatSortable>(sort))
      )
      .subscribe(sort => {
        this.applySort(sort);
      });
  }

  private initDataSourceFilterPredicate() {
    this.dataSource.filterPredicate = filterPredicate;
  }

  ngOnInit() {
    this.initDataSource();
  }

  ngAfterViewInit() {
    this.initDataSourceFilter();
    this.initDataSourceFilterPredicate();
    this.initDataSourceFilterQueryParamsObserver();
    this.initDataSourceSort();
    this.initDataSourceSortQueryParamsObserver();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loading$() {
    return this.organizationFacade.getOrganizationLoading$();
  }

  users$() {
    return this.organizationFacade.getOrganizationUsers$();
  }
}

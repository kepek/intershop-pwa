// tslint:disable: project-structure ish-ordered-imports
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSortHeader, MatSortable, Sort } from '@angular/material/sort';
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
    fullAccessUsers = !!data.roleIDs.find(role => role === 'APP_B2B_ACCOUNT_OWNER');
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

  private destroy$ = new Subject();

  dataSource = new MatTableDataSource<CamfilB2bOrganizationUser>([]);

  dataSourceColumns: string[] = [
    'customer.customerNo',
    'customer.companyName',
    // 'department', // TODO (extMlk): Verify if this column is required?
    'customer.preferredInvoiceToAddress.city',
    'login',
    'roleIDs',
    'active',
    'edit',
  ];

  defaultSort: MatSortable = {
    id: 'customer.customerNo',
    start: 'desc',
    disableClear: false,
  };

  private isDefaultSortApplied = false;

  defaultFilter: OrganizationFilter = {
    search: '',
    activeUsers: false,
    fullAccessUsers: false,
  };

  private applySort(sortable: MatSortable) {
    if (!sortable) {
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
      this.applySort(this.defaultSort);
    }

    this.isDefaultSortApplied = true;
  }

  private initDataSource() {
    this.users$()
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(users => {
        this.dataSource.data = users;
      });
  }

  private initDataSourceSort() {
    this.applyDefaultSortIfNotSet();

    this.dataSource.sortingDataAccessor = sortingDataAccessor;
    this.dataSource.sort.sortChange.subscribe((sort: Sort) => {
      this.router
        .navigate([], { queryParams: { sort: this.serializeSort(sort) }, queryParamsHandling: 'merge' })
        .then(() => {
          // noop
        });
    });
  }

  private initDataSourceSortQueryParamsObserver() {
    this.activatedRoute.queryParams
      .pipe(
        whenTruthy(),
        map(({ sort }) => this.deserializeSort<MatSortable>(sort))
      )
      .subscribe(sort => {
        this.applySort(sort);
      });
  }

  private initDataSourceFilterPredicate() {
    this.dataSource.filterPredicate = filterPredicate;
  }

  private serializeSort<T extends Sort>(sort: T): string {
    if (!sort?.direction) {
      return;
    }

    return JSON.stringify(sort);
  }

  private deserializeSort<T extends MatSortable>(sortString: string): T {
    if (!sortString) {
      return;
    }

    const sort = JSON.parse(sortString) as Sort;

    if (!sort.active) {
      return;
    }

    return this.mapSortToSortable(sort) as T;
  }

  protected mapSortToSortable(sort: Sort): MatSortable {
    return {
      id: sort.active,
      start: sort.direction as PropType<MatSortable, 'start'>,
      disableClear: this.defaultSort.disableClear,
    };
  }

  protected mapSortableToSort(sortable: MatSortable): Sort {
    return {
      active: sortable.id,
      direction: sortable.start,
    };
  }

  ngOnInit() {
    this.initDataSource();
  }

  ngAfterViewInit() {
    this.initDataSourceFilterPredicate();
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

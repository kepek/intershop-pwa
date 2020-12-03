import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilB2bOrganizationUser } from '../../models/camfil-b2b-organization/camfil-b2b-organization.model';
import { OrganizationFilter } from '../../pages/organization/orgniazation-page.data-source';

@Component({
  selector: 'camfil-organization-users-list-toolbar',
  templateUrl: './camfil-organization-users-list-toolbar.component.html',
  styleUrls: ['./camfil-organization-users-list-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:ban-comma-operator
export class CamfilOrganizationUsersListToolbarComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {}

  private destroy$ = new Subject();

  @Input() dataSource: MatTableDataSource<CamfilB2bOrganizationUser>;

  isActive = false;

  filterForm: FormGroup;

  defaultFilterValues: OrganizationFilter = {
    search: '',
    activeUsers: false,
    fullAccessUsers: false,
  };

  ngOnInit() {
    this.initFilterForm();
    this.initFilterQueryParamsObserver();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get count() {
    if (!this.dataSource) {
      return 0;
    }

    const { filteredData, data } = this.dataSource;
    return (filteredData || data || []).length;
  }

  private initFilterForm() {
    const controlsConfig: {
      // tslint:disable-next-line:no-any
      [key: string]: any;
    } = {};

    Object.keys(this.defaultFilterValues).forEach(key => {
      controlsConfig[key] = [this.defaultFilterValues[key]];
    });

    this.filterForm = this.fb.group(controlsConfig);
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((filterValues: OrganizationFilter) => {
      this.applyFilter(filterValues);
    });
  }

  private initFilterQueryParamsObserver() {
    this.activatedRoute.queryParams
      .pipe(
        whenTruthy(),
        map(({ filter }) => this.deserializeFilter<OrganizationFilter>(filter))
      )
      .subscribe(filter => {
        // tslint:disable-next-line:no-unused-expression
        filter && this.filterForm.setValue(filter);
      });
  }

  private applyFilter(filterValues: OrganizationFilter) {
    const filter = this.serializeFilter(filterValues);

    this.dataSource.filter = filter;
    this.router.navigate([], { queryParams: { filter }, queryParamsHandling: 'merge' }).then(() => {
      // noop
    });
  }

  private get currentFilter(): OrganizationFilter {
    return {
      ...this.defaultFilterValues,
      ...(this.dataSource.filter?.length ? JSON.parse(this.dataSource.filter) : {}),
    };
  }

  private serializeFilter<T>(filterObject: T): string {
    if (!filterObject) {
      return;
    }

    return JSON.stringify({ ...this.currentFilter, ...filterObject }).trim();
  }

  private deserializeFilter<T>(filterString: string): T {
    if (!filterString) {
      return;
    }

    return { ...this.currentFilter, ...JSON.parse(filterString) };
  }
}

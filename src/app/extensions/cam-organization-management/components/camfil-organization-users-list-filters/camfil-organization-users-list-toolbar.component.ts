// tslint:disable: project-structure ish-ordered-imports ban-specific-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CamfilB2bOrganizationUser } from '../../models/camfil-b2b-organization/camfil-b2b-organization.model';
import {
  OrganizationFilter,
  OrganizationPageDataSourceComponent,
} from '../../pages/organization/orgniazation-page.data-source';

@Component({
  selector: 'camfil-organization-users-list-toolbar',
  templateUrl: './camfil-organization-users-list-toolbar.component.html',
  styleUrls: ['./camfil-organization-users-list-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilOrganizationUsersListToolbarComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder) {}

  private destroy$ = new Subject();

  @Input() dataSource: MatTableDataSource<CamfilB2bOrganizationUser>;

  @Output() applyFilter = new EventEmitter<OrganizationFilter>();

  isActive = false;

  filterForm: FormGroup;

  ngOnInit() {
    this.initFilterForm();
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

    Object.keys(OrganizationPageDataSourceComponent.defaultFilterValues).forEach(key => {
      controlsConfig[key] = [OrganizationPageDataSourceComponent.defaultFilterValues[key]];
    });

    this.filterForm = this.fb.group(controlsConfig);
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((filterValues: OrganizationFilter) => {
      this.applyFilter.emit(filterValues);
    });
  }
}

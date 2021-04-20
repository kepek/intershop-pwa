// tslint:disable: project-structure ish-ordered-imports ban-specific-imports

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CamfilB2bOrganizationUser } from '../../models/camfil-b2b-organization/camfil-b2b-organization.model';
import { OrganizationPageDataSourceComponent } from '../../pages/organization/orgniazation-page.data-source';

@Component({
  selector: 'camfil-organization-users-list',
  templateUrl: './camfil-organization-users-list.component.html',
  styleUrls: ['./camfil-organization-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationUsersListComponent implements AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() dataSource: MatTableDataSource<CamfilB2bOrganizationUser>;
  @Input() dataSourceColumns: string[];

  @Output() applySort = new EventEmitter<MatSortable>();

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onSortChange(sort: Sort) {
    this.applySort.emit(OrganizationPageDataSourceComponent.mapSortToSortable(sort));
  }
}

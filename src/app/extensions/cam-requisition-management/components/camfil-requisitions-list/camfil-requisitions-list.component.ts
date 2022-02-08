import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { Requisition, RequisitionListFilter, RequisitionViewer } from '../../models/requisition/requisition.model';

@Component({
  selector: 'camfil-requisitions-list',
  templateUrl: './camfil-requisitions-list.component.html',
  styleUrls: ['./camfil-requisitions-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionsListComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChildren('statusFilters') statusFilters: QueryList<MatCheckbox>;

  @Input() columnsToDisplay: string[];
  @Input() deviceType: DeviceType;
  @Input() view: RequisitionViewer = 'buyer';
  requisitions$: Observable<Requisition[]>;
  requisitions: Requisition[];
  isActive = false;
  filteredValues: RequisitionListFilter;
  dataSource = new MatTableDataSource<Requisition>();
  searchForm = new FormControl();
  customerFilter = new FormControl();
  statuses = [];
  customers = [];
  filterCheckboxes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  dateFromFilter = new FormControl(new Date(new Date().setDate(new Date().getDate() - 90)));
  dateToFilter = new FormControl(new Date());
  isMobileView = false;
  showPreview = true;
  tableSize = 4;
  private destroy$ = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private camRequisitionManagementFacade: CamRequisitionManagementFacade
  ) {}

  ngOnInit() {
    this.camRequisitionManagementFacade.requisitionsByRoute$?.pipe(takeUntil(this.destroy$)).subscribe(requisitions => {
      this.requisitions = requisitions;
      this.dataSource.data = requisitions;
      this.dataSource.filterPredicate = this.requisitionFilterPredicate();
      this.statuses = this.getStatuses();
      this.customers = this.getCustomers(this.dataSource.data);

      if (!this.filteredValues?.requisitionStatus) {
        this.filteredValues = {
          ...this.filteredValues,
          requisitionStatus: ['Pending', 'Approved'],
        };

        if (this.filteredValues.requisitionStatus && this.filteredValues.requisitionStatus.length) {
          this.applyFilters();
        }
      }
      this.dataSource.sort = this.sort;
      this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
    });

    this.activatedRoute.queryParams
      .pipe(map(({ filter }) => filter || '{}'))
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => {
        this.filteredValues = JSON.parse(filter);
      });

    this.applyFilters();

    if (this.filteredValues.dateTo) {
      const dateTo = new Date(this.filteredValues.dateTo);
      this.filteredValues.dateTo = dateTo.toISOString();
    }
  }

  ngOnChanges() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.statusFilters.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // set requisition status checkboxes according to url parameters
      this.statusFilters.forEach((checkbox: MatCheckbox) => {
        if (this.filteredValues.requisitionStatus) {
          this.filteredValues.requisitionStatus.forEach(status => {
            if (checkbox.value === status) {
              checkbox.checked = true;
              this.filterCheckboxes$.next(this.filteredValues.requisitionStatus);
            }
          });
        }
      });
    });

    this.searchForm.setValue(this.filteredValues?.search);
    this.searchForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.search = filterValue === '' ? undefined : filterValue;
      this.applyFilters();
    });

    this.customerFilter.setValue(this.filteredValues.customer);
    this.customerFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.customer = filterValue;
      this.applyFilters();
    });

    if (this.filteredValues.dateFrom) {
      this.dateFromFilter.setValue(this.filteredValues.dateFrom);
    }
    this.dateFromFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      const dateFrom = new Date(filterValue);
      dateFrom.setHours(0, 0, 0);
      dateFrom.setTime(dateFrom.getTime() - dateFrom.getTimezoneOffset() * 60 * 1000);
      this.filteredValues.dateFrom = dateFrom.toISOString();
      this.applyFilters();
    });

    // set and subscribe to dateTo changes
    if (this.filteredValues.dateTo) {
      const dateTo = new Date(this.filteredValues.dateTo);
      dateTo.setDate(dateTo.getDate() - 1);
      this.dateToFilter.setValue(dateTo.toISOString());
    }
    this.dateToFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      const dateTo = new Date(filterValue);
      dateTo.setHours(23, 59, 59);
      dateTo.setTime(dateTo.getTime() - dateTo.getTimezoneOffset() * 60 * 1000);
      this.filteredValues.dateTo = dateTo.toISOString();
      this.applyFilters();
    });

    // @ts-ignore
    this.dataSource?._filter.subscribe((filter: string) => {
      this.router
        .navigate([], {
          queryParams: { filter },
          queryParamsHandling: 'merge',
        })
        .then(() => {
          this.searchInput?.nativeElement?.focus();
        });
    });
  }

  applyFilters() {
    const filter = JSON.stringify(this.filteredValues);
    this.dataSource.filter = filter.trim();
  }

  requisitionFilterPredicate() {
    return (data: Requisition, filterString: string): boolean => {
      const filters = JSON.parse(filterString) as RequisitionListFilter;
      // Check search string
      const isSearchMatching = true;
      // TODO: Add requireds fields to filter requisitions list (Customer | Request number)
      const textSearchData = {
        customerNo: data.customerNo,
        requisitionNo: data.requisitionNo,
      };

      if (
        filters.search &&
        JSON.stringify(Object.values(textSearchData))
          .trim()
          .toLowerCase()
          .indexOf(filters.search.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check status filter
      let isStatusMatching = false;
      if (filters.requisitionStatus && filters.requisitionStatus.length) {
        for (const status of filters.requisitionStatus) {
          if (data.approval.status.trim().toLowerCase() === status.trim().toLowerCase()) {
            isStatusMatching = true;
            break;
          }
        }
      }

      const isCustomerMatching = true;
      if (
        filters.customer &&
        data.customerNo.toString().trim().toLowerCase().indexOf(filters.customer.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check date filters
      let isInDateRange = true;
      if (filters.dateFrom && !(Date.parse(filters.dateFrom) <= Number(data.creationDate))) {
        isInDateRange = false;
      }
      if (filters.dateTo && !(Date.parse(filters.dateTo) >= Number(data.creationDate))) {
        isInDateRange = false;
      }

      return isSearchMatching && isStatusMatching && isCustomerMatching && isInDateRange;
    };
  }

  getStatuses() {
    const correctValues = [
      {
        approvalStatusName: 'account.requisitions.approvals.navtab.waiting',
        requisitionStatusName: 'account.requisitions.requisitions.navtab.pending',
        value: 'Pending',
      },
      {
        approvalStatusName: 'account.requisitions.approvals.navtab.rejected',
        requisitionStatusName: 'account.requisitions.requisitions.navtab.rejected',
        value: 'Rejected',
      },
      {
        approvalStatusName: 'account.requisitions.approvals.navtab.approved',
        requisitionStatusName: 'account.requisitions.requisitions.navtab.approved',
        value: 'Approved',
      },
    ];

    return [...new Set(correctValues)];
  }

  getCustomers(data) {
    const customers = [...new Map(data.map(item => [item.customerNo, item])).values()];

    return [undefined, ...customers];
  }

  addStatusFilter(change: MatCheckboxChange) {
    if (change.source.checked) {
      this.filteredValues = {
        ...this.filteredValues,
        requisitionStatus: this.filteredValues.requisitionStatus.concat(change.source.value),
      };

      this.applyFilters();
    } else if (!change.source.checked) {
      this.filteredValues = {
        ...this.filteredValues,
        requisitionStatus: this.filteredValues.requisitionStatus.filter(
          (a: string) => a.toLowerCase().trim() !== change.source.value.toLowerCase().trim()
        ),
      };

      this.applyFilters();
    }
  }

  isStatusFilterActive(status: string) {
    return (
      (this.filteredValues.requisitionStatus && this.filteredValues.requisitionStatus.indexOf(status) > -1) || false
    );
  }

  navigateTo(requisition) {
    this.router.navigate([`/account/requisitions/${this.view}/${requisition.id}`], { queryParamsHandling: 'preserve' });
  }

  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  displayShowMoreLink() {
    return this.showPreview && this.isMaxTableLength();
  }

  showAllOrders() {
    this.showPreview = false;
    this.tableSize = this.dataSource.filteredData.length;
  }

  isMaxTableLength() {
    return this.dataSource.filteredData.length >= this.tableSize;
  }
}

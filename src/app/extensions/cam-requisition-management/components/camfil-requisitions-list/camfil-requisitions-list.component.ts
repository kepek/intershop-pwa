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
import {
  CamfilRequisition,
  CamfilRequisitionListFilter,
  CamfilRequisitionViewer,
} from '../../models/camfil-requisition/camfil-requisition.model';

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
  @Input() view: CamfilRequisitionViewer = 'buyer';

  requisitions$: Observable<CamfilRequisition[]>;
  requisitions: CamfilRequisition[];
  isActive = false;
  filteredValues: CamfilRequisitionListFilter;
  dataSource = new MatTableDataSource<CamfilRequisition>();
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
  approvalsChecked = [];
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

      if (!this.filteredValues?.camfilRequisitionStatus) {
        this.filteredValues = {
          ...this.filteredValues,
          camfilRequisitionStatus: ['Pending', 'Approved', 'Partial Approved'],
        };

        if (this.filteredValues.camfilRequisitionStatus && this.filteredValues.camfilRequisitionStatus.length) {
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
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'customerNumberAndName': {
          /* tslint:disable:no-string-literal */
          return `${item.customerNo['companyName']} ${item.customerNo['customerNo']}`;
        }
        case 'buyer': {
          return `${item.user.firstName} ${item.user.lastName}`;
        }
        case 'status': {
          return `${item.approval.status}`;
        }
        default: {
          return item[property];
        }
      }
    };
    this.statusFilters.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // set requisition status checkboxes according to url parameters
      this.statusFilters.forEach((checkbox: MatCheckbox) => {
        if (this.filteredValues.camfilRequisitionStatus) {
          this.filteredValues.camfilRequisitionStatus.forEach(status => {
            if (checkbox.value === status) {
              checkbox.checked = true;
              this.filterCheckboxes$.next(this.filteredValues.camfilRequisitionStatus);
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
    return (data: CamfilRequisition, filterString: string): boolean => {
      const filters = JSON.parse(filterString) as CamfilRequisitionListFilter;
      // Check search string
      const isSearchMatching = true;

      const textSearchData = {
        customerNo: data.requisitionCustomer.customerNo,
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
      if (filters.camfilRequisitionStatus && filters.camfilRequisitionStatus.length) {
        for (const status of filters.camfilRequisitionStatus) {
          if (data.approval.status.trim().toLowerCase() === status.trim().toLowerCase()) {
            isStatusMatching = true;
            break;
          }
        }
      }

      const isCustomerMatching = true;
      if (
        filters.customer &&
        data.requisitionCustomer.customerNo
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(filters.customer.toString().trim().toLowerCase()) === -1
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
        camfilRequisitionStatusName: 'account.requisitions.requisitions.navtab.pending',
        value: 'Pending',
      },
      {
        approvalStatusName: 'account.requisitions.approvals.navtab.partially_approved',
        camfilRequisitionStatusName: 'account.requisitions.requisitions.navtab.partly_approved',
        value: 'Partial Approved',
      },
      {
        approvalStatusName: 'account.requisitions.approvals.navtab.rejected',
        camfilRequisitionStatusName: 'account.requisitions.requisitions.navtab.rejected',
        value: 'Rejected',
      },
      {
        approvalStatusName: 'account.requisitions.approvals.navtab.approved',
        camfilRequisitionStatusName: 'account.requisitions.requisitions.navtab.approved',
        value: 'Approved',
      },
    ];

    return [...new Set(correctValues)];
  }

  getCustomers(data: CamfilRequisition[]) {
    const customers = [
      ...new Map(data.map(item => [item.requisitionCustomer.customerNo, item.requisitionCustomer])).values(),
    ];

    return [undefined, ...customers];
  }

  addStatusFilter(change: MatCheckboxChange) {
    if (change.source.checked) {
      this.filteredValues = {
        ...this.filteredValues,
        camfilRequisitionStatus: this.filteredValues.camfilRequisitionStatus.concat(change.source.value),
      };

      this.applyFilters();
    } else if (!change.source.checked) {
      this.filteredValues = {
        ...this.filteredValues,
        camfilRequisitionStatus: this.filteredValues.camfilRequisitionStatus.filter(
          (a: string) => a.toLowerCase().trim() !== change.source.value.toLowerCase().trim()
        ),
      };

      this.applyFilters();
    }
  }

  isStatusFilterActive(status: string) {
    return (
      (this.filteredValues.camfilRequisitionStatus &&
        this.filteredValues.camfilRequisitionStatus.indexOf(status) > -1) ||
      false
    );
  }

  navigateTo(requisition) {
    this.router.navigate([`/account/requisitions/${this.view}/${requisition.id}`], {
      queryParamsHandling: 'preserve',
    });
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

  toggleAllApprovalsCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.approvalsChecked = this.requisitions
        .filter(
          requisiton => requisiton.approval.status === 'Pending' || requisiton.approval.status === 'Partial Approved'
        )
        .map(lineItem => lineItem.id);
    } else {
      this.approvalsChecked = [];
    }
  }

  toggleApprovalCheck(requisitionId: string, event: MatCheckboxChange) {
    if (event.checked) {
      this.approvalsChecked = [...new Set([...this.approvalsChecked, requisitionId])];
    } else {
      this.approvalsChecked = [...this.approvalsChecked].filter(el => el !== requisitionId);
    }
  }

  isApprovalChecked(requisitionId: string) {
    return this.approvalsChecked.findIndex(item => item === requisitionId) > -1;
  }

  approveMultipleRequisitions() {
    this.camRequisitionManagementFacade.approveMultipleRequisitions$(this.approvalsChecked);
    this.approvalsChecked = [];
  }

  rejectMultipleRequisitions(comment: string) {
    this.camRequisitionManagementFacade.rejectMultipleRequisitions$(this.approvalsChecked, comment);
    this.approvalsChecked = [];
    return false;
  }
}

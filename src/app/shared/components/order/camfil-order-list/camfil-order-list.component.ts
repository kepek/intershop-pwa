import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order List Container Component fetches order data and displays them all
 *
 * @example
 * displays all orders in a compact manner.
 * <camfil-order-list></camfil-order-list>
 */
export interface OrderFilter {
  customer: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  status: string[];
}

@Component({
  selector: 'camfil-order-list',
  templateUrl: './camfil-order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-order-list.scss'],
})
export class CamfilOrderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  dataSource = new MatTableDataSource<Order>();
  isActive = false;
  showPreview = true;
  previewSize = 16;
  inputSearchTerm = '';
  inputFocused: boolean;
  statuses = [];
  customers = [];
  filterCheckboxes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  searchInputFilter = new FormControl();
  customerFilter = new FormControl();
  dateFromFilter = new FormControl(new Date());
  dateToFilter = new FormControl(new Date());
  filteredValues: OrderFilter = {
    customer: '',
    dateFrom: '',
    dateTo: '',
    status: [],
    search: '',
  };
  displayedColumns: string[] = [
    'customer',
    'documentNo',
    'camfilNo',
    'mark',
    'creationDate',
    'derliveryDate',
    'status',
    'channel',
  ];
  private destroy$ = new Subject();
  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.dateFromFilter.value.setMonth(this.dateFromFilter.value.getMonth() - 3);
    this.accountFacade
      .orders$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.dataSource.data = orders;
        this.dataSource.filterPredicate = this.orderFilterPredicate();
        this.dataSource.filter = JSON.stringify(this.filteredValues);

        // Prepare filters
        this.statuses = this.getStatuses(this.dataSource.data);
        this.customers = this.getCustomers(this.dataSource.data);
      });

    // subscribe to checkbox changes
    this.filterCheckboxes$.pipe(takeUntil(this.destroy$)).subscribe((statuses: []) => {
      this.filteredValues.status = statuses;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    // subscribe to search input changes
    this.searchInputFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.search = filterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    // subscribe to customer select changes
    this.customerFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.customer = filterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    // subscribe to dateFrom changes
    this.dateFromFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.dateFrom = filterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    // subscribe to dateTo changes
    this.dateToFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      const dateTo = new Date(filterValue);
      dateTo.setHours(23, 59, 59);
      this.filteredValues.dateTo = dateTo.toISOString();
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.sort = this.sort;
    this.loading$ = this.accountFacade.ordersLoading$;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  focus() {
    this.inputFocused = true;
  }

  navigateTo(order) {
    this.router.navigate(['/account/orders/' + order.id]);
  }

  getStatuses(data) {
    return [...new Set(data.map(item => item.status))];
  }

  getCustomers(data) {
    return [undefined, ...new Set(data.map(item => item.customer))];
  }

  addStatusFilter(change: MatCheckboxChange) {
    if (this.filteredValues.status.some((a: string) => a === change.source.value)) {
      this.filterCheckboxes$.next(this.filteredValues.status.filter((a: string) => a !== change.source.value));
    } else {
      this.filterCheckboxes$.next(this.filteredValues.status.concat(change.source.value));
    }
  }

  orderFilterPredicate() {
    return (data: Order, filter: string): boolean => {
      const filterString = JSON.parse(filter) as OrderFilter;

      // Check search string
      const isSearchMatching = true;
      if (
        filterString.search &&
        JSON.stringify(data).trim().toLowerCase().indexOf(filterString.search.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check status filter
      let isStatusMatching = true;
      if (filterString.status.length) {
        for (const d of filterString.status) {
          if (data.status.toString().trim() === d) {
            isStatusMatching = false;
            break;
          }
        }
      }

      // Check customer filter
      const isCustomerMatching = true;
      if (
        filterString.customer &&
        data.customer.toString().trim().toLowerCase().indexOf(filterString.customer.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check date filters
      let isInDateRange = true;
      if (filterString.dateFrom && !(Date.parse(filterString.dateFrom) <= data.creationDate)) {
        isInDateRange = false;
      }
      if (filterString.dateTo && !(Date.parse(filterString.dateTo) >= data.creationDate)) {
        isInDateRange = false;
      }
      return isSearchMatching && isStatusMatching && isCustomerMatching && isInDateRange;
    };
  }

  displayShowMoreLink() {
    return this.showPreview && this.isMaxTableLength();
  }

  showAllOrders() {
    this.showPreview = false;
    this.previewSize = Number.MAX_VALUE;
  }

  isMaxTableLength() {
    return this.dataSource.filteredData.length >= this.previewSize;
  }
}

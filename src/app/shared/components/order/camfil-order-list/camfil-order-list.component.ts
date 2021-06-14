import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
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
import { map, takeUntil } from 'rxjs/operators';
import { CamAccountFacade } from 'src/app/extensions/cam-account/facades/cam-account.facade';
import { Order } from 'src/app/extensions/cam-account/models/order/order.model';

/**
 * The Order List Container Component fetches order data and displays them all
 *
 * @example
 * displays all orders in a compact manner.
 * <camfil-order-list></camfil-order-list>
 */
export interface OrderFilter {
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  orderStatus?: string[];
}

@Component({
  selector: 'camfil-order-list',
  templateUrl: './camfil-order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-order-list.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class CamfilOrderListComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChildren('statusFilters') statusFilters: QueryList<MatCheckbox>;

  orders$: Observable<Order[]>;
  orders: Order[];
  loading$: Observable<boolean>;
  dataSource = new MatTableDataSource<Order>();
  isActive = false;
  showPreview = true;
  tableSize = 16;
  inputFocused: boolean;
  statuses = [];
  customers = [];
  filterCheckboxes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  searchInputFilter = new FormControl();
  customerFilter = new FormControl();
  dateFromFilter = new FormControl(new Date(new Date().setDate(new Date().getDate() - 90)));
  dateToFilter = new FormControl(new Date());
  filteredValues: OrderFilter;
  displayedColumns: string[] = [
    'customerName',
    'orderNumber',
    'camfilNo',
    'orderGoodsMark',
    'orderDate',
    'deliveryDate',
    'orderStatus',
    'orderChannel',
  ];
  private destroy$ = new Subject();
  isMobileView = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private camAccountFacade: CamAccountFacade
  ) {}

  ngOnInit() {
    this.camAccountFacade
      .orders$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.dataSource.data = orders;
        this.statuses = this.getStatuses();
        this.orders = orders;
        this.dataSource.filterPredicate = this.orderFilterPredicate();
        this.customers = this.getCustomers(this.dataSource.data);
        if (!this.filteredValues?.orderStatus) {
          this.filteredValues = {
            ...this.filteredValues,
            orderStatus: this.statuses,
          };

          if (this.filteredValues.orderStatus && this.filteredValues.orderStatus.length) {
            this.applyFilters();
          }
        }
      });

    // recover filters settings from url params
    this.activatedRoute.queryParams
      .pipe(map(({ filter }) => filter || '{}'))
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => {
        this.filteredValues = JSON.parse(filter);
      });
    this.applyFilters();

    // remove time zone shift
    if (this.filteredValues.dateTo) {
      const dateTo = new Date(this.filteredValues.dateTo);
      this.filteredValues.dateTo = dateTo.toISOString();
    }

    this.dataSource.sort = this.sort;
    this.loading$ = this.camAccountFacade.ordersLoading$;

    // Mobile view?
    this.onResize();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    let statusFiltersReady = false;
    this.statusFilters.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // set order status checkboxes according to url parans
      statusFiltersReady = true;
      this.statusFilters.forEach((checkbox: MatCheckbox) => {
        if (this.filteredValues.orderStatus) {
          this.filteredValues.orderStatus.forEach(status => {
            if (checkbox.value === status) {
              checkbox.checked = true;
              this.filterCheckboxes$.next(this.filteredValues.orderStatus);
            }
          });
        }
      });
    });

    // subscribe to order status checkbox changes
    this.filterCheckboxes$.pipe(takeUntil(this.destroy$)).subscribe((stat: []) => {
      if (statusFiltersReady) {
        this.filteredValues.orderStatus = stat;
        this.applyFilters();
      }
    });

    // set and subscribe to search input changes
    this.searchInputFilter.setValue(this.filteredValues.search);
    this.searchInputFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.search = filterValue;
      this.applyFilters();
    });

    // set and subscribe to customer select changes
    this.customerFilter.setValue(this.filteredValues.customer);
    this.customerFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.customer = filterValue;
      this.applyFilters();
    });

    // set and subscribe to dateFrom changes
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
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  focus() {
    this.inputFocused = true;
  }

  navigateTo(order) {
    this.router.navigate(['/account/orders/' + order.id], { queryParamsHandling: 'preserve' });
  }

  getStatuses() {
    const correctValues = ['Created', 'Received', 'Confirmed', 'Delivered', 'Invoiced'];
    return [...new Set(correctValues)];
  }

  getCustomers(data) {
    return [undefined, ...new Set(data.map(item => item.customerName))];
  }

  addStatusFilter(change: MatCheckboxChange) {
    if (change.source.checked) {
      this.filteredValues = {
        ...this.filteredValues,
        orderStatus: this.filteredValues.orderStatus.concat(change.source.value),
      };

      this.applyFilters();
    } else if (!change.source.checked) {
      this.filteredValues = {
        ...this.filteredValues,
        orderStatus: this.filteredValues.orderStatus.filter(
          (a: string) => a.toLowerCase().trim() !== change.source.value.toLowerCase().trim()
        ),
      };

      this.applyFilters();
    }
  }

  orderFilterPredicate() {
    return (data: Order, filterString: string): boolean => {
      const filters = JSON.parse(filterString) as OrderFilter;

      // Check search string
      const isSearchMatching = true;
      const textSearchData = {
        orderNumber: data.orderNumber,
        customerOrderNumber: data.customerOrderNumber,
        orderGoodsMark: data.orderGoodsMark,
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
      if (filters.orderStatus && filters.orderStatus.length) {
        for (const status of filters.orderStatus) {
          if (data.orderStatus.trim().toLowerCase() === status.trim().toLowerCase()) {
            isStatusMatching = true;
            break;
          }
        }
      }

      // Check customer filter
      const isCustomerMatching = true;
      if (
        filters.customer &&
        data.customerName.toString().trim().toLowerCase().indexOf(filters.customer.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check date filters
      let isInDateRange = true;
      if (filters.dateFrom && !(Date.parse(filters.dateFrom) <= Number(data.orderDate))) {
        isInDateRange = false;
      }
      if (filters.dateTo && !(Date.parse(filters.dateTo) >= Number(data.orderDate))) {
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
    this.tableSize = this.dataSource.filteredData.length;
  }

  isMaxTableLength() {
    return this.dataSource.filteredData.length >= this.tableSize + 2; // 2 preview rows will be visible below "show more" overlay
  }

  /**
   * Apply the active filters on the data source and update the url parameters
   */
  applyFilters() {
    const filter = JSON.stringify(this.filteredValues);
    this.dataSource.filter = filter.trim();
    this.router.navigate([], { queryParams: { filter } });
  }

  countRows() {
    return this.dataSource.filteredData.length < this.tableSize ? this.dataSource.filteredData.length : this.tableSize;
  }

  isStatusFilterActive(status: string) {
    return (this.filteredValues.orderStatus && this.filteredValues.orderStatus.indexOf(status) > -1) || false;
  }

  onResize() {
    this.isMobileView = window.innerWidth <= 768;
  }
}

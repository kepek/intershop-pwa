import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  status?: string[];
}

@Component({
  selector: 'camfil-order-list',
  templateUrl: './camfil-order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-order-list.scss'],
})
export class CamfilOrderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChildren('statusFilters') statusFilters: QueryList<MatCheckbox>;

  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  dataSource = new MatTableDataSource<Order>();
  isActive = false;
  showPreview = true;
  previewSize = 16;
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
  constructor(private accountFacade: AccountFacade, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.accountFacade
      .orders$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.dataSource.data = orders;
        this.dataSource.filterPredicate = this.orderFilterPredicate();
        this.customers = this.getCustomers(this.dataSource.data);
      });

    // recover filters settings from url params
    this.activatedRoute.queryParams
      .pipe(map(({ filter }) => filter || '{}'))
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => {
        this.filteredValues = JSON.parse(filter);
      });

    this.dataSource.sort = this.sort;
    this.loading$ = this.accountFacade.ordersLoading$;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    let statusFiltersReady = false;
    this.statusFilters.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // set order status checkboxes according to url parans
      statusFiltersReady = true;
      this.statusFilters.forEach((checkbox: MatCheckbox) => {
        if (this.filteredValues.status) {
          this.filteredValues.status.forEach(status => {
            if (checkbox.value === status) {
              checkbox.checked = false;
              this.filterCheckboxes$.next(this.filteredValues.status);
            }
          });
        }
      });
    });

    // subscribe to order status checkbox changes
    this.filterCheckboxes$.pipe(takeUntil(this.destroy$)).subscribe((stat: []) => {
      if (statusFiltersReady) {
        this.filteredValues.status = stat;
        this.updateFilter(this.filteredValues);
      }
    });

    // initialize checkboxes
    this.accountFacade
      .orders$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.statuses = this.getStatuses(this.dataSource.data);
      });

    // set and subscribe to search input changes
    this.searchInputFilter.setValue(this.filteredValues.search);
    this.searchInputFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.search = filterValue;
      this.updateFilter(this.filteredValues);
    });

    // set and subscribe to customer select changes
    this.customerFilter.setValue(this.filteredValues.customer);
    this.customerFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.customer = filterValue;
      this.updateFilter(this.filteredValues);
    });

    // set and subscribe to dateFrom changes
    if (this.filteredValues.dateFrom) {
      this.dateFromFilter.setValue(this.filteredValues.dateFrom);
    }
    this.dateFromFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.filteredValues.dateFrom = filterValue;
      this.updateFilter(this.filteredValues);
    });

    // set and subscribe to dateTo changes
    if (this.filteredValues.dateTo) {
      this.dateToFilter.setValue(this.filteredValues.dateTo);
    }
    this.dateToFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      const dateTo = new Date(filterValue);
      dateTo.setHours(23, 59, 59);
      this.filteredValues.dateTo = dateTo.toISOString();
      this.updateFilter(this.filteredValues);
    });
  }

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

  getStatuses(data) {
    return [...new Set(data.map(item => item.status))];
  }

  getCustomers(data) {
    return [undefined, ...new Set(data.map(item => item.customer))];
  }

  addStatusFilter(change: MatCheckboxChange) {
    if (this.filteredValues.status.some((a: string) => a === change.source.value) && change.source.checked) {
      this.filterCheckboxes$.next(this.filteredValues.status.filter((a: string) => a !== change.source.value));
    } else if (!change.source.checked) {
      this.filterCheckboxes$.next(this.filteredValues.status.concat(change.source.value));
    }
  }

  orderFilterPredicate() {
    return (data: Order, filterString: string): boolean => {
      const filters = JSON.parse(filterString) as OrderFilter;

      // Check search string
      const isSearchMatching = true;
      if (
        filters.search &&
        JSON.stringify(data).trim().toLowerCase().indexOf(filters.search.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check status filter
      let isStatusMatching = true;
      if (filters.status && filters.status.length) {
        for (const status of filters.status) {
          if (data.status.trim().toLowerCase() === status) {
            isStatusMatching = false;
            break;
          }
        }
      }

      // Check customer filter
      const isCustomerMatching = true;
      if (
        filters.customer &&
        data.customer.toString().trim().toLowerCase().indexOf(filters.customer.trim().toLowerCase()) === -1
      ) {
        return false;
      }

      // Check date filters
      let isInDateRange = true;
      if (filters.dateFrom && !(Date.parse(filters.dateFrom) <= data.creationDate)) {
        isInDateRange = false;
      }
      if (filters.dateTo && !(Date.parse(filters.dateTo) >= data.creationDate)) {
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

  updateFilter(filteredValues) {
    const filter = JSON.stringify(filteredValues);
    this.dataSource.filter = filter.trim().toLowerCase();
    this.router.navigate([], { queryParams: { filter } });
  }
}

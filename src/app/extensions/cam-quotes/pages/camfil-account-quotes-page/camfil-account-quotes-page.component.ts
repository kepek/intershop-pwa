import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

import { QuotesApproveDialogComponent } from '../../components/quotes-approve-dialog/quotes-approve-dialog.component';
import { QuotesRejectDialogComponent } from '../../components/quotes-reject-dialog/quotes-reject-dialog.component';
import { CamQuotesFacade } from '../../facades/cam-quotes.facade';
import { Quote, QuoteStatus as QuoteStatusEnum } from '../../models/quote/quote.model';

interface QuotesFilters {
  search?: string;
  customer?: string;
  requestor?: string[];
  type?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  stateRequested?: boolean;
  stateReceived?: boolean;
  stateApproved?: boolean;
  stateRejected?: boolean;
  stateExpired?: boolean;
}

@Component({
  selector: 'camfil-account-quotes-page',
  styleUrls: ['./camfil-account-quotes-page.component.scss'],
  templateUrl: './camfil-account-quotes-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class CamfilAccountQuotesPageComponent implements OnInit, OnDestroy, AfterViewInit {
  allQuotes: Quote[];
  filteredQuotes: Quote[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  dataSource: MatTableDataSource<Quote>;
  @ViewChild(MatSort) matSort: MatSort;
  previewNumRows = 16;
  showAll = false;
  displayedColumns = [
    'check',
    'customer',
    'camfilQuoteNumber',
    'customerQuoteNumber',
    'requestedBy',
    'requestedDate',
    'quotationDate',
    'status',
    'orderChannel',
  ];

  statusEnum = QuoteStatusEnum;
  states = ['Requested', 'Received', 'Approved', 'Rejected', 'Expired'];

  filtersForm: FormGroup;
  filters$: Observable<QuotesFilters>;
  filtersQueryParams: {
    filter: string;
  };

  customers: string[];
  requestors: string[];

  selectedQuotes: Quote[] = [];
  selectedQuotesMap: {
    [key: string]: boolean;
  } = {};

  isMobileView = false;

  lastRejectReason: string;

  constructor(
    private cd: ChangeDetectorRef,
    private quotesFacade: CamQuotesFacade,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.dataSource = new MatTableDataSource<Quote>([]);

    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3);

    this.filtersForm = this.fb.group({
      search: this.fb.control(''),
      customer: this.fb.control(undefined),
      requestor: this.fb.control(undefined),
      type: this.fb.control(undefined),
      fromDate: this.fb.control(fromDate),
      toDate: this.fb.control(new Date()),
      stateRequested: this.fb.control(true),
      stateReceived: this.fb.control(true),
      stateApproved: this.fb.control(true),
      stateRejected: this.fb.control(true),
      stateExpired: this.fb.control(true),
    });
  }

  ngOnInit(): void {
    this.quotesFacade.loadQuotes();
    this.quotesFacade.quotes$
      .pipe(
        tap(quotes => {
          this.getCustomersFromQuotes(quotes);
          this.getRequestorsFromQuotes(quotes);
        })
      )
      .subscribe(quotes => {
        this.allQuotes = quotes;
        this.filteredQuotes = this.filterQuotes(this.filtersForm.value, this.allQuotes);
        this.loadQuotesInTable(this.filteredQuotes);
      });

    this.activatedRoute.queryParams
      .pipe(
        map(value => value.filter || '{}'),
        take(1)
      )
      .subscribe(value => {
        const filters = JSON.parse(value);
        if (filters.fromDate && filters.fromDate.length > 0) {
          filters.fromDate = new Date(filters.fromDate);
        }
        if (filters.toDate && filters.toDate.length > 0) {
          filters.toDate = new Date(filters.toDate);
        }
        this.filtersForm.patchValue(filters);
      });

    this.quotesFacade.approvedQuotesSuccess$
      .pipe(
        filter(success => success),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.approveSelectedQuotesSuccess());

    this.quotesFacade.rejectedQuotesSuccess$
      .pipe(
        filter(success => success),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.rejectSelectedQuotesSuccess());

    this.filtersForm.valueChanges.subscribe((filters: QuotesFilters) => {
      this.filteredQuotes = this.filterQuotes(filters, this.allQuotes);
      this.loadQuotesInTable(this.filteredQuotes);

      this.filtersQueryParams = { filter: JSON.stringify(filters) };
      this.location.replaceState(
        location.pathname,
        new HttpParams({
          fromObject: this.filtersQueryParams,
        }).toString()
      );
    });

    this.onResize();
  }

  ngAfterViewInit() {
    if (this.matSort) {
      this.matSort.direction = 'desc';
      this.matSort.active = 'requestedDate';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private filterQuotes(filters: QuotesFilters, quotes: Quote[]): Quote[] {
    let filteredQuotes = [...quotes];
    if (filters.search.trim().length) {
      const searchText = filters.search.trim();
      filteredQuotes = filteredQuotes.filter(
        quote =>
          quote.customerNumber?.includes(searchText) ||
          quote.camfilQuoteNumber?.includes(searchText) ||
          quote.customerQuoteNumber?.includes(searchText)
      );
    }
    if (filters.customer) {
      filteredQuotes = filteredQuotes.filter(quote => quote.customerName === filters.customer);
    }
    if (filters.requestor && filters.requestor.length > 0) {
      filteredQuotes = filteredQuotes.filter(quote => filters.requestor.includes(quote.requestedBy));
    }
    if (filters.type === '2') {
      filteredQuotes = filteredQuotes.filter(quote => quote.quotationType === 'quotation');
    }
    if (filters.type === '3') {
      filteredQuotes = filteredQuotes.filter(quote => quote.quotationType === 'proposal');
    }
    if (filters.fromDate) {
      filteredQuotes = filteredQuotes.filter(quote => quote.requestedDate >= filters.fromDate);
    }
    if (filters.toDate) {
      filteredQuotes = filteredQuotes.filter(quote => quote.requestedDate <= filters.toDate);
    }
    filteredQuotes = filteredQuotes.filter(quote => {
      const capitalizedStatus = QuoteStatusEnum[quote.status];
      return filters[`state${capitalizedStatus}`];
    });
    debugger;
    return filteredQuotes;
  }

  private loadQuotesInTable(quotes: Quote[]) {
    if (quotes.length > this.previewNumRows && !this.showAll) {
      this.dataSource.data = quotes.slice(0, this.previewNumRows + 2);
    } else {
      this.dataSource.data = quotes;
    }
    this.dataSource.sort = this.matSort;
    this.cd.detectChanges();
  }

  private getCustomersFromQuotes(quotes: Quote[]): void {
    const customers = quotes
      .map(quote => quote.customerName)
      .filter((value, index, self) => self.indexOf(value) === index);
    this.customers = customers;
  }

  private getRequestorsFromQuotes(quotes: Quote[]): void {
    this.requestors = quotes
      .map(quote => quote.requestedBy)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  showedQuotesCount(): number {
    if (this.showAll || this.filteredQuotesCount() < this.previewNumRows + 2) {
      return this.filteredQuotesCount();
    } else {
      return this.previewNumRows;
    }
  }

  filteredQuotesCount(): number {
    return this.filteredQuotes?.length || 0;
  }

  showAllQuotes() {
    this.showAll = true;
    this.filteredQuotes = this.filterQuotes(this.filtersForm.value, this.allQuotes);
    this.loadQuotesInTable(this.filteredQuotes);
  }

  quoteIsSelectable(quote: Quote) {
    return quote.status === QuoteStatusEnum.Requested || quote.status === QuoteStatusEnum.Received;
  }

  setSelectedQuote(quoteId: string, selected: boolean) {
    this.selectedQuotesMap[quoteId] = selected;
    this.selectedQuotes = this.allQuotes.filter(q => !!this.selectedQuotesMap[q.id]);
  }

  clearSelection() {
    this.selectedQuotes = [];
    this.selectedQuotesMap = {};
  }

  approveSelectedQuotes() {
    this.quotesFacade.approveQuotes(
      this.selectedQuotes.map(q => ({
        id: q.id,
        number: q.camfilQuoteNumber,
      }))
    );
  }

  approveSelectedQuotesSuccess() {
    this.dialog.open(QuotesApproveDialogComponent);
    this.clearSelection();
  }

  onResize() {
    this.isMobileView = window.innerWidth <= 768;
  }

  rejectSelectedQuotes() {
    const dialog = this.dialog.open(QuotesRejectDialogComponent);
    dialog.componentInstance.reason = this.lastRejectReason;
    dialog.componentInstance.onChange.subscribe(({ reason }) => (this.lastRejectReason = reason));
    dialog.componentInstance.onConfirm.subscribe(result => {
      this.quotesFacade.rejectQuotes(
        this.selectedQuotes.map(q => ({
          id: q.id,
          number: q.camfilQuoteNumber,
        })),
        result.reason
      );
    });
  }

  rejectSelectedQuotesSuccess() {
    this.clearSelection();
  }
}

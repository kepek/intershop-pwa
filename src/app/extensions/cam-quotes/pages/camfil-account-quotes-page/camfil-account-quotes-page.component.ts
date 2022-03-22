import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { getUserPermissions, getUserRoles } from 'ish-core/store/customer/authorization';
import { QuotesApproveDialogComponent } from '../../components/quotes-approve-dialog/quotes-approve-dialog.component';
import { CamQuotesFacade } from '../../facades/cam-quotes.facade';
import { Quote, QuoteStatus as QuoteStatusEnum } from '../../models/quote/quote.model';

interface QuotesFilters {
  search: string;
  customer: string;
  requestor: string;
  type: string;
  fromDate: Date | null;
  toDate: Date | null;
  stateRequested: boolean;
  stateReceived: boolean;
  stateApproved: boolean;
  stateRejected: boolean;
  stateExpired: boolean;
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
export class CamfilAccountQuotesPageComponent implements OnInit {
  allQuotes: Quote[];
  filteredQuotes: Quote[];
  dataSource: MatTableDataSource<Quote>;
  @ViewChild(MatSort) matSort: MatSort;
  previewNumRows = 5;
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

  customers: string[];
  requestors: string[];

  selectedQuotes: Quote[] = [];
  selectedQuotesMap: {
    [key: string]: boolean;
  } = {};

  isMobileView = false;

  constructor(
    private cd: ChangeDetectorRef,
    private quotesFacade: CamQuotesFacade,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private store: Store
  ) {
    this.dataSource = new MatTableDataSource<Quote>([]);
    this.filtersForm = this.fb.group({
      search: this.fb.control(''),
      customer: this.fb.control(undefined),
      requestor: this.fb.control(undefined),
      type: this.fb.control(undefined),
      fromDate: this.fb.control(undefined),
      toDate: this.fb.control(undefined),
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

    this.filtersForm.valueChanges.subscribe((filters: QuotesFilters) => {
      this.filteredQuotes = this.filterQuotes(filters, this.allQuotes);
      this.loadQuotesInTable(this.filteredQuotes);
    });

    this.store.pipe(select(getUserRoles)).subscribe(roles => {
      console.log('roles', roles);
    });

    this.store.pipe(select(getUserPermissions)).subscribe(roles => {
      console.log('permissions', roles);
    });

    this.onResize();
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
    if (filters.requestor) {
      filteredQuotes = filteredQuotes.filter(quote => quote.requestedBy === filters.requestor);
    }
    if (filters.requestor) {
      filteredQuotes = filteredQuotes.filter(quote => quote.requestedBy === filters.requestor);
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
    return filteredQuotes;
  }

  private loadQuotesInTable(quotes: Quote[]) {
    if (quotes.length > this.previewNumRows && !this.showAll) {
      this.dataSource.data = quotes.slice(0, this.previewNumRows + 2);
    } else {
      this.showAll = true;
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
    const recuestors = quotes
      .map(quote => quote.requestedBy)
      .filter((value, index, self) => self.indexOf(value) === index);
    this.requestors = recuestors;
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
    this.dataSource.data = this.allQuotes;
  }

  setSelectedQuote(quoteId: string, selected: boolean) {
    this.selectedQuotesMap[quoteId] = selected;
    this.selectedQuotes = this.allQuotes.filter(q => !!this.selectedQuotesMap[q.id]);
    console.log(this.selectedQuotes);
  }

  approveSelectedQuotes() {
    this.dialog.open(QuotesApproveDialogComponent);
  }

  onResize() {
    this.isMobileView = window.innerWidth <= 768;
  }
}

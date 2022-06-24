import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';

import { QuotesRejectDialogComponent } from '../../components/quotes-reject-dialog/quotes-reject-dialog.component';
import { CamQuotesFacade } from '../../facades/cam-quotes.facade';
import { QuoteDetails, QuoteLineItem } from '../../models/quote-details/quote-details.model';

@Component({
  selector: 'camfil-camfil-account-quote-detail-page',
  templateUrl: './camfil-account-quote-detail-page.component.html',
  styleUrls: ['./camfil-account-quote-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountQuoteDetailPageComponent implements OnInit, OnDestroy {
  quoteDetails: QuoteDetails;
  loading$: Observable<boolean>;
  selectedItems: QuoteLineItem[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  isMobileView = false;

  lastRejectReason: string;

  @HostListener('window:resize') onWindowsResize() {
    this.onResize();
  }

  constructor(private quotesFacade: CamQuotesFacade, private actRoute: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.actRoute.params
      .pipe(pluck('id'), takeUntil(this.destroy$))
      .subscribe(id => this.quotesFacade.loadQuoteDetails(id));

    this.quotesFacade.quoteDetails$.pipe(takeUntil(this.destroy$)).subscribe(details => {
      this.quoteDetails = details;
    });

    this.loading$ = this.quotesFacade.quoteDetailsLoading$;

    this.onResize();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  onChangeItemSelection(item: QuoteLineItem, selected: boolean) {
    if (selected) {
      this.selectedItems.push(item);
    } else {
      const index = this.selectedItems.indexOf(item);
      if (index >= 0) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  reject() {
    const dialog = this.dialog.open(QuotesRejectDialogComponent);
    dialog.componentInstance.reason = this.lastRejectReason;
    dialog.componentInstance.isMultiple = false;
    dialog.componentInstance.onChange.subscribe(({ reason }) => (this.lastRejectReason = reason));
    dialog.componentInstance.onConfirm.subscribe(result => {
      // this.loading = true;
      // this.cd.markForCheck();
      this.quotesFacade.rejectQuote(
        {
          id: this.quoteDetails.id,
          number: this.quoteDetails.camfilQuoteNumber,
        },
        result.reason
      );
    });
  }

  approve() {
    // this.loading = true;
    this.quotesFacade.approveQuote({
      id: this.quoteDetails.id,
      number: this.quoteDetails.camfilQuoteNumber,
    });
  }

  onResize() {
    this.isMobileView = window.innerWidth <= 768;
  }
}

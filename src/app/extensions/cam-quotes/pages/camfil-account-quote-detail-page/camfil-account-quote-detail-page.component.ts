import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CamQuotesFacade } from '../../facades/cam-quotes.facade';
import { QuoteDetails, QuoteLineItem } from '../../models/quote-details/quote-details.model';

import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'camfil-camfil-account-quote-detail-page',
  templateUrl: './camfil-account-quote-detail-page.component.html',
  styleUrls: ['./camfil-account-quote-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountQuoteDetailPageComponent implements OnInit, OnDestroy {
  quoteDetails: QuoteDetails;
  // quoteItems$: Observable<QuoteItem[]>;
  loading: boolean;
  selectedItems: QuoteLineItem[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private quotesFacade: CamQuotesFacade,
    private actRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.actRoute.params
      .pipe(pluck('id'), takeUntil(this.destroy$))
      .subscribe(id => this.quotesFacade.loadQuoteDetails(id));

    this.quotesFacade.quoteDetails$.pipe(takeUntil(this.destroy$)).subscribe(details => {
      this.quoteDetails = details;
    });

    // this.quoteItems$ = this.quotesFacade.quoteItems$;

    this.quotesFacade.quoteDetailsLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
      this.cd.detectChanges();
    });
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

  showAddProductModal() {
    this.dialog
      .open(AddProductDialogComponent, { minWidth: '300px' })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.quotesFacade.createQuoteItem(this.quoteDetails.id, data);
        }
      });
  }

  deleteItem(item: QuoteLineItem) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: { title: 'camfil.quotes.quote_detail.confirm_delete_item' },
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.quotesFacade.deleteQuoteItem(this.quoteDetails.id, item.lineItemId);
        }
      });
  }
}

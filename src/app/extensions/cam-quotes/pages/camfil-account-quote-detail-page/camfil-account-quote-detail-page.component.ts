import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';

import { RoleToggleService } from 'ish-core/utils/role-toggle/role-toggle.service';

import { QuotesRejectDialogComponent } from '../../components/quotes-reject-dialog/quotes-reject-dialog.component';
import { CamQuotesFacade } from '../../facades/cam-quotes.facade';
import { QuoteDetails, QuoteLineItem } from '../../models/quote-details/quote-details.model';
import { QuoteStatus } from '../../models/quote/quote.model';

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

  canApprove$: Observable<boolean>;
  isAppoveEnabled: boolean;
  isProposal: boolean;

  @HostListener('window:resize') onWindowsResize() {
    this.onResize();
  }

  constructor(
    private quotesFacade: CamQuotesFacade,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog,
    private roleToggleService: RoleToggleService
  ) {}

  ngOnInit(): void {
    this.actRoute.params
      .pipe(pluck('id'), takeUntil(this.destroy$))
      .subscribe(id => this.quotesFacade.loadQuoteDetails(id));

    this.quotesFacade.quoteDetails$.pipe(takeUntil(this.destroy$)).subscribe(details => {
      this.quoteDetails = details;
      this.isAppoveEnabled =
        this.quoteDetails?.status === QuoteStatus.Received || this.quoteDetails?.status === QuoteStatus.Requested;
      this.isProposal = this.quoteDetails?.quotationType === 'proposal';
    });

    this.loading$ = this.quotesFacade.quoteDetailsLoading$;

    this.onResize();

    this.canApprove$ = this.roleToggleService.hasRole('APP_B2B_APPROVER');
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
    if (!this.isAppoveEnabled) {
      return;
    }

    const dialog = this.dialog.open(QuotesRejectDialogComponent);
    dialog.componentInstance.reason = this.lastRejectReason;
    dialog.componentInstance.isMultiple = false;
    dialog.componentInstance.onChange.subscribe(({ reason }) => (this.lastRejectReason = reason));
    dialog.componentInstance.onConfirm.subscribe(result => {
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
    if (!this.isAppoveEnabled) {
      return;
    }

    this.quotesFacade.approveQuote({
      id: this.quoteDetails.id,
      number: this.quoteDetails.camfilQuoteNumber,
    });
  }

  onResize() {
    this.isMobileView = window.innerWidth <= 768;
  }
}

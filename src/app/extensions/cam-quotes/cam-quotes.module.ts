import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { QuoteCreatedDialogComponent } from './components/quote-created-dialog/quote-created-dialog.component';
import { QuotesApproveDialogComponent } from './components/quotes-approve-dialog/quotes-approve-dialog.component';
import { QuotesRejectDialogComponent } from './components/quotes-reject-dialog/quotes-reject-dialog.component';
import { CamQuotesRoutingModule } from './pages/cam-quotes-routing.module';
import { CamQuotesStoreModule } from './store/cam-quotes-store.module';

@NgModule({
  imports: [CamQuotesRoutingModule, CamQuotesStoreModule, SharedModule],
  exports: [SharedModule],
  declarations: [
    ConfirmDialogComponent,
    QuoteCreatedDialogComponent,
    QuotesApproveDialogComponent,
    QuotesRejectDialogComponent,
  ],
})
export class CamQuotesModule {}

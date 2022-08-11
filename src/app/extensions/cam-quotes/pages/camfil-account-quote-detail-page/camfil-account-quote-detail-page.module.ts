import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountQuoteDetailPageComponent } from './camfil-account-quote-detail-page.component';
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { QuoteCostSummaryComponent } from './components/quote-cost-summary/quote-cost-summary.component';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';
import { QuoteLineItemTableComponent } from './components/quote-line-item-table/quote-line-item-table.component';
import { QuoteLineItemComponent } from './components/quote-line-item/quote-line-item.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CamfilAccountQuoteDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    AddProductDialogComponent,
    CamfilAccountQuoteDetailPageComponent,
    QuoteCostSummaryComponent,
    QuoteDetailsComponent,
    QuoteLineItemComponent,
    QuoteLineItemTableComponent,
  ],
})
export class CamfilAccountQuoteDetailPageModule {}

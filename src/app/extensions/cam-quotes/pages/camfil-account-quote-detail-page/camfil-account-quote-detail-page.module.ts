import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamfilAccountQuoteDetailPageComponent } from './camfil-account-quote-detail-page.component';
import { SharedModule } from 'ish-shared/shared.module';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';
import { QuoteLineItemComponent } from './components/quote-line-item/quote-line-item.component';
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { QuoteCostSummaryComponent } from './components/quote-cost-summary/quote-cost-summary.component';

const routes: Routes = [
  {
    path: '',
    component: CamfilAccountQuoteDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    AddProductDialogComponent,
    CamfilAccountQuoteDetailPageComponent,
    QuoteDetailsComponent,
    QuoteLineItemComponent,
    QuoteCostSummaryComponent
  ],
})
export class CamfilAccountQuoteDetailPageModule { }

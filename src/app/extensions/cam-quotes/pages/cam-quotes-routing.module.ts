import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';

import { QuotesGuard } from '../guards/quotes.guard';

import { CamfilAccountQuoteDetailPageComponent } from './camfil-account-quote-detail-page/camfil-account-quote-detail-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./camfil-account-quotes-page/camfil-account-quotes-page.module').then(
        m => m.CamfilAccountQuotesPageModule
      ),
    canActivate: [AuthGuard, QuotesGuard],
    data: {
      breadcrumbData: [{ key: 'account.quotes.link' }],
    },
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./camfil-account-quote-detail-page/camfil-account-quote-detail-page.module').then(
        m => m.CamfilAccountQuoteDetailPageModule
      ),
    canActivate: [AuthGuard, QuotesGuard],
    data: {
      breadcrumbData: [{ key: 'account.quotes.link' }],
    },
    component: CamfilAccountQuoteDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamQuotesRoutingModule {}

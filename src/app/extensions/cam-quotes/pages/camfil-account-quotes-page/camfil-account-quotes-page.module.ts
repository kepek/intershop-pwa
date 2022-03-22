import { RouterModule, Routes } from '@angular/router';
import { CamfilAccountQuotesPageComponent } from './camfil-account-quotes-page.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'ish-shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CamfilAccountQuotesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CamfilAccountQuotesPageComponent],
})
export class CamfilAccountQuotesPageModule {}

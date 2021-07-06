import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CamfilCookiesModalComponent } from './camfil-cookies-modal/camfil-cookies-modal.component';
import { CookiesPageGuard } from './cookies-page.guard';
import { CookiesModalComponent } from './cookies-modal/cookies-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'ish-shared/shared.module';

const cookiesPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [CookiesPageGuard],
    data: {
      meta: {
        title: 'cookie.preferences.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [SharedModule, CommonModule, RouterModule.forChild(cookiesPageRoutes), TranslateModule, MatButtonModule],
  providers: [CookiesPageGuard],
  declarations: [CamfilCookiesModalComponent, CookiesModalComponent],
})
export class CookiesPageModule {}

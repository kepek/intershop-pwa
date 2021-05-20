import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';
import { CamAhuAbstractComponent } from '../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-page-detail',
  styleUrls: ['./camfil-ahu-page-detail.component.scss'],
  templateUrl: './camfil-ahu-page-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageDetailComponent extends CamAhuAbstractComponent implements OnInit {
  constructor(
    protected router: Router,
    protected ahuFacade: CamAhuFacade,
    protected fb: FormBuilder,
    private shoppingFacade: ShoppingFacade
  ) {
    super(router, fb, ahuFacade);
  }
  product$: Observable<ProductView>;

  isMoreDetailsOpen = false;

  ngOnInit() {
    super.init();
    // We do NOT know what's the selected AHU Unit Product is...
    this.product$ = this.shoppingFacade.product$('1004670', ProductCompletenessLevel.Detail);
  }

  toggleDetails() {
    this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
  }
}

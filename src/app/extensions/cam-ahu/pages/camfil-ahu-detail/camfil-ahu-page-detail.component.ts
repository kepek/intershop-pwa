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
// tslint:disable-next-line:component-creation-test
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
    // TODO (extMlk): We do NOT know what's the selected AHU Unit Product is... Need to be clarified;
    this.product$ = this.shoppingFacade.product$('610959', ProductCompletenessLevel.Detail);
  }

  toggleDetails() {
    this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
  }
}

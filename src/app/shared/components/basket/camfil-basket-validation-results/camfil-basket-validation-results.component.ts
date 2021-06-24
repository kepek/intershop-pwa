import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';

@Component({
  selector: 'camfil-basket-validation-results',
  templateUrl: './camfil-basket-validation-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBasketValidationResultsComponent extends BasketValidationResultsComponent {}

import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';

@Injectable({ providedIn: 'root' })
export class ProductSkuExistValidator implements AsyncValidator {
  constructor(private shoppingFacade: ShoppingFacade) {}

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return timer(500).pipe(
      switchMap(() => this.shoppingFacade.product$(control.value, ProductCompletenessLevel.List)),
      first(),
      map(result => {
        let error;
        if (result.failed) {
          error = { skuNotExist: true };
        }
        return error;
      }),
      catchError(() => of({ skuNotExist: true }))
    );
  }
}

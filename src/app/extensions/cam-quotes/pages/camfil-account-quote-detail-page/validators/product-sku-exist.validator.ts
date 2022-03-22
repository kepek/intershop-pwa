import { Injectable } from '@angular/core';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import { catchError, first, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductSkuExistValidator implements AsyncValidator {

  constructor(private shoppingFacade: ShoppingFacade) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return timer(500).pipe(
      switchMap(() => this.shoppingFacade.product$(control.value, ProductCompletenessLevel.List)),
      first(),
      map(result => {
        let error = undefined;
        if (result.failed) {
          error = { skuNotExist: true };
        }
        return error;
      }),
      catchError(() => of({ skuNotExist: true }))
    );
  }
}

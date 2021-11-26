import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { uniq } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketFeedback, BasketFeedbackView } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { interpolateParams } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';

@Component({
  selector: 'camfil-basket-validation-results',
  templateUrl: './camfil-basket-validation-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBasketValidationResultsComponent extends BasketValidationResultsComponent {
  deliveryDateErrorMessages$: Observable<string[]>;

  constructor(protected checkoutFacade: CheckoutFacade, private translateService: TranslateService) {
    super(checkoutFacade);
  }

  init() {
    super.init();

    this.deliveryDateErrorMessages$ = combineLatest([
      this.validationResults$.pipe(map(results => uniq<BasketFeedbackView>(results?.errors))),
      this.checkoutFacade.buckets$.pipe(
        whenTruthy(),
        map(buckets => buckets.map(bucket => bucket.deliveryAddressId))
      ),
    ]).pipe(
      map(([errors, bucketDeliveryAddressIds]) =>
        errors.filter(error => this.isDeliveryDateMessage(error, bucketDeliveryAddressIds))
      ),
      map(errors =>
        errors.map(error =>
          this.translateService.instant('camfil.checkout.validation.for_order', {
            0: error?.code,
            1: error?.parameters?.addressId,
          })
        )
      )
    );

    this.infoMessages$ = this.validationResults$.pipe(
      map(results =>
        uniq(
          results &&
            results.infos &&
            results.infos.map(info => {
              // tslint:disable-next-line:no-unused
              const { scopes, ...params } = info.parameters;
              return interpolateParams(info.message, { ...params });
            })
        ).filter(message => !!message)
      )
    );
  }

  isDeliveryDateMessage(error: BasketFeedback, bucketDeliveryAddressIds: string[]): boolean {
    const { addressId } = error?.parameters;
    const { code } = error;

    if (!addressId || !code || bucketDeliveryAddressIds?.length === 0) {
      return false;
    }

    return bucketDeliveryAddressIds.indexOf(addressId) !== -1;
  }
}

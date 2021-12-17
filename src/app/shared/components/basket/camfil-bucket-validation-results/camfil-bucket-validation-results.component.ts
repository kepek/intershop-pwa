import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { BasketFeedbackView } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { interpolateParams } from 'ish-core/utils/functions';
import { mapToProperty } from 'ish-core/utils/operators';
import { CamfilBasketValidationResultsComponent } from 'ish-shared/components/basket/camfil-basket-validation-results/camfil-basket-validation-results.component';

@Component({
  selector: 'camfil-bucket-validation-results',
  templateUrl: './camfil-bucket-validation-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBucketValidationResultsComponent
  extends CamfilBasketValidationResultsComponent
  implements OnChanges {
  bucket$ = new ReplaySubject<Bucket>(3);

  @Input() bucket: Bucket;

  private static feedbackPredicate(feedback: BasketFeedbackView, bucket: Bucket) {
    return feedback?.parameters?.shipToAddress === bucket?.shipToAddress;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bucket) {
      this.bucket$.next(this.bucket);
    }
  }

  init() {
    super.init();

    this.validationResults$ = this.checkoutFacade.basketValidationResults$.pipe(
      withLatestFrom(this.bucket$),
      map(([results, bucket]) => {
        let { errors, infos } = results;

        errors = errors?.filter(feedback => CamfilBucketValidationResultsComponent.feedbackPredicate(feedback, bucket));
        infos = infos?.filter(feedback => CamfilBucketValidationResultsComponent.feedbackPredicate(feedback, bucket));

        return { ...results, errors, infos };
      })
    );

    this.errorMessages$ = this.validationResults$.pipe(
      mapToProperty('errors'),
      map(errors =>
        errors
          .filter(
            error =>
              !this.isLineItemMessage(error) &&
              ![
                'basket.validation.line_item_shipping_restrictions.error',
                'basket.validation.basket_not_covered.error',
              ].includes(error.code)
          )
          .map(error =>
            error.parameters && error.parameters.shippingRestriction
              ? error.parameters.shippingRestriction
              : error.message
          )
          .filter(message => !!message)
      )
    );

    this.infoMessages$ = this.validationResults$.pipe(
      mapToProperty('infos'),
      map(infos => infos.filter(i => !!i?.message)),
      map(infos =>
        infos
          .map(info => {
            // tslint:disable-next-line:no-unused
            const { scopes, ...params } = info.parameters;
            return interpolateParams(info.message, { ...params });
          })
          .filter(message => !!message)
      )
    );
  }
}

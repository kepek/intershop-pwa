import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CamfilErrorValidator } from 'camfil-pwa/models/camfil-error-valdiator/camfil-error-valdiator.model';

@Component({
  selector: 'camfil-error',
  templateUrl: './camfil-error.component.html',
  styleUrls: ['./camfil-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilErrorComponent implements OnChanges {
  @Input() errorValidators: CamfilErrorValidator[];
  @Input() touched: boolean;
  @Input() errors: {};

  processedErrorValidators: CamfilErrorValidator[];

  getMessageVariables(validator: CamfilErrorValidator) {
    return validator.messageVariables?.reduce((acc, item, index) => ({ ...acc, [index]: item }), {}) || {};
  }

  ngOnChanges(c: SimpleChanges) {
    const currentValue = c.errors?.currentValue;
    if (currentValue && Object.keys(currentValue).length > 1 && 'required' in currentValue) {
      this.processedErrorValidators = this.errorValidators.filter(err => err.error !== 'required');
    }
  }
}

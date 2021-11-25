import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

interface ErrorValidator {
  error: string;
  message: string;
  ifNot?: string;
  messageVariables?: string[];
}

@Component({
  selector: 'camfil-error',
  templateUrl: './camfil-error.component.html',
  styleUrls: ['./camfil-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilErrorComponent implements OnChanges {
  @Input() errorValidators: ErrorValidator[];
  @Input() touched: boolean;
  @Input() errors: {};

  processedErrorValidators: ErrorValidator[];

  getMessageVariables(validator: ErrorValidator) {
    return validator.messageVariables?.reduce((acc, item, index) => ({ ...acc, [index]: item }), {}) || {};
  }

  ngOnChanges(c: SimpleChanges) {
    const currentValue = c.errors?.currentValue;
    if (currentValue && Object.keys(currentValue).length > 1 && 'required' in currentValue) {
      this.processedErrorValidators = this.errorValidators.filter(err => err.error !== 'required');
    }
  }
}

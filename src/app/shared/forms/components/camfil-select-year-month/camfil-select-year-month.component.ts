import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FloatLabelType } from '@angular/material/form-field';

import { SelectYearMonthComponent } from 'ish-shared/forms/components/select-year-month/select-year-month.component';

/**
 * The Select Year Month Component allows the user to select a month/year. The appropriate form with a month and a year control has to be provided by the parent.
 * After user selection the form fields contain a 2 digit month and a 2 digit year string.
 * The component is intended to select an expiration date for credit cards but can be extended for other purposes in future.
 *
 * @example
 * <camfil-select-year-month
 [form]="parameterForm"
 label="checkout.credit_card.expiration_date.label"
 [controlName]="['expirationMonth', expirationYear]"
 inputClass="col-sm-6"
 ></camfil-select-year-month>
 */
@Component({
  selector: 'camfil-select-year-month',
  templateUrl: './camfil-select-year-month.component.html',
  styleUrls: ['./camfil-select-year-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilSelectYearMonthComponent extends SelectYearMonthComponent {
  @Input() floatLabel: FloatLabelType = 'auto';

  /**
   *  additional css class for the component
   */
  @Input() cssClass = 'mat-form-field__wrapper';

  /**
   css-class for the label (default: 'col-md-4')
   */
  @Input() labelClass = '';
  /**
   css-class for the input/select field (default: 'col-md-8')
   */
  @Input() inputClass = '';
}

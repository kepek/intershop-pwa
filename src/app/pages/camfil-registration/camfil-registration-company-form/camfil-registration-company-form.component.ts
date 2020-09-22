import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'camfil-registration-company-form',
  templateUrl: './camfil-registration-company-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRegistrationCompanyFormComponent {
  @Input()
  customerForm: FormGroup;
}

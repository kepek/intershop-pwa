import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'camfil-registration-credentials-form',
  templateUrl: './camfil-registration-credentials-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilRegistrationCredentialsFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() controlName = 'credentials';

  ngOnInit() {
    if (!this.parentForm) {
      throw new Error('required input parameter <parentForm> is missing for CredentialsFormComponent');
    }
  }

  get credentialsForm(): FormGroup {
    return this.parentForm.get(this.controlName) as FormGroup;
  }
}

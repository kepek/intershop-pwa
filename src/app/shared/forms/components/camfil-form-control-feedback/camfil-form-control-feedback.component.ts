import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';

@Component({
  selector: 'camfil-form-control-feedback',
  templateUrl: './camfil-form-control-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilFormControlFeedbackComponent extends FormControlFeedbackComponent {}

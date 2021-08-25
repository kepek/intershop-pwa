import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

@Component({
  selector: 'camfil-error-message',
  templateUrl: './camfil-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilErrorMessageComponent extends ErrorMessageComponent implements OnChanges {
  @Input() messageDuration = 5000;
  @Input() error: HttpError;
  @Input() toast = true;

  ngOnChanges() {
    if (this.toast) {
      this.displayCamfilToast();
    }
  }

  private displayCamfilToast() {
    if (this.error) {
      this.messagesFacade.error({
        message: this.error.message || this.error.code,
        duration: this.messageDuration,
      });
    }
  }
}

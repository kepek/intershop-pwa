import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CaptchaFacade, CaptchaTopic } from '../../captcha/facades/captcha.facade';

export type CamCaptchaTopic = CaptchaTopic & ('applyForAnAccount' | 'forgotUsername');

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamCaptchaFacade extends CaptchaFacade {
  captchaActive$(key: CamCaptchaTopic): Observable<boolean> {
    return super.captchaActive$(key);
  }
}

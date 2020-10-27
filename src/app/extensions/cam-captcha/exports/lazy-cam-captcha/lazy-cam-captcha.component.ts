import { ChangeDetectionStrategy, Compiler, Component, Injector, Input } from '@angular/core';

import { LazyCaptchaComponent } from '../../../captcha/exports/lazy-captcha/lazy-captcha.component';
import { CamCaptchaFacade, CamCaptchaTopic } from '../../facades/cam-captcha.facade';

/**
 * The Captcha Component
 *
 * Displays a captcha form control (V2) or widget (V3) if the captchaV2 or the captchaV3 feature is enabled.
 * It expects the given form to have the form controls for the captcha (controlName) and the captcha action (actionControlName).
 * If the captcha is confirmed the captcha form control contains the captcha response token provided by the captcha service.
 *
 * The parent form supplied must have controls for 'captcha' and 'captchaAction'
 *
 * @example
 * <camfil-lazy-captcha [form]="form" cssClass="offset-md-2 col-md-8" topic="contactUs"></camfil-lazy-captcha>
 */
@Component({
  selector: 'camfil-lazy-captcha',
  templateUrl: '../../../captcha/exports/lazy-captcha/lazy-captcha.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable:component-creation-test
// tslint:disable:force-jsdoc-comments
// @ts-ignore
export class LazyCamCaptchaComponent extends LazyCaptchaComponent {
  @Input() topic: CamCaptchaTopic;

  // @ts-ignore
  constructor(private captchaFacade: CamCaptchaFacade, private compiler: Compiler, private injector: Injector) {
    super(captchaFacade, compiler, injector);
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CaptchaExportsModule } from '../../captcha/exports/captcha-exports.module';
import { SitekeyProviderService } from '../../captcha/services/sitekey-provider/sitekey-provider.service';

import { LazyCamCaptchaComponent } from './lazy-cam-captcha/lazy-cam-captcha.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyCamCaptchaComponent],
  exports: [LazyCamCaptchaComponent],
  providers: [SitekeyProviderService],
})
export class CamCaptchaExportsModule extends CaptchaExportsModule {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'camfil-login-info-section',
  templateUrl: './login-info-section.component.html',
  styleUrls: ['./login-info-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginInfoSectionComponent {
  bullets: string[] = [
    this.translateService.instant('camfil.register.whycamfil.personal_assortment'),
    this.translateService.instant('camfil.register.whycamfil.products'),
    this.translateService.instant('camfil.register.whycamfil.rwd'),
  ];

  constructor(private translateService: TranslateService) {}
}

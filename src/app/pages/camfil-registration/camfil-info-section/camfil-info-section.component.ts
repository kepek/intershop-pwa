import { ChangeDetectionStrategy, Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'camfil-info-section',
  templateUrl: './camfil-info-section.component.html',
  styleUrls: ['./camfil-info-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilInfoSectionComponent {
  bullets: String[] = [
    this.translateService.instant('camfil.register.whycamfil.personal_assortment'),
    this.translateService.instant('camfil.register.whycamfil.products'),
    this.translateService.instant('camfil.register.whycamfil.rwd'),
  ];

  constructor(private translateService: TranslateService) {}
}

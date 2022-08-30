import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable } from 'rxjs';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-cam-card-last-delivery-date',
  templateUrl: './cam-card-last-delivery-date.component.html',
  styleUrls: ['./cam-card-last-delivery-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class CamCardLastDeliveryDateComponent implements OnInit {
  @Input() lastDeliveryDateType = 'subCamCard';
  @Input() camCard: CamCard;
  @Input() camCardItem: CamCardItem;
  @Input() mainCCLastDeliveryDate?: string;
  lastDeliveryDate: string;
  isLastDeliveryDateVisible$: Observable<boolean>;
  constructor(private camfilConfigurationFacade: CamfilConfigurationFacade) {}

  get lastDeliveryDateValue() {
    let lastDeliveryDate = '';

    if (this.lastDeliveryDateType === 'subCamCard') {
      lastDeliveryDate = this.camCard.lastDeliveryDate
        ? this.camCard.lastDeliveryDate
        : this.mainCCLastDeliveryDate
        ? this.mainCCLastDeliveryDate
        : '';
    } else {
      lastDeliveryDate = this.camCardItem.lastDeliveryDate
        ? this.camCardItem.lastDeliveryDate
        : this.camCard.lastDeliveryDate
        ? this.camCard.lastDeliveryDate
        : '';
    }

    return lastDeliveryDate;
  }

  ngOnInit(): void {
    this.isLastDeliveryDateVisible$ = this.camfilConfigurationFacade?.isEnabled$('showDeliveryIntervalOnCCDetailPage');
  }
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable } from 'rxjs';

import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-cam-card-last-delivery-date',
  templateUrl: './cam-card-last-delivery-date.component.html',
  styleUrls: ['./cam-card-last-delivery-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardLastDeliveryDateComponent implements OnInit {
  @Input() lastDeliveryDateType = 'subCamCard';
  @Input() camCard: CamCard;
  @Input() camCardItemData: CamCardItem;
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
      lastDeliveryDate = this.camCardItemData.lastDeliveryDate
        ? this.camCardItemData.lastDeliveryDate
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

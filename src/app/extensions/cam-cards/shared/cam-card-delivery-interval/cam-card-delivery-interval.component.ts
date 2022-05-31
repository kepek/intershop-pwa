import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-cam-card-delivery-interval',
  templateUrl: './cam-card-delivery-interval.component.html',
  styleUrls: ['./cam-card-delivery-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardDeliveryIntervalComponent implements OnInit {
  private static deliveryIntervalOptions = 100;

  @Input() intervaltype = 'subCamCard';
  @Input() camCard: CamCard;
  @Input() mainDeliveryInterval?: number;
  @Input() camCardItemData?: CamCardItem;
  deliveryIntervalFilteredOptions$: Observable<string[]>;
  deliveryIntervalForm: FormGroup;
  deliveryIntervalOptions: string[] = [
    ...Array(CamCardDeliveryIntervalComponent.deliveryIntervalOptions).keys(),
  ].map(i => (i === 0 ? '--' : i.toString()));
  isVisible$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  ngOnInit(): void {
    this.initDeliveryIntervalForm();
    this.deliveryIntervalFilteredOptions$ = this.deliveryIntervalForm.get('deliveryInterval').valueChanges.pipe(
      startWith(''),
      map(value => this._deliveryIntervalFilter(value))
    );

    this.isVisible$ = this.camfilConfigurationFacade?.isEnabled$('showDeliveryIntervalOnCCDetailPage');
  }

  initDeliveryIntervalForm() {
    this.deliveryIntervalForm = this.fb.group({
      lastDelivery: [''],
      deliveryInterval: [''],
      nextDelivery: [{ value: '', disabled: true }],
    });
    this.patchDeliveryIntervalForm();
  }

  patchDeliveryIntervalForm() {
    if (this.intervaltype === 'subCamCard') {
      const { lastDeliveryDate, deliveryInterval, nextDeliveryDate } = this.camCard;

      const interalValue = deliveryInterval
        ? deliveryInterval
        : this.mainDeliveryInterval
        ? this.mainDeliveryInterval
        : '';

      this.deliveryIntervalForm.patchValue({
        lastDelivery: lastDeliveryDate ? new Date(lastDeliveryDate) : '',
        deliveryInterval: interalValue,
        nextDelivery: nextDeliveryDate ? new Date(nextDeliveryDate) : '',
      });
    } else {
      const { lastDeliveryDate, deliveryInterval } = this.camCardItemData;

      const interalValue = deliveryInterval
        ? deliveryInterval
        : this.mainDeliveryInterval
        ? this.mainDeliveryInterval
        : '';
      this.deliveryIntervalForm.patchValue({
        lastDelivery: lastDeliveryDate ? new Date(lastDeliveryDate) : '',
        deliveryInterval: interalValue,
      });
    }
  }

  applyDeliveryInterval() {
    if (this.deliveryIntervalForm.get('deliveryInterval').value === '--') {
      this.deliveryIntervalForm.get('deliveryInterval').setValue(undefined);
    }
    this.pickInterval();
    this.onBlurSubmit();
  }

  pickInterval() {
    const date = new Date(this.deliveryIntervalForm.get('lastDelivery').value);
    date.setMonth(
      date.getMonth() +
        (isNaN(this.deliveryIntervalForm.get('deliveryInterval').value)
          ? 0
          : +this.deliveryIntervalForm.get('deliveryInterval').value)
    );
    this.deliveryIntervalForm.patchValue({
      nextDelivery: date,
    });
  }

  validateDeliveryInterval() {
    const maxDeliveryInterval = CamCardDeliveryIntervalComponent.deliveryIntervalOptions - 1;
    if (this.deliveryIntervalForm.get('deliveryInterval').value === '--') {
      this.deliveryIntervalForm.get('deliveryInterval').setValue(undefined);
      return;
    }
    if (this.deliveryIntervalForm.get('deliveryInterval').value > maxDeliveryInterval) {
      this.deliveryIntervalForm.get('deliveryInterval').setValue(`${maxDeliveryInterval}`);
      return;
    }
    if (this.deliveryIntervalForm.get('deliveryInterval').value <= 0) {
      this.deliveryIntervalForm.get('deliveryInterval').setValue(undefined);
      return;
    }
  }

  private _deliveryIntervalFilter(value: string): string[] {
    if (!value) {
      return this.deliveryIntervalOptions;
    }
    return this.deliveryIntervalOptions.filter(option => option.toLowerCase().startsWith(value.toString()));
  }

  onBlurSubmit() {
    if (this.intervaltype === 'subCamCard') {
      this.camCardsFacade.updateSubCamCard({
        ...this.camCard,
        deliveryInterval: isNaN(this.deliveryIntervalForm.get('deliveryInterval').value)
          ? undefined
          : this.deliveryIntervalForm.get('deliveryInterval').value,
      });
    } else {
      const newItem = {
        ...this.camCardItemData,
        deliveryInterval: isNaN(this.deliveryIntervalForm.get('deliveryInterval').value)
          ? undefined
          : this.deliveryIntervalForm.get('deliveryInterval').value,
      };
      this.camCardsFacade.updateCamCardProduct(this.camCard.rootCamCard, this.camCard.id, newItem);
    }
  }
}

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-image-text-buttons',
  templateUrl: './tacton-image-text-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonImageTextButtonsComponent implements OnInit, OnDestroy {
  @Input() parameter: TactonProductConfigurationParameter;

  apiKey: string;
  endPoint: string;

  private destroy$ = new Subject();

  constructor(private facade: TactonFacade) {}

  ngOnInit() {
    this.facade.selfServiceApiConfiguration$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(config => {
      this.apiKey = config.apiKey;
      this.endPoint = config.endPoint;
    });
  }

  change(value) {
    this.facade.commitValue(this.parameter, value);
  }

  getImageUrl(picture: string) {
    return `${this.endPoint.replace('/self-service-api', '')}${picture}?_key=${this.apiKey}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

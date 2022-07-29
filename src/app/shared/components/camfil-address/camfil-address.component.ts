import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';

/**
 * The Address Component displays an address. The readout is country-dependent.
 *
 * @example
 * <camfil-address
 *   [address]="order.invoiceToAddress"
 * ></camfil-address>
 */
@Component({
  selector: 'camfil-address',
  templateUrl: './camfil-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAddressComponent implements OnInit, OnDestroy {
  /**
   * The Address to be displayed.
   *
   */
  @Input() address: Address;

  /**
   * If set to true, the email is displayed as part of the address.
   *
   */
  @Input() displayEmail = false;

  private destroy$ = new Subject();
  channelCode: string;

  constructor(private camfilConfigurationFacade: CamfilConfigurationFacade) {}

  ngOnInit(): void {
    this.camfilConfigurationFacade.channelCode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(channelCode => (this.channelCode = channelCode));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

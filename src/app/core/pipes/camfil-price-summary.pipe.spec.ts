import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Price } from 'ish-core/models/price/price.model';

import { CamfilPriceSummaryPipe } from './camfil-price-summary.pipe';

describe('Camfil Price Summary Pipe', () => {
  let camfilPriceSummaryPipe: CamfilPriceSummaryPipe;
  let accountFacade: AccountFacade;

  const price = {
    currency: 'USD',
    value: 500,
  } as Price;

  beforeEach(() => {
    accountFacade = mock(AccountFacade);

    TestBed.configureTestingModule({
      providers: [CamfilPriceSummaryPipe, { provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    });

    camfilPriceSummaryPipe = TestBed.inject(CamfilPriceSummaryPipe);
  });

  it('should be created', () => {
    expect(camfilPriceSummaryPipe).toBeTruthy();
  });

  it('should summarize to the total price', () => {
    expect(camfilPriceSummaryPipe.transform(price, 3)).toEqual({ ...price, value: 1500 });
  });

  it('should return 0 when price is undefined', () => {
    expect(camfilPriceSummaryPipe.transform(undefined)).toBeUndefined();
  });
});

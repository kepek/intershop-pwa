import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { AddressSortPipe } from './camfil-address-sort.pipe';

describe('Camfil Address Sort Pipe', () => {
  let addressSortPipe: AddressSortPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting()],
      providers: [AddressSortPipe],
    });
    addressSortPipe = TestBed.inject(AddressSortPipe);
  });

  it('should be created', () => {
    expect(addressSortPipe).toBeTruthy();
  });
});

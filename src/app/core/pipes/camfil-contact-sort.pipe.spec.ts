import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { CamfilContactSortPipe } from './camfil-contact-sort.pipe';

describe('Camfil Contact Sort Pipe', () => {
  let camfilContactSortPipe: CamfilContactSortPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting()],
      providers: [CamfilContactSortPipe],
    });
    camfilContactSortPipe = TestBed.inject(CamfilContactSortPipe);
  });

  it('should be created', () => {
    expect(camfilContactSortPipe).toBeTruthy();
  });
});

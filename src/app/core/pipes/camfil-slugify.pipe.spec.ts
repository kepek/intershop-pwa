import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { CamfilSlugifyPipe } from './camfil-slugify.pipe';

describe('Camfil Slugify Pipe', () => {
  let camfilSlugifyPipe: CamfilSlugifyPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), RouterTestingModule],
      providers: [CamfilSlugifyPipe],
    });
    camfilSlugifyPipe = TestBed.inject(CamfilSlugifyPipe);
  });

  it('should be created', () => {
    expect(camfilSlugifyPipe).toBeTruthy();
  });
});

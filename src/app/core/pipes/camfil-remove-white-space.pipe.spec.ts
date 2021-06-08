import { TestBed } from '@angular/core/testing';

import { CamfilRemoveWhiteSpacesPipe } from './camfil-remove-white-space.pipe';

describe('Camfil Remove White Space Pipe', () => {
  let camfilRemoveWhiteSpacesPipe: CamfilRemoveWhiteSpacesPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamfilRemoveWhiteSpacesPipe],
    });
    camfilRemoveWhiteSpacesPipe = TestBed.inject(CamfilRemoveWhiteSpacesPipe);
  });

  it('should be created', () => {
    expect(camfilRemoveWhiteSpacesPipe).toBeTruthy();
  });
});

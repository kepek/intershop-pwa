import { TestBed } from '@angular/core/testing';

import { CamPdfService } from './cam-pdf.service';

describe('CamPdf Service', () => {
  let camPdfService: CamPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    camPdfService = TestBed.inject(CamPdfService);
  });

  it('should be created', () => {
    expect(camPdfService).toBeTruthy();
  });
});

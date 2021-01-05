import { TestBed } from '@angular/core/testing';

import { CamPdfService } from './cam-pdf.service';

describe('Cam Pdf Service', () => {
  let camPdfService: CamPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamPdfService],
    });
    camPdfService = TestBed.inject(CamPdfService);
  });

  it('should be created', () => {
    expect(camPdfService).toBeTruthy();
  });
});

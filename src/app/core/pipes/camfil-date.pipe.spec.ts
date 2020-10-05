import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CamfilDatePipe } from './camfil-date.pipe';

describe('Camfil Date Pipe', () => {
  let camfilDatePipe: CamfilDatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [CamfilDatePipe],
    });
    camfilDatePipe = TestBed.inject(CamfilDatePipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
  });

  it('should be created', () => {
    expect(camfilDatePipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(camfilDatePipe.transform(new Date())).toEqual('10/5/2020"');
  });
});

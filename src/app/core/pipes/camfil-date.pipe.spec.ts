import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { CamfilDatePipe } from './camfil-date.pipe';

describe('Camfil Date Pipe', () => {
  let camfilDatePipe: CamfilDatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), RouterTestingModule, TranslateModule.forRoot()],
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

  it('should transform 32452435234 to 1/11/1971', () => {
    expect(camfilDatePipe.transform(new Date(32452435234))).toEqual('1/11/1971');
  });
});

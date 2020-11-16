import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { UnitAhuLongDescription } from '../models/unit/unit.model';

import { UnitAhuLongDescriptionPipe } from './unit-ahu-long-description.pipe';

describe('Unit Ahu Long Description Pipe', () => {
  let unitAhuLongDescriptionPipe: UnitAhuLongDescriptionPipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [UnitAhuLongDescriptionPipe],
    });
    unitAhuLongDescriptionPipe = TestBed.inject(UnitAhuLongDescriptionPipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
  });

  it('should be created', () => {
    expect(unitAhuLongDescriptionPipe).toBeTruthy();
  });

  it('should transform UnitAhuLongDescription to English', () => {
    const value: UnitAhuLongDescription[] = [
      {
        lang: 'EN-US',
        text: 'eQ MASTER® 2000 X English',
      },
      {
        lang: 'SV-SE',
        text: 'eQ MASTER® 2000 X Swedish',
      },
    ];
    expect(unitAhuLongDescriptionPipe.transform(value)).toEqual('eQ MASTER® 2000 X English');
  });
});

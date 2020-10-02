import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';

import { CamfilDimensionPipe } from './camfil-dimension.pipe';

describe('Camfil Dimension Pipe', () => {
  let camfilDimensionPipe: CamfilDimensionPipe;
  let attributePipe: AttributeToStringPipe;
  let translateService: TranslateService;
  const attributes: Attribute<string>[] = [
    {
      name: 'Test',
      type: 'String',
      value: 'Hello',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [CamfilDimensionPipe, AttributeToStringPipe],
    });
    camfilDimensionPipe = TestBed.inject(CamfilDimensionPipe);
    attributePipe = TestBed.inject(AttributeToStringPipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
  });

  it('should be created', () => {
    expect(camfilDimensionPipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(camfilDimensionPipe.transform(attributes)).toEqual('xxx-xxx-xxx');
  });
});

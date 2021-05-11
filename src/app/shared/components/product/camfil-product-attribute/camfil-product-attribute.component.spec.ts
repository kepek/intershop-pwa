import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';

import { CamfilProductAttributeComponent } from './camfil-product-attribute.component';

describe('Camfil Product Attribute Component', () => {
  let component: CamfilProductAttributeComponent;
  let fixture: ComponentFixture<CamfilProductAttributeComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductAttributeComponent, MockPipe(AttributeToStringPipe)],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAttributeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.identifier = 'dimensions';
    component.name = 'dimensions';
    component.hideAttributeName = true;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

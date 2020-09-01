import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

import { CamfilProductAttributesPreviewComponent } from './camfil-product-attributes-preview.component';

describe('Camfil Product Attributes Preview Component', () => {
  let component: CamfilProductAttributesPreviewComponent;
  let fixture: ComponentFixture<CamfilProductAttributesPreviewComponent>;
  let element: HTMLElement;
  let product: Product;
  beforeEach(async(() => {
    product = { sku: 'sku' } as Product;
    product.attributes = [
      { name: 'A', type: 'String', value: 'A' },
      { name: 'B', type: 'String', value: 'B' },
    ];
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AttributeToStringPipe, CamfilProductAttributesPreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAttributesPreviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;

    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product attributes when available', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('dt')).toHaveLength(3);
    expect(element.getElementsByClassName('attribute-type')).toHaveLength(3);
    expect(element.getElementsByClassName('attribute-value')).toHaveLength(3);
  });

  it('should render product attributes name and value when available', () => {
    product.attributes = [{ name: 'A', type: 'String', value: 'A' }];
    fixture.detectChanges();
    expect(element.querySelectorAll('.attribute-type')[1].textContent).toEqual('A');
    expect(element.querySelectorAll('.attribute-value')[1].textContent).toEqual('A');
  });

  it('should render product attributes name and multiple value when available', () => {
    product.attributes = [{ name: 'A', type: 'MultipleString', value: ['hallo', 'welt'] }];
    component.multipleValuesSeparator = ':::';
    fixture.detectChanges();
    expect(element.querySelectorAll('.attribute-type')[1].textContent).toEqual('A');
    expect(element.querySelectorAll('.attribute-value')[1].textContent).toEqual('hallo:::welt');
  });
});

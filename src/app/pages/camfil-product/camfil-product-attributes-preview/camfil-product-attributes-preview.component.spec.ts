import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

import { CamfilProductAttributesPreviewComponent } from './camfil-product-attributes-preview.component';

describe('Camfil Product Attributes Preview Component', () => {
  let component: CamfilProductAttributesPreviewComponent;
  let fixture: ComponentFixture<CamfilProductAttributesPreviewComponent>;
  let element: HTMLElement;
  let product: Product;
  beforeEach(async () => {
    const attributeGroup = {
      attributes: [
        { name: 'A1', type: 'String', value: 'Value1' },
        { name: 'B1', type: 'MultipleString', value: ['hallo', 'welt'] },
      ],
    } as AttributeGroup;
    product = {
      name: 'FakeProduct',
      sku: 'sku',
      attributeGroups: {
        [AttributeGroupTypes.ProductsDetailAttributes]: attributeGroup,
      } as { [id: string]: AttributeGroup },
    } as Product;

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AttributeToStringPipe, CamfilProductAttributesPreviewComponent],
    }).compileComponents();
  });

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
    fixture.detectChanges();
    expect(element.querySelectorAll('.attribute-type')[1].textContent).toEqual('A1');
    expect(element.querySelectorAll('.attribute-value')[1].textContent).toEqual('Value1');
  });

  it('should render product attributes name and multiple value when available', () => {
    component.multipleValuesSeparator = ':::';
    fixture.detectChanges();
    expect(element.querySelectorAll('.attribute-type')[2].textContent).toEqual('B1');
    expect(element.querySelectorAll('.attribute-value')[2].textContent).toEqual('hallo:::welt');
  });
});

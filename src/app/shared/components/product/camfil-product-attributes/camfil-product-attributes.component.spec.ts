import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

import { CamfilProductAttributesComponent } from './camfil-product-attributes.component';

describe('Camfil Product Attributes Component', () => {
  let component: CamfilProductAttributesComponent;
  let fixture: ComponentFixture<CamfilProductAttributesComponent>;
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
      declarations: [AttributeToStringPipe, CamfilProductAttributesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAttributesComponent);
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
    expect(element.getElementsByTagName('dt')).toHaveLength(2);
    expect(element.getElementsByClassName('attribute-type')).toHaveLength(2);
    expect(element.getElementsByClassName('attribute-value')).toHaveLength(2);
  });

  it('should render product attributes name and value when available', () => {
    fixture.detectChanges();
    expect(element.querySelector('.attribute-type').textContent).toEqual('A1:');
    expect(element.querySelector('.attribute-value').textContent).toEqual('Value1');
  });

  it('should render product attributes name and multiple value when available', () => {
    component.multipleValuesSeparator = ':::';
    fixture.detectChanges();
    expect(element.querySelectorAll('.attribute-type')[1].textContent).toEqual('B1:');
    expect(element.querySelectorAll('.attribute-value')[1].textContent).toEqual('hallo:::welt');
  });
});

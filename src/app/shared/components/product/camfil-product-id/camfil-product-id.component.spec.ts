import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';

import { CamfilProductIdComponent } from './camfil-product-id.component';

describe('Camfil Product Id Component', () => {
  let component: CamfilProductIdComponent;
  let fixture: ComponentFixture<CamfilProductIdComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilProductIdComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductIdComponent);
    component = fixture.componentInstance;
    component.product = { sku: 'test-sku' } as Product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display id for given product id', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-id').textContent).toContain('test-sku');
  });
});

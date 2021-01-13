import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';

import { CamfilQuickViewModalComponent } from './camfil-quick-view-modal.component';

describe('Camfil Quick View Modal Component', () => {
  let product: Product;
  let component: CamfilQuickViewModalComponent;
  let fixture: ComponentFixture<CamfilQuickViewModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilQuickViewModalComponent,
        MockComponent(ContentIncludeComponent),
        MockComponent(ContentViewcontextComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    product = { sku: 'sku' } as Product;
    product.availability = true;
    fixture = TestBed.createComponent(CamfilQuickViewModalComponent);
    component = fixture.componentInstance;
    component.product = product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

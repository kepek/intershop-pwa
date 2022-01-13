import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';

import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';

import { CamfilRequisitionLineItemQuantityComponent } from './camfil-requisition-line-item-quantity.component';

describe('Camfil Requisition Line Item Quantity Component', () => {
  let component: CamfilRequisitionLineItemQuantityComponent;
  let fixture: ComponentFixture<CamfilRequisitionLineItemQuantityComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilRequisitionLineItemQuantityComponent,
        MockComponent(CamfilProductQuantityComponent),
        MockPipe(CamfilSlugifyPipe),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionLineItemQuantityComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

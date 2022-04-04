import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilCheckoutGoodsAcceptanceModalComponent } from './camfil-checkout-goods-acceptance-modal.component';

describe('Camfil Checkout Goods Acceptance Modal Component', () => {
  let component: CamfilCheckoutGoodsAcceptanceModalComponent;
  let fixture: ComponentFixture<CamfilCheckoutGoodsAcceptanceModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCheckoutGoodsAcceptanceModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutGoodsAcceptanceModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

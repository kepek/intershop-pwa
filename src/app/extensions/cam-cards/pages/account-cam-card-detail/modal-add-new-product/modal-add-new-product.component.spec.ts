import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';

import { ModalAddNewProductComponent } from './modal-add-new-product.component';

describe('Modal Add New Product Component', () => {
  let component: ModalAddNewProductComponent;
  let fixture: ComponentFixture<ModalAddNewProductComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const camCardsFacade = mock(CamCardsFacade);
    when(camCardsFacade.currentCamCard$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductQuantityComponent,
        ModalAddNewProductComponent,
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNewProductComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

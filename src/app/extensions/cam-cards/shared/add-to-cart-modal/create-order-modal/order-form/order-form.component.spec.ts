import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

import { CamCardsFacade } from '../../../../facades/cam-cards.facade';

import { OrderFormComponent } from './order-form.component';

describe('Order Form Component', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilErrorComponent, OrderFormComponent],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

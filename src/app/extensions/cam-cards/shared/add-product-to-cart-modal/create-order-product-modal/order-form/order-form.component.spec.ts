import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';

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
      declarations: [
        CamfilErrorComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(ZipCodeComponent),
        MockPipe(AddressSortPipe),
        OrderFormComponent,
      ],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(camCardFacadeMock.addresses$).thenReturn(of({}));
    when(camCardFacadeMock.customers$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

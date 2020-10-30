import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamfilOrderListComponent } from './camfil-order-list.component';

describe('Camfil Order List Component', () => {
  let component: CamfilOrderListComponent;
  let fixture: ComponentFixture<CamfilOrderListComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilOrderListComponent,
        MockComponent(AddressComponent),
        MockComponent(LoadingComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    when(accountFacade.orders$()).thenReturn(of([]));
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no orders', () => {
    when(accountFacade.orders$()).thenReturn(of([]));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });
});

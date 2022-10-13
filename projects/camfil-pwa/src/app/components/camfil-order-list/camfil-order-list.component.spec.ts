import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { SearchInputComponent } from 'ish-shared/forms/components/search-input/search-input.component';

import { CamfilOrderListComponent } from './camfil-order-list.component';

describe('Camfil Order List Component', () => {
  let component: CamfilOrderListComponent;
  let fixture: ComponentFixture<CamfilOrderListComponent>;
  let element: HTMLElement;
  let camfilAccountFacade: CamfilPwaFacade;

  beforeEach(async () => {
    camfilAccountFacade = mock(CamfilPwaFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilOrderListComponent,
        MockComponent(AddressComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(SearchInputComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: CamfilPwaFacade, useFactory: () => instance(camfilAccountFacade) }],
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_ALL_ORDERS'),
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    when(camfilAccountFacade.orders$()).thenReturn(of([]));
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no orders', () => {
    when(camfilAccountFacade.orders$()).thenReturn(of([]));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyList]')).toBeTruthy();
  });
});

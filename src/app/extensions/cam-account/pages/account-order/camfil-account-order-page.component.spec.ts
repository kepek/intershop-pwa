import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { CamAccountFacade } from '../../facades/cam-account.facade';

import { CamfilAccountOrderPageComponent } from './camfil-account-order-page.component';
import { CamfilAccountOrderComponent } from './camfil-account-order/camfil-account-order.component';

describe('Camfil Account Order Page Component', () => {
  let component: CamfilAccountOrderPageComponent;
  let fixture: ComponentFixture<CamfilAccountOrderPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), RouterTestingModule],
      declarations: [CamfilAccountOrderPageComponent, MockComponent(CamfilAccountOrderComponent)],
      providers: [{ provide: CamAccountFacade, useFactory: () => instance(mock(CamAccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountOrderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

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
      providers: [{ provide: CamfilPwaFacade, useFactory: () => instance(mock(CamfilPwaFacade)) }],
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

import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { CamfilProductCompareStatusComponent } from './camfil-product-compare-status.component';

describe('Camfil Product Compare Status Component', () => {
  let component: CamfilProductCompareStatusComponent;
  let fixture: ComponentFixture<CamfilProductCompareStatusComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilProductCompareStatusComponent, DummyComponent, MockComponent(FaIconComponent)],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compare', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductCompareStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should navigate to compare page when compare icon is clicked', async () => {
    inject([Location], (location: Location) => {
      fixture.detectChanges();
      element.querySelector('a').click();
      fixture.whenStable().then(() => {
        expect(location.path()).toContain('compare');
      });
    });
  });
});

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { CamfilFilterAppliedComponent } from './camfil-filter-applied.component';

describe('Camfil Filter Applied Component', () => {
  let component: CamfilFilterAppliedComponent;
  let fixture: ComponentFixture<CamfilFilterAppliedComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilFilterAppliedComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterAppliedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

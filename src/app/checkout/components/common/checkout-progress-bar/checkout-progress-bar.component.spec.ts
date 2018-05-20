import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { CheckoutProgressBarComponent } from './checkout-progress-bar.component';

describe('Checkout Progress Bar Component', () => {
  let component: CheckoutProgressBarComponent;
  let fixture: ComponentFixture<CheckoutProgressBarComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CheckoutProgressBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProgressBarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 links (to address page, shipping page and payment page) if step = 4 (review)', () => {
    component.step = 4;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('li a[routerLink]').length).toEqual(3);
  });

  it('should not display any links if basket step = 5 (receipt)', () => {
    component.step = 5;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('li a[routerLink]').length).toEqual(0);
  });
});

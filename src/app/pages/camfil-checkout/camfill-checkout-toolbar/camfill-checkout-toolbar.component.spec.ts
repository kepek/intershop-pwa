import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfillCheckoutToolbarComponent } from './camfill-checkout-toolbar.component';

describe('Camfill Checkout Toolbar Component', () => {
  let component: CamfillCheckoutToolbarComponent;
  let fixture: ComponentFixture<CamfillCheckoutToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfillCheckoutToolbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfillCheckoutToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

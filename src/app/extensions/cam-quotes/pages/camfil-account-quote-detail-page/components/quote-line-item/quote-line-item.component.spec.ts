import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { QuoteLineItemComponent } from './quote-line-item.component';

describe('Quote Line Item Component', () => {
  let component: QuoteLineItemComponent;
  let fixture: ComponentFixture<QuoteLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(CamfilCounterComponent), QuoteLineItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.item = {
      type: 'CamfilQuotationLineItem',
      lineItemId: 'Ratione inventore',
      originSinglePrice: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      originTotalPrice: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      quantity: {
        type: 'Quantity',
        value: 14,
        unit:
          'Numquam vel aliquid voluptate aut quos ipsam ea ab aut. Corporis rerum architecto officiis expedita nulla odio. Vero voluptatem facere illum sit ratione labore.\n \rOmnis et et rerum aspernatur esse quis reiciendis ullam. Quaerat laudantium tenetur suscipit labore sapiente architecto distinctio. Sapiente architecto officia. Eum temporibus nisi velit sint tenetur assumenda consequatur magni unde.\n \rPlaceat cumque sapiente nulla. Placeat eius laudantium vero sit possimus. Et id nemo excepturi alias maxime. Dolore veniam in quisquam non provident fuga in. Magni quas ullam a cupiditate quas dolores cumque ut. In earum doloremque est.',
      },
      singlePrice: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      totalPrice: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      productSKU: 'In et consequatur',
      product: {
        name: 'Qui iure quia at iure voluptatum',
        type: 'Voluptatum consequatur maxime et nam.',
        sku: 'tenetur',
        longDescription: 'voluptates',
        available: true,
      },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPipe } from 'ng-mocks';

import { CamfilDatePipe } from 'ish-core/pipes/camfil-date.pipe';

import { QuoteDetailsComponent } from './quote-details.component';

describe('Quote Details Component', () => {
  let component: QuoteDetailsComponent;
  let fixture: ComponentFixture<QuoteDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockPipe(CamfilDatePipe), QuoteDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDetailsComponent);
    component = fixture.componentInstance;
    component.details = {
      id: 'Consectetur in distinctio eum ex.\nPerspiciatis optio minus architecto.',
      type: 'possimus',
      quotationType: 'quotation',
      customerName: 'Pariatur repudiandae',
      customerNumber: 'eveniet',
      customerDepartment: 'Aut doloribus adipisci.',
      camfilQuoteNumber: 'ipsam',
      customerQuoteNumber: 'quis dolores rerum',
      requestedBy: 'Qui et quod sequi dolores magni illum in optio.',
      requestedDate: 40,
      quotationDate: 32,
      status: 0,
      statusText: 'Asperiores',
      orderChannel: 'Est eveniet dicta neque dolorem.',
      displayName: 'Et ea quis.',
      number: 'ut nulla ut',
      customerId: 'odio aut consequatur',
      userFirstName: 'Eos sint facilis accusantium sequi error neque dolore ab aut. Delectus aut sit.',
      userLastName: 'ut',
      phone: 'Qui provident quia vel vel voluptatem neque.',
      customerServiceNote: 'recusandae nesciunt qui',
      editable: true,
      submitted: true,
      total: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      items: [
        {
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
        },
      ],
      deliveryAddress: {
        id: 'at',
        urn: 'Aliquid consequatur illo dolorem architecto.',
        type: 'alias',
        addressName: 'vitae consequatur sit',
        companyName1: 'Quas et ea eum quod dolor.',
        companyName2: 'Est ut iste.',
        countryCode: 'Est ut iste.',
        title: 'ut',
        firstName: 'Ut animi sed fugiat reiciendis et neque nostrum.',
        lastName: 'Aliquid quis sed quia. Doloremque aut aut laborum dignissimos omnis.',
        addressLine1: 'Quia molestias consequatur.',
        addressLine2: 'maxime maiores explicabo',
        addressLine3: 'Quo tenetur quo.',
        postalCode: 'Non qui recusandae aliquid asperiores sed blanditiis.',
        city: 'Est autem vel reprehenderit non molestiae.',
        mainDivision: 'Cumque ea ullam omnis qui.',
        mainDivisionCode: 'Similique facere quod nulla et tempora consequuntur maxime optio.',
        country: 'Eius iusto ab vero perspiciatis recusandae.',
        phoneHome: 'veniam',
        phoneMobile: 'Excepturi commodi alias mollitia quia ab.',
        phoneBusiness: 'Quae aut et quis voluptatem quos error.',
        phoneBusinessDirect: 'Consequatur est labore dolorum et sed.',
        fax: 'autem dolor temporibus',
        email: 'Fuga incidunt et optio a voluptatibus ut.',
        invoiceToAddress: true,
        shipToAddress: true,
        shipFromAddress: true,
        serviceToAddress: true,
        installToAddress: true,
        eligibleShipToAddress: true,
        goodsAcceptanceNote: 'Dolorem enim quis error molestiae.',
      },
      quotationReference: '',
      validToDate: 0,
      taxAmount: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      totalPriceAfterDiscountExVAT: {
        type: 'Money',
        value: 43,
        currency: 'Tempora eos deserunt.',
      },
      totalQty: 0,
    };
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

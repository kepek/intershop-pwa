import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { PdfHelper } from 'src/app/extensions/cam-pdf/models/pdf.helper';
import { DataToPdf } from 'src/app/extensions/cam-pdf/models/pdf.interface';
import { CamPdfService } from 'src/app/extensions/cam-pdf/services/cam-pdf/cam-pdf.service';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { Price } from 'ish-core/models/price/price.model';
import { formatPrice } from 'ish-core/models/price/price.pipe';
import { ProductViewHelper } from 'ish-core/models/product-view/product-view.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { User } from 'ish-core/models/user/user.model';
import { formatISHDate } from 'ish-core/pipes/date.pipe';
import { whenTruthy } from 'ish-core/utils/operators';

export interface PdfProductInfo {
  name?: string;
  deliveryDays?: string;
}

@Component({
  selector: 'camfil-print-order',
  templateUrl: './print-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintOrderComponent implements OnInit {
  constructor(
    private productFacade: ShoppingFacade,
    private pdfService: CamPdfService,
    private accountFacade: AccountFacade,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  get summaryObjs() {
    return this.buckets.reduce(
      (acc, { deliveryAddressId, lineItems }) => ({
        ...acc,
        [deliveryAddressId]: {
          discount: PriceHelper.discount(lineItems),
          total: PriceHelper.totalPrice(lineItems),
          tax: PriceHelper.totalTax(lineItems),
          totalGross: PriceHelper.totalPrice(lineItems, 'gross'),
        },
      }),
      {}
    );
  }
  @Input() buckets: Bucket[];
  user: User;
  productsInfo: {
    [sku: string]: PdfProductInfo;
  } = {};

  texts = {
    customerAccount: this.translate.instant('camfil.account.cam_card.pdf.customer_account'),
    artNr: this.translate.instant('camfil.account.cam_card.pdf.art_nr'),
    boxLabel: this.translate.instant('camfil.account.cam_card.pdf.box_label'),
    quantity: this.translate.instant('camfil.account.cam_card.pdf.quantity'),
    price: this.translate.instant('camfil.account.cam_card.pdf.price'),
    yourTotal: this.translate.instant('camfil.account.cam_card.pdf.your_total'),
    printDate: this.translate.instant('camfil.account.cam_card.pdf.print_date'),
    printedBy: this.translate.instant('camfil.account.cam_card.pdf.printed_by'),
    deliveryAddress: this.translate.instant('camfil.account.cam_card.pdf.delivery_address'),
    measurements: this.translate.instant('camfil.account.cam_card.pdf.measurements'),

    deliveryDate: this.translate.instant('camfil.account.pdf.delivery_date'),
    invoiceLabel: this.translate.instant('camfil.account.pdf.invoice_label'),
    orderMark: this.translate.instant('camfil.account.pdf.order_mark'),
    phoneNumber: this.translate.instant('camfil.account.pdf.phone_number'),
    info: this.translate.instant('camfil.account.pdf.information'),
    contactPerson: this.translate.instant('camfil.account.pdf.contact_person'),
    deliveryDays: this.translate.instant('camfil.account.pdf.deliver_days'),
  };

  ngOnInit() {
    this.accountFacade.user$.pipe(whenTruthy(), take(1)).subscribe(user => {
      this.user = user;
    });
  }

  calculateDeliveryDate(product: ProductView) {
    const today = new Date();
    const daysTillReady = ProductViewHelper.getDeliveryDateDays(product) + 1;
    const delivery = today.setDate(today.getDate() + daysTillReady);

    return this.handleDate(AttributeHelper.formatDeliveryDate(new Date(delivery)), 'shortDate');
  }

  handlePrint() {
    const skus = this.buckets.reduce(
      (acc, { lineItems }) => [
        ...acc,
        ...lineItems.filter(({ productSKU }) => !acc.includes(productSKU)).map(({ productSKU }) => productSKU),
      ],
      []
    );
    skus.forEach(sku => {
      this.productFacade
        .product$(sku, PrintOrderComponent.REQUIRED_COMPLETENESS_LEVEL)
        .pipe(whenTruthy(), take(1))
        .subscribe((res: ProductView) => {
          this.productsInfo[sku] = {
            name: res.name,
            deliveryDays: this.calculateDeliveryDate(res),
          };
        });
    });

    const styles = PdfHelper.pdfStyles();
    const images = PdfHelper.pdfImages();
    const content = this.preparePdfContent();
    const data: DataToPdf = { content, styles, images, showFooter: false };

    this.pdfService.printPdf(data);
  }

  preparePdfContent() {
    return this.buckets.reduce((res, bucket, i) => {
      const items = [PdfHelper.pdfTable(this.pdfItemsRow(bucket))];
      res.push(this.pdfHeader(i), this.pdfInfoPart(bucket, i), items, this.pdfTotal(bucket.deliveryAddressId));
      return res;
    }, []);
  }

  pdfHeader(pageBreak: boolean | number) {
    const basicDate = new Date();
    const date = this.handleDate(basicDate);
    return PdfHelper.pdfHeader(
      pageBreak,
      this.texts.printDate,
      this.texts.printedBy,
      { firstName: this.user.firstName, lastName: this.user.lastName },
      date
    );
  }

  pdfInfoPart(bucket: Bucket, idx: number) {
    const { shipToAddressFull, customer, contactPerson } = bucket;
    const orderNo = `${idx + 1}/${this.buckets?.length}`;
    const { customerNo, companyName, department } = customer;
    const infoParts = [customerNo, companyName, department].filter(Boolean);

    const title = `Order ${orderNo} - ${infoParts.join(', ')}`;
    return [
      {
        style: 'header',
        layout: 'noBorders',
        margin: [0, 0, 0, 10],
        table: {
          widths: ['auto', '*'],
          body: [
            [
              {
                svg:
                  '<svg viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><g fill="none" stroke="#00673e" stroke-linecap="round" stroke-miterlimit="10"><path d="M5 23v2H2.1c-.6 0-1.1-.5-1.1-1.1V2.1C1 1.5 1.5 1 2.1 1h21.8c.6 0 1.1.5 1.1 1.1v21.8c0 .6-.5 1.1-1.1 1.1H8.6v-2M1 12.7h11.1M12.2 5.8v15.3M24.9 13h-8.3"></path></g></svg>',
                fit: [30, 30],
                margin: [10, 6, 0, 0],
              },
              { text: title, margin: [10, 10, 10, 10] },
            ],
          ],
        },
      },
      {
        style: 'info',
        columns: [
          {
            width: '30%',
            table: {
              body: [
                [this.texts.deliveryDate, { text: bucket.deliveryDate, bold: true }],
                [this.texts.invoiceLabel, { text: bucket.invoiceLabel || '---', bold: true }],
                [this.texts.orderMark, { text: bucket.orderMark || '---', bold: true }],
                [this.texts.phoneNumber, { text: bucket.phoneNumber || '---', bold: true }],
                [this.texts.info, { text: bucket.info || '---', bold: true }],
              ],
            },
            widths: ['*', 'auto'],
            layout: 'noBorders',
          },
          {
            width: '*',
            table: {
              body: [
                [
                  this.texts.deliveryAddress,
                  [
                    { text: shipToAddressFull.companyName1, bold: true },
                    { text: shipToAddressFull.addressLine1, bold: true },
                    { text: shipToAddressFull.addressLine2, bold: true },
                    { text: `${shipToAddressFull.postalCode}, ${shipToAddressFull.city}`, bold: true },
                    { text: shipToAddressFull.country, bold: true },
                  ],
                ],
              ],
            },
            layout: 'noBorders',
            widths: ['*', 'auto'],
          },
          {
            width: '30%',
            table: {
              body: [
                [
                  { text: this.texts.customerAccount },
                  [
                    { text: customer.companyName, bold: true },
                    { text: customer.companyName2, bold: true },
                    { text: customer.customerNo, bold: true },
                  ],
                ],
                [
                  { text: this.texts.contactPerson },
                  [{ text: `${contactPerson.firstName} ${contactPerson.lastName}`, bold: true }],
                ],
              ],
            },
            layout: 'noBorders',
            widths: ['auto', '*'],
          },
        ],
      },
    ];
  }

  pdfProductRow(item: LineItemView, index: number) {
    const sku = item.productSKU;
    const artNo = `${this.texts.artNr} `;
    const artNoVal = { text: sku, bold: true };

    const deliveryDays = this.productsInfo[sku].deliveryDays;
    const deliveryDaysText = deliveryDays ? `${this.texts.deliveryDays}: ` : '';
    const deliveryDaysVal = { text: deliveryDays, bold: true };
    const label = item.attributes.find(attr => attr.name === 'boxLabel')?.value;
    const boxLabelText = label ? ` | ${this.texts.boxLabel}: ` : '';
    const boxLabelVal = { text: label, bold: true };

    const measurementsToShow = AttributeHelper.getMeasurementsText(item);
    const measurementsText = measurementsToShow ? ` | ${this.texts.measurements}: ` : '';
    const arrRightInfo = [
      { text: [artNo, artNoVal] },
      {
        stack: [{ text: [deliveryDaysText, deliveryDaysVal, boxLabelText, boxLabelVal] }],
      },
    ];

    const qty = `${this.texts.quantity} `;
    const qtyVal = { text: item.quantity.value, bold: true };
    const priceVal = this.handlePrice({
      value: item.totals.total.net,
      currency: item.totals.total.currency,
      type: 'Money',
    });
    const priceLabel = ` | ${this.texts.price} `;
    const price = { text: priceVal, bold: true };
    const arrLeftInfo = [qty, qtyVal, priceLabel, price];

    const name = {
      text: [this.productsInfo[sku].name, measurementsText, { text: measurementsToShow, bold: true }],
    };

    return PdfHelper.pdfProductRow(index, name, arrRightInfo, arrLeftInfo, item.id);
  }

  pdfItemsRow(bucket: Bucket) {
    const sortedLineItems = bucket.lineItems
      .slice()
      .sort((a, b) => (a.position > b.position ? 1 : b.position > a.position ? -1 : 0));
    return sortedLineItems.map((el, i) => this.pdfProductRow(el, i));
  }

  pdfTotal(id: string) {
    return {
      alignment: 'right',
      style: 'total',
      layout: 'noBorders',
      table: {
        widths: ['*', 1],
        body: [
          [
            {
              fillColor: '#F2F2F2',
              text: [
                { text: `\n ${this.texts.yourTotal} `, bold: true },
                { text: this.handlePrice(this.summaryObjs[id].total), fontSize: 15, bold: true },
                { text: '\n ' },
              ],
            },
            {
              fillColor: '#F2F2F2',
              text: '',
            },
          ],
        ],
      },
    };
  }

  handlePrice(data: Price) {
    return data ? formatPrice(data, this.translate.currentLang) : '---';
  }

  handleDate(data: Date | string, format = 'medium') {
    return formatISHDate(data, format, this.translate.currentLang);
  }

  getValFromAttrs(item: LineItemView, name: string) {
    return item?.attributes?.find(att => att.name === name)?.value;
  }
}

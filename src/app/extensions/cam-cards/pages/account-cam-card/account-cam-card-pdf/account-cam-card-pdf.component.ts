import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { PdfHelper } from 'src/app/extensions/cam-pdf/models/pdf.helper';

import { AuthorizationToggleService } from 'ish-core/authorization-toggle.module';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Price } from 'ish-core/models/price/price.model';
import { formatPrice } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { User } from 'ish-core/models/user/user.model';
import { formatISHDate } from 'ish-core/pipes/date.pipe';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import {
  CamCardTotalPricesObj,
  DataToPdf,
  PDFProductLine,
  ProductsObj,
} from '../../../../cam-pdf/models/pdf.interface';
import { CamPdfService } from '../../../../cam-pdf/services/cam-pdf/cam-pdf.service';
import { CamCardHelper } from '../../../models/cam-card/cam-card.helper';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-pdf',
  templateUrl: './account-cam-card-pdf.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardPdfComponent implements OnInit {
  constructor(
    private productFacade: ShoppingFacade,
    private pdfService: CamPdfService,
    private accountFacade: AccountFacade,
    public dialog: MatDialog,
    private translate: TranslateService,
    private authorizationToggle: AuthorizationToggleService
  ) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;
  @Input() camCards: CamCard[] = [];

  user: User;
  products: ProductsObj = {};
  sumPrice: CamCardTotalPricesObj = {};
  skuEqProducts = false;
  pdfLoading = false;
  listForCustomerPrices = {};
  customerPricesLoaded: boolean;
  texts = {
    customerAccount: this.translate.instant('camfil.account.cam_card.pdf.customer_account'),
    artNr: this.translate.instant('camfil.account.cam_card.pdf.art_nr'),
    dimensions: this.translate.instant('camfil.account.cam_card.pdf.dimensions'),
    eficciency: this.translate.instant('camfil.account.cam_card.pdf.eficciency'),
    boxLabel: this.translate.instant('camfil.account.cam_card.pdf.box_label'),
    quantity: this.translate.instant('camfil.account.cam_card.pdf.quantity'),
    packSize: this.translate.instant('camfil.account.cam_card.pdf.pack_size'),
    price: this.translate.instant('camfil.account.cam_card.pdf.price'),
    orderMark: this.translate.instant('camfil.account.cam_card.pdf.order_mark'),
    invoiceMark: this.translate.instant('camfil.account.cam_card.pdf.invoice_mark'),
    lastOrder: this.translate.instant('camfil.account.cam_card.pdf.last_order'),
    yourTotal: this.translate.instant('camfil.account.cam_card.pdf.your_total'),
    printDate: this.translate.instant('camfil.account.cam_card.pdf.print_date'),
    printedBy: this.translate.instant('camfil.account.cam_card.pdf.printed_by'),
    deliveryAddress: this.translate.instant('camfil.account.cam_card.pdf.delivery_address'),
  };

  ngOnInit() {
    this.accountFacade.user$.pipe(whenTruthy(), take(1)).subscribe(user => {
      this.user = user;
    });
  }

  loadCustomerPrice() {
    this.pdfLoading = true;
    this.customerPricesLoaded = false;
    this.authorizationToggle
      .isAuthorizedTo('APP_B2B_PRINT_PRICES')
      .pipe(take(1))
      .subscribe(permission => {
        if (permission) {
          const listToGetCustomerPrices = CamCardHelper.handleCamCardsToGetCustomerPrice(this.camCards);
          const customersId = Object.keys(listToGetCustomerPrices);
          this.listForCustomerPrices = {};
          customersId.forEach(customerId => {
            this.productFacade.loadCustomerPrices(customerId, listToGetCustomerPrices[customerId]);

            this.productFacade
              .getCustomerPrices$(customerId)
              .pipe(whenTruthy(), take(1))
              .subscribe(prices => {
                this.listForCustomerPrices[customerId] = prices;
                if (Object.keys(this.listForCustomerPrices).length === customersId.length) {
                  this.customerPricesLoaded = true;
                  this.pdfLoading = false;
                }
              });
          });
        } else {
          this.generatePdfWithoutPrices();
        }
      });
  }

  handlePrice(data: Price) {
    return data ? formatPrice(data, this.translate.currentLang) : '---';
  }

  handleDate(data: Date) {
    return formatISHDate(data, 'medium', this.translate.currentLang);
  }

  openPdfGenDialog() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();

    this.loadCustomerPrice();
  }

  generatePdf(showPrice?: boolean) {
    this.skuEqProducts = false;
    this.products = {};
    this.sumPrice = {};

    const prodSkusList = this.camCards
      .reduce((acc, cc) => {
        acc.push(...CamCardHelper.getCamCardSkus(cc));
        return acc;
      }, [])
      .filter((it, i, arr) => arr.findIndex(el => el === it) === i);

    prodSkusList.forEach(sku => {
      this.productFacade
        .product$(sku, AccountCamCardPdfComponent.REQUIRED_COMPLETENESS_LEVEL)
        .pipe(whenTruthy(), take(1))
        .subscribe((res: ProductView) => {
          this.products[sku] = res;

          const firstCCId = this.camCards[0].id;
          if (res.salePrice && !this.sumPrice[firstCCId]) {
            this.camCards.forEach(camCard => {
              this.sumPrice[camCard.id] = { type: 'Money', value: 0, currency: res.salePrice.currency };
            });
          }

          if (Object.keys(this.products).length === prodSkusList.length && !this.skuEqProducts) {
            this.skuEqProducts = true;
            this.pdfLoading = false;

            // double check if sumPrice is not filled yet
            if (!this.sumPrice[firstCCId]) {
              this.camCards.forEach(camCard => {
                this.sumPrice[camCard.id] = { type: 'Money', value: 0, currency: '--' };
              });
            }

            const styles = PdfHelper.pdfStyles();
            const images = PdfHelper.pdfImages();
            const content = this.preparePdfContent(showPrice);
            const data: DataToPdf = { content, styles, images };

            this.pdfService.printPdf(data);
            this.dialog.closeAll();
          }
        });
    });
  }

  generatePdfWithoutPrices() {
    this.generatePdf();
  }

  generatePdfWithPrices() {
    this.generatePdf(true);
  }

  preparePdfContent(showPrice?: boolean) {
    return this.camCards.reduce((res, camCard, i) => {
      const firstLevelItems = [this.pdfCamCardTable(this.pdfItemsRow(camCard, showPrice))];
      const subs = camCard.subCamCards
        .filter(el => el.camCardItems.length)
        .map(sub => this.pdfSubItemsRowToTable(sub, showPrice));
      if (camCard.camCardItems.length) {
        subs.unshift(firstLevelItems);
      }
      res.push(this.pdfHeader(i), this.pdfInfoPart(camCard), subs, showPrice ? this.pdfTotal(camCard.id) : '');
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

  pdfInfoPart(camCard: CamCard) {
    const { customer, deliveryAddress, name } = camCard;
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
              { text: name, margin: [10, 10, 10, 10] },
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
                [this.texts.orderMark, { text: camCard.orderLabel, bold: true }],
                [this.texts.invoiceMark, { text: camCard.invoiceLabel, bold: true }],
                [this.texts.lastOrder, { text: camCard.lastDeliveryDate, bold: true }],
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
                    { text: deliveryAddress.addressLine1, bold: true },
                    { text: deliveryAddress.addressLine1, bold: true },
                    { text: deliveryAddress.postalCode, bold: true },
                    { text: `${deliveryAddress.city}, ${deliveryAddress.country}`, bold: true },
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
                    { text: customer.description, bold: true },
                  ],
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

  pdfProductRow(camCard: CamCard, item: CamCardItem, index: number, showPrice: boolean): PDFProductLine {
    const sku = item.product.sku;
    const artNo = `${this.texts.artNr} `;
    const artNoVal = { text: sku, bold: true };
    const dimen = ` | ${this.texts.dimensions} `;
    const dimenVal = { text: '123x23x23', bold: true }; // TODO: Dimensions val
    const eficc = ` | ${this.texts.eficciency} `;
    const eficcVal = { text: 'XXxxXX', bold: true }; // TODO: Eficciency val
    const labelText = item.comment?.label;
    const label = labelText ? ` | ${this.texts.boxLabel} ` : '';
    const labelVal = labelText ? { text: labelText, bold: true } : '';

    const qty = `${this.texts.quantity} `;
    const qtyVal = { text: item.quantity, bold: true };
    const size = ` | ${this.texts.packSize} `;
    const sizeVal = { text: 'xxx', bold: true }; // TODO: Pack size val
    const priceObj = this.getCustomerPriceForItem(camCard, item) || this.products[sku]?.salePrice;
    const priceVal = this.handlePrice(priceObj);
    const priceLabel = showPrice ? ` | ${this.texts.price} ` : '';
    const price = showPrice ? { text: priceVal, bold: true } : '';
    const arrLine3a = [artNo, artNoVal, dimen, dimenVal, eficc, eficcVal, label, labelVal];
    const arrLine3b = [qty, qtyVal, size, sizeVal, priceLabel, price];

    return PdfHelper.pdfProductRow(index, item.product.name, arrLine3a, arrLine3b);
  }

  pdfItemsRow(camCard: CamCard, showPrice: boolean) {
    return camCard.camCardItems
      .map((el, i) => {
        const id = camCard.rootCamCard || camCard.id;
        const price =
          this.getCustomerPriceForItem(camCard, el)?.value || this.products[el.product.sku].salePrice?.value || 0;
        this.sumPrice[id].value = (this.sumPrice[id].value || 0) + price * el.quantity;
        return this.pdfProductRow(camCard, el, i, showPrice);
      })
      .reduce((res, { line1, line2, line3, line4 }) => {
        res.push(line1, line2, line3, line4);
        return res;
      }, []);
  }

  getCustomerPriceForItem(camCard: CamCard, el: CamCardItem) {
    const productCustomerPrice = this.listForCustomerPrices[camCard.customer.id]?.find(
      product => product.sku === el.product.sku
    );
    return productCustomerPrice?.salePrice || undefined;
  }

  pdfSubItemsRowToTable(camCard: CamCard, showPrice: boolean) {
    const items = this.pdfItemsRow(camCard, showPrice);
    items.unshift([
      { text: `\n \u00A0 \u00A0  ${camCard.name} \n `, fillColor: '#F2F2F2', colSpan: 3, style: 'subHeader' },
      '',
      '',
    ]);
    return [this.pdfCamCardTable(items, true)];
  }

  pdfCamCardTable(body, sub?: boolean) {
    return PdfHelper.pdfTable(body, sub);
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
                { text: this.handlePrice(this.sumPrice[id]), fontSize: 15, bold: true },
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
}

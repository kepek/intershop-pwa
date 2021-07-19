import { Injectable } from '@angular/core';

import { DataToPdf } from '../../models/pdf.interface';

@Injectable({ providedIn: 'root' })
export class CamPdfService {
  pdfMake: any;

  constructor() {}

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(data: DataToPdf) {
    const { content, styles, images, showFooter } = data;
    await this.loadPdfMaker();

    // tslint:disable-next-line:variable-name
    const pageBreakBefore = ({ id }, _followingNodesOnPage: any, nodesOnNextPage) => {
      const start = id?.replace('rowIndex', '')?.replace('rowName', '');
      return nodesOnNextPage.find(node => node?.id === 'rowEnd' + start);
    };

    const def = {
      content,
      pageBreakBefore,
      styles,
      images,
      footer: showFooter
        ? (currentPage, pageCount) => [{ text: currentPage.toString() + '/' + pageCount, alignment: 'center' }]
        : '',
    };
    return this.pdfMake.createPdf(def);
  }

  async printPdf(data) {
    const pdf = await this.generatePdf(data);
    pdf.print();
  }
  async openPdf(data) {
    const pdf = await this.generatePdf(data);
    pdf.open();
  }
  async downloadPdf(data) {
    const pdf = await this.generatePdf(data);
    pdf.download();
  }
}

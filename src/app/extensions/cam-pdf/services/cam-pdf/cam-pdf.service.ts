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

    const def = {
      content,
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

import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

export interface DialogData {
  article: string;
}

@Component({
  selector: 'camfil-cms-lightbox-link',
  templateUrl: './camfil-cms-lightbox-link.component.html',
})
export class CamfilCmsLightboxLinkComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
  closeResult = '';

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(CamfilCmsLightboxLinkArticleComponent, {
      data: {
        article: this.pagelet.stringParam('Article'),
      },
    });
  }
}

@Component({
  selector: 'camfil-cms-lightbox-article',
  templateUrl: 'camfil-cms-lightbox-article.component.html',
})
export class CamfilCmsLightboxLinkArticleComponent {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  closeDialog() {
    this.dialog.closeAll();
  }
}

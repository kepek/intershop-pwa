import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

export interface DialogData {
  article: string;
}

@Component({
  selector: 'camfil-cms-lightbox-link',
  templateUrl: './camfil-cms-lightbox-link.component.html',
  styleUrls: ['./camfil-cms-lightbox-link.component.scss'],
})
export class CamfilCmsLightboxLinkComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
  closeResult = '';

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(CamfilCmsLightboxLinkArticleComponent, {
      autoFocus: false,
      maxHeight: '80vh',
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
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<CamfilCmsLightboxLinkArticleComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}

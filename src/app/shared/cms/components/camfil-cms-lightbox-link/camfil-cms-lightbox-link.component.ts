import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
export class CamfilCmsLightboxLinkArticleComponent implements OnInit {
  safeHtmlData: SafeHtml;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<CamfilCmsLightboxLinkArticleComponent>
  ) {}

  ngOnInit(): void {
    this.safeHtmlData = this.sanitizer.bypassSecurityTrustHtml(this.data.article);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

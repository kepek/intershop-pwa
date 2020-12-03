import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'camfil-organization-header',
  templateUrl: './camfil-organization-header.component.html',
  styleUrls: ['./camfil-organization-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilOrganizationHeaderComponent implements AfterViewInit {
  constructor(private cd: ChangeDetectorRef) {}

  @ViewChild('back') back: ElementRef;
  @ViewChild('title') title: ElementRef;
  @ViewChild('extra') extra: ElementRef;

  showBackContent = false;
  showTitleContent = false;
  showExtraContent = false;

  ngAfterViewInit() {
    this.showBackContent = this.back?.nativeElement?.childNodes?.length > 0;
    this.showTitleContent = this.title?.nativeElement?.childNodes?.length > 0;
    this.showExtraContent = this.extra?.nativeElement?.childNodes?.length > 0;
    this.cd.detectChanges();
  }
}

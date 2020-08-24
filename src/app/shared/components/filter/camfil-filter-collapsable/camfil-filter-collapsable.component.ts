import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'camfil-filter-collapsable',
  templateUrl: './camfil-filter-collapsable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-filter-collapsable.component.scss'],
})
export class CamfilFilterCollapsableComponent implements OnInit {
  @Input() title: string;
  @Input() collapsed: boolean;
  @Output() collapsedChange = new EventEmitter<boolean>();

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.collapsed;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }
}

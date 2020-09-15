import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DeviceType, NextOpenLevelOnMobileNavType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'camfil-user-links',
  templateUrl: './camfil-user-links.component.html',
  styleUrls: ['./camfil-user-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilUserLinksComponent {
  @Input() deviceType: DeviceType;
  @Input() nextOpenLevelOnMobileNav: NextOpenLevelOnMobileNavType = '';
  @Output() isClosedNextLevel = new EventEmitter<NextOpenLevelOnMobileNavType>();
  closedLangList = true;

  toggleLang(val: boolean) {
    this.closedLangList = !val;
    this.isClosedNextLevel.emit(val ? 'userLinks' : '');
  }
}

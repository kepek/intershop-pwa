import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { DeviceType, NextOpenLevelOnMobileNavType } from 'ish-core/models/viewtype/viewtype.types';

type CollapsibleComponent = 'search' | 'navbar' | 'minibasket';

/**
 * The Header Component displays the page header.
 *
 * It uses the {@link LoginStatusContainerComponent} for rendering the users login status.
 * It uses the {@link ProductCompareStatusContainerComponent} for rendering the product compare button and count.
 * It uses the {@link MobileBasketContainerComponent} for rendering the mobile basket button and basket item count.
 * It uses the {@link LanguageSwitchContainerComponent} for rendering the language selection dropdown.
 * It uses the {@link SearchBoxContainerComponent} for rendering the search box.
 * It uses the {@link HeaderNavigationContainerComponent} for rendering the pages main navigation.
 * It uses the {@link MiniBasketContainerComponent} for rendering mini basket on desktop sized viewports.
 *
 * @example
 * <camfil-header></camfil-header>
 */
@Component({
  selector: 'camfil-header-default',
  templateUrl: './camfil-header-default.component.html',
  styleUrls: ['./camfil-header-default.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilHeaderDefaultComponent implements OnChanges {
  @Input() isSticky = false;
  @Input() deviceType: DeviceType;
  @Input() reset: void;

  activeComponent: CollapsibleComponent = undefined;
  nextOpenLevelOnMobileNav: NextOpenLevelOnMobileNavType = '';

  ngOnChanges() {
    this.activeComponent = 'search';
    this.toggleSpecialStatusOfSearch();
  }

  get showSearch() {
    return (this.deviceType === 'mobile' && this.activeComponent !== 'navbar') || this.activeComponent === 'search';
  }

  get showNavBar() {
    return (
      // always show for desktop and tablet
      this.deviceType === 'desktop' ||
      this.deviceType === 'tablet' ||
      // always show for mobile on top
      (this.deviceType === 'mobile' && this.activeComponent === 'navbar')
    );
  }

  get showDesktopLogoLink() {
    return this.deviceType === 'tablet' || this.deviceType === 'desktop';
  }

  get showMobileLogoLink() {
    return this.deviceType === 'mobile';
  }

  private toggleSpecialStatusOfSearch() {
    // deactivate search when switching to sticky header
    if (this.isSticky && this.activeComponent === 'search') {
      this.activeComponent = undefined;
    }
    // activate search when scrolling to top and no other is active
    if (!this.isSticky && !this.activeComponent) {
      this.activeComponent = 'search';
    }
  }

  toggle(component: CollapsibleComponent) {
    this.activeComponent = this.activeComponent === component ? 'search' : component;
  }

  isClosedNav(value: NextOpenLevelOnMobileNavType) {
    this.nextOpenLevelOnMobileNav = value;
  }
}

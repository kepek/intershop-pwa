import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { NextOpenLevelOnMobileNavType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'camfil-header-navigation',
  templateUrl: './camfil-header-navigation.component.html',
  styleUrls: ['./camfil-header-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilHeaderNavigationComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  @Output() isClosedCat = new EventEmitter<NextOpenLevelOnMobileNavType>();

  categories$: Observable<NavigationCategory[]>;

  openedCategories = [];

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.categories$ = this.shoppingFacade.navigationCategories$();
  }

  /**
   * Handle sub menu show.
   * Adds hover class to rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }

  /**
   * Handle sub menu hide.
   * Removes hover class from rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }

  /**
   * Indicate if specific category is expanded.
   * @param category The category item.
   */
  isOpened(uniqueId: string): boolean {
    return this.openedCategories.includes(uniqueId);
  }

  /**
   * Toggle category open state.
   * @param category The category item.
   */
  toggleOpen(uniqueId: string) {
    const index = this.openedCategories.findIndex(id => id === uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(uniqueId);

    const opened: NextOpenLevelOnMobileNavType = this.isOpened(uniqueId) ? 'category' : '';
    this.isClosedCat.emit(opened);
  }

  isOpenCat(uniqueId: string) {
    return !this.openedCategories.length || this.isOpened(uniqueId);
  }
}

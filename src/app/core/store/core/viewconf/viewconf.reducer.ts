import { createReducer, on } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CheckoutFocusedElement } from 'ish-core/models/scroll-info copy/checkout-focused-element.interface';
import { ScrollInfo } from 'ish-core/models/scroll-info/scroll-info.interface';

import { setBreadcrumbData, setCheckoutFocusedElement, setScroll, setStickyHeader } from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
  scroll: ScrollInfo;
  focusedCheckoutElement: CheckoutFocusedElement;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
  scroll: {
    position: 0,
    isDown: false,
  },
  focusedCheckoutElement: {},
};

export const viewconfReducer = createReducer(
  initialState,
  on(setBreadcrumbData, (state: ViewconfState, action) => ({
    ...state,
    breadcrumbData: action.payload.breadcrumbData,
  })),
  on(setStickyHeader, (state: ViewconfState, action) => ({
    ...state,
    stickyHeader: action.payload.sticky,
  })),
  on(setScroll, (state: ViewconfState, action) => ({
    ...state,
    scroll: { position: action.payload.position, isDown: action.payload.isDown },
  })),
  on(setCheckoutFocusedElement, (state: ViewconfState, action) => ({
    ...state,
    focusedCheckoutElement: {
      elementId: action.payload.elementId,
    },
  }))
);

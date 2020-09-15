import { createReducer, on } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { ScrollInfo } from 'ish-core/models/scroll-info/scroll-info.interface';

import { setBreadcrumbData, setScroll, setStickyHeader } from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
  scroll: ScrollInfo;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
  scroll: {
    position: 0,
    isDown: false,
  },
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
  }))
);

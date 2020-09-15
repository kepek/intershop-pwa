import { ViewType as CamfilViewType } from 'camfil-models/viewtype/viewtype.types';

export type ViewType = 'grid' | 'list' | CamfilViewType;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type NextOpenLevelOnMobileNavType = 'category' | 'userLinks' | '';

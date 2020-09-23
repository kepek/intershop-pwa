import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { CamCardHeader } from './cam-card.model';

export interface CamCardData extends CamCardHeader {
  items?: { attributes: Attribute[] }[];
  itemsCount?: number;
  name?: string;
  uri?: string;
  creationDate?: Date;
}

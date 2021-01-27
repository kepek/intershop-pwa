import { Image } from 'ish-core/models/image/image.model';

export interface ProductTechnicalDocument extends Pick<Image, 'name' | 'effectiveUrl'> {}

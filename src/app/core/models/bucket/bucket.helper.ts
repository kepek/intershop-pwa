import { EMPTY_BUCKET_PREFIX } from 'camfil-pwa/store/ish-customer/ish-basket/ish-basket.effects';

import { Bucket } from './bucket.model';

export class BucketHelper {
  static isEmptyBucket(bucket: Bucket): boolean {
    return bucket.id.split('_')[0] === EMPTY_BUCKET_PREFIX;
  }
}

import { EMPTY_BUCKET_PREFIX } from 'ish-core/store/customer/basket/basket-items.effects';

import { Bucket } from './bucket.model';

export class BucketHelper {
  static isEmptyBucket(bucket: Bucket): boolean {
    return bucket.id.split('_')[0] === EMPTY_BUCKET_PREFIX;
  }
}

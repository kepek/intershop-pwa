import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => ({
      ...bucketData,
      deliveryAddressId: bucketData.shipToAddress ? included.shipToAddress[bucketData.shipToAddress].id : '',
    }));
  }
}

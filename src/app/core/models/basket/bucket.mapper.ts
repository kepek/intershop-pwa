import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => ({
      id: bucketData.id,
      basket: bucketData.basket,
      lineItems: bucketData.lineItems,
      deliveryAddressId: bucketData.shipToAddress ? included.shipToAddress[bucketData.shipToAddress].id : '',
    }));
  }
}

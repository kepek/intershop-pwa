import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets, lineItems: any): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => ({
      ...bucketData,
      id: bucketData.id,
      basket: bucketData.basket,
      lineItems: bucketData.lineItems
        .map(id => lineItems.find(element => element.id === id))
        .filter(element => !!element),
      deliveryAddressId: bucketData.shipToAddress ? included.shipToAddress[bucketData.shipToAddress].id : '',
      transient: false,
    }));
  }
}

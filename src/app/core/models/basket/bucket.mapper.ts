import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets, lineItems: any): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => ({
      ...bucketData,
      id: bucketData.id,
      basket: bucketData.basket,
      lineItems: bucketData.lineItems.map(id => lineItems.filter(element => element.id === id)[0]),
      deliveryAddressId: bucketData.shipToAddress ? included.shipToAddress[bucketData.shipToAddress].id : '',
    }));
  }
}

import { take } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';

import { CamCardsFacade } from '../../facades/cam-cards.facade';

import { CamCamProductChecked, CamCard, CamCardContact } from './cam-card.model';

export type MaintenanceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'READ_ONLY';

export class CamCardHelper {
  static maintenance(camCard: CamCard, arr: MaintenanceStatus[]) {
    return arr.includes(camCard.maintenanceStatus);
  }

  static getRealCamCards(camCards: CamCard[]) {
    return camCards.filter(camCard => !camCard.transient);
  }

  static getCamCardItemsId(camCard: CamCard) {
    const itemsId = camCard.camCardItems.map(item => item.id);
    camCard.subCamCards.forEach(sub => {
      sub.camCardItems.forEach(item => {
        itemsId.push(item.id);
      });
    });
    return itemsId;
  }

  static addToCartFromCamCard(
    val: CamCamProductChecked,
    camCards: CamCard[],
    buckets: Bucket[],
    camCardsFacade: CamCardsFacade,
    productFacade: ShoppingFacade,
    commonShippingMethodId: string,
    basketId: string,
    basketAddresses: Address[]
  ) {
    const idcc = val.camCardRoot || val.camCardId;
    const camCard = camCards.find(cc => cc.id === idcc);
    const bucket = buckets?.find(b => b.createdFromCamCardId === idcc);
    const address = AddressMapper.fromCamCard(camCard);
    const customerId = camCard.customer.id;
    let contactPerson: CamCardContact;
    camCardsFacade
      .getUserContactForCustomer$(customerId)
      .pipe(take(1))
      .subscribe(contact => {
        contactPerson = contact;
      });

    const extensions = bucket
      ? {}
      : {
          customer: camCard.customer,
          contactPerson,
          orderMark: camCard.orderLabel,
          invoiceLabel: camCard.invoiceLabel,
          createdFromCamCardId: idcc,
        };

    const lineItemAttribute: Attribute = val.boxLabel && { name: 'boxLabel', type: 'String', value: val.boxLabel };

    if (AddressHelper.isNewAddress(address, basketAddresses)) {
      productFacade.addProductToBucket(
        address,
        commonShippingMethodId,
        val.sku,
        val.quantity,
        basketId,
        extensions,
        lineItemAttribute
      );
    } else {
      productFacade.addProductToBucketWithUrn(
        AddressHelper.getUrn(address, basketAddresses),
        commonShippingMethodId,
        AddressHelper.getId(address, basketAddresses),
        val.sku,
        val.quantity,
        basketId,
        extensions,
        lineItemAttribute
      );
    }
  }
}

import { take } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardsFacade } from '../../facades/cam-cards.facade';

import { CamCamProductsAddToCart, CamCard, CamCardContact, CamCardItem } from './cam-card.model';

export type MaintenanceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'READ_ONLY';

export class CamCardHelper {
  static maintenance(camCard: CamCard, arr: MaintenanceStatus[]) {
    return arr.includes(camCard.maintenanceStatus);
  }

  static getRealCamCards(camCards: CamCard[]) {
    return camCards?.filter(camCard => !camCard.transient);
  }

  static getItems(items: CamCardItem[], onlyAvailable: boolean) {
    return items?.filter(item => !onlyAvailable || (onlyAvailable && item.product.available)) || [];
  }

  static getInvalidItems(items: CamCardItem[]) {
    return items?.filter(item => !item.product.available) || [];
  }

  static getCamCardItemsIds(camCard: CamCard, onlyAvailable = false) {
    return camCard.subCamCards
      ?.reduce(
        (acc, { camCardItems }) => [...acc, ...CamCardHelper.getItems(camCardItems, onlyAvailable)],
        CamCardHelper.getItems(camCard.camCardItems, onlyAvailable)
      )
      .map(({ id }) => id);
  }

  static getCamCardSkus(camCard: CamCard): string[] {
    if (!camCard) {
      return [];
    }

    return (
      [
        ...camCard.camCardItems?.map(({ product }) => product.sku),
        ...camCard.subCamCards?.reduce(
          (acc, { camCardItems }) => [...acc, ...camCardItems.map(({ product }) => product.sku)],
          [] as string[]
        ),
      ]
        // remove duplicate skus
        .filter((it, i, arr) => arr.findIndex(el => el === it) === i)
    );
  }

  static addToCartFromCamCards(
    camCardsFacade: CamCardsFacade,
    productFacade: ShoppingFacade,
    list: CamCamProductsAddToCart,
    camCards: CamCard[],
    commonShippingMethodId: string,
    basketId: string
  ) {
    const getActions = currentBasketId => {
      camCards.forEach(cc => {
        let productsToAdd = list[cc.id];
        if (productsToAdd) {
          const address = AddressMapper.fromCamCard(cc);
          const customerId = cc.customer.id;
          camCardsFacade
            .getUserContactForCustomer$(customerId)
            .pipe(take(1))
            .subscribe((contactPerson: CamCardContact) => {
              // TODO: what if !contactPerson
              /* The `contactPerson` variable is always fulfilled since it is triggered in CamCard effects -> loadCustomers$ */

              productsToAdd = {
                ...productsToAdd,
                extensions: {
                  customer: cc.customer,
                  contactPerson,
                  orderMark: cc.orderLabel || cc.name,
                  invoiceLabel: cc.invoiceLabel,
                  createdFromCamCardId: cc.id,
                },
                address,
              };

              if (!productsToAdd.allProductsSelected) {
                delete productsToAdd.extensions.createdFromCamCardId;
              }

              productFacade.addProductsFromCamCard(productsToAdd, commonShippingMethodId, currentBasketId, cc.name);
            });
        }
      });
    };

    if (!basketId) {
      productFacade
        .createBasket$()
        .pipe(whenTruthy(), take(1))
        .subscribe((basket: BasketView) => {
          getActions(basket.id);
        });
    } else {
      getActions(basketId);
    }
  }

  static handleBoxLabelToOrderItem(camCard: CamCard, item: CamCardItem) {
    const isItemFromSub = camCard.rootCamCard || camCard.camCardItems.findIndex(el => el.id === item.id) === -1;
    const nameFromSub =
      camCard.subCamCards?.reduce(
        (name, sub) => (sub.camCardItems.find(el => el.id === item.id) ? sub.name : name),
        ''
      ) || '';

    const subName = isItemFromSub
      ? (camCard.rootCamCard ? camCard.name : nameFromSub) + (item.comment?.label ? ', ' : '')
      : '';
    return subName + (item.comment?.label || '');
  }

  static handleCamCardsToGetCustomerPrice(camCards: CamCard[]) {
    return camCards.reduce((list, item) => {
      const customerId = item.customer.id;
      if (list[customerId]) {
        list[customerId].push(...CamCardHelper.getCamCardSkus(item));
      }
      return {
        ...list,
        [customerId]: list[customerId]
          ? list[customerId].filter((it, i, arr) => arr.findIndex(el => el === it) === i)
          : CamCardHelper.getCamCardSkus(item),
      };
    }, {});
  }
}

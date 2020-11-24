import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError } from 'rxjs';
import { concatMap, defaultIfEmpty, map, switchMap } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { CamCardCreate } from '../../models/cam-card/cam-card-create.interface';
import { CamCardData } from '../../models/cam-card/cam-card.interface';
import { CamCardMapper } from '../../models/cam-card/cam-card.mapper';
import {
  CamCard,
  CamCardAddress,
  CamCardContact,
  CamCardCustomerData,
  CamCardItem,
} from '../../models/cam-card/cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardService {
  constructor(private apiService: ApiService, private camCardMapper: CamCardMapper) {}

  /**
   * Gets a list of cam cards for the current user.
   * @returns           The customer's cam_cards.
   */
  getCamCards(): Observable<CamCard[]> {
    return this.apiService.get('camcards').pipe(
      unpackEnvelope(),
      map((camCards: CamCardData[]) => camCards.map(camCard => this.camCardMapper.fromData(camCard))),
      defaultIfEmpty([])
    );
  }

  /**
   * Gets a cam cards of the given id for the current user.
   * @param camCardId  The cam cards id.
   * @returns           The cam_cards.
   */
  getCamCard(camCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('getCamCard() called without camCardId');
    }
    return this.apiService
      .get<CamCardData>(`camcards/${camCardId}`)
      .pipe(map(camCardData => this.camCardMapper.fromData(camCardData)));
  }

  /**
   * Creates a cam cards for the current user.
   * @param camCardData
   * @returns                 The created cam_cards.
   */
  createCamCard(camCardData: CamCard): Observable<CamCard> {
    return this.apiService
      .post('camcards', camCardData)
      .pipe(concatMap((response: CamCardCreate) => this.getCamCard(response.itemId)));
  }

  /**
   * Creates a sub cam card
   * @param rootCamCardId     Parent for sub cam card
   * @param camCardData
   * @returns                 The created cam_card.
   */
  createSubCamCard(camCardData: CamCard, rootCamCardId: string): Observable<CamCard> {
    return this.apiService
      .post(`camcards/${rootCamCardId}/childcamcards`, camCardData)
      .pipe(concatMap((response: CamCardCreate) => this.getCamCard(response.itemId)));
  }

  /**
   * Deletes a cam cards of the given id.
   * @param camCardId   The cam cards id.
   * @returns           The cam_card.
   */
  deleteCamCard(camCardId: string): Observable<void> {
    if (!camCardId) {
      return throwError('deleteCamCard() called without camCardId');
    }
    return this.apiService.delete(`camcards/${camCardId}`);
  }

  /**
   * Updates a cam cards of the given id.
   * @param camCard
   * @returns          The updated cam_card.
   */
  updateCamCard(camCard: CamCard): Observable<CamCard> {
    return this.apiService
      .put(`camcards/${camCard.id}`, camCard)
      .pipe(map((response: CamCard) => this.camCardMapper.fromUpdate(response, camCard.id)));
  }

  updateSubCamCard(sub: CamCard): Observable<CamCard> {
    return this.apiService
      .put(`camcards/${sub.rootCamCard}/childcamcards/${sub.id}`, sub)
      .pipe(concatMap(() => this.getCamCard(sub.rootCamCard)));
  }

  /**
   * Move a cam cards of the given id.
   * @param camCardId   The cam cards to be moved.
   * @param customerId  The new customer ID of cam card to be updated.
   * @returns           The moved cam_card.
   */
  moveCamCard(camCardId: string, customerId: string): Observable<CamCard> {
    const data = { id: customerId };
    return this.apiService.put(`camcards/${camCardId}/move`, data);
  }

  /**
   * Gets a sub cam cards list from cam card.
   * @returns           The sub cam_cards.
   * @param camCardId   The cam card id.
   */
  getSubCamCards(camCardId: string): Observable<CamCard[]> {
    return this.apiService.get(`camcards/${camCardId}/childcamcards`).pipe(
      unpackEnvelope(),
      map((subCamCards: CamCardData[]) => subCamCards.map(subCamCard => this.camCardMapper.fromData(subCamCard))),
      // tslint:disable-next-line:no-unnecessary-callback-wrapper
      switchMap(obsArray => forkJoin(obsArray)),
      defaultIfEmpty([])
    );
  }

  /**
   * Delete all sub cam cards from cam card.
   * @returns           The cam_card.
   * @param camCardId   The cam card id.
   */
  deleteAllSubCamCards(camCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeAllSubCamCards() called without camCardId');
    }
    return this.apiService
      .delete(`camcards/${camCardId}/childcamcards`)
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Deletes a sub cam card from cam card.
   * @returns             The cam_cards.
   * @param camCardId     The cam card id.
   * @param subCamCardId  The sub cam card id.
   */
  deleteSubCamCard(camCardId: string, subCamCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeSubCamCard() called without camCardId');
    }
    return this.apiService
      .delete(`camcards/${camCardId}/childcamcards/${subCamCardId}`)
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Gets a cam card products of the given id.
   * @returns           The cam_card items.
   * @param camCardId  The cam card id.
   */
  getProductsFromCamCard(camCardId: string): Observable<CamCardItem[]> {
    if (!camCardId) {
      return throwError('getCamCardProduct() called without camCardId');
    }
    return this.apiService.get<CamCardItem[]>(`camcards/${camCardId}/products`);
  }

  /**
   * Gets a cam card product of the given id.
   * @returns           The cam_card item.
   * @param camCardId  The cam card id.
   * @param camCardItemId  The cam card item id.
   */
  getCamCardProduct(camCardId: string, camCardItemId: string): Observable<CamCardItem> {
    if (!camCardId) {
      return throwError('getCamCardProduct() called without camCardId');
    }
    if (!camCardItemId) {
      return throwError('getCamCardProduct() called without camCardItemId');
    }
    return this.apiService.get<CamCardItem>(`camcards/${camCardId}/products/${camCardItemId}`);
  }

  /**
   * Get customers available for current user.
   * @returns                 The created cam_cards.
   */
  getCustomers(): Observable<CamCardCustomerData[]> {
    return this.apiService.get('camfilcustomers').pipe(unpackEnvelope(), defaultIfEmpty([]));
  }

  /**
   * Update a contacts from the cam card..
   * @param camCardId   The cam card ID.
   * @param camCardContacts   The new contacts for cam card.
   * @returns                 The updated contacts on cam_card.
   */
  updateCamCardContacts(camCardId: string, camCardContacts: CamCardContact[]): Observable<CamCardContact[]> {
    const contacts = { elements: camCardContacts };
    return this.apiService.put(`privatecamcards/${camCardId}/contacts`, contacts);
  }

  /**
   * Get customer contacts.
   * @param customerId   The customer ID.
   * @returns            The all customer contacts.
   */
  getContactsByCustomerId(customerId: string): Observable<CamCardContact[]> {
    return this.apiService
      .get(`privatecamfilcustomers/${customerId}/contacts`)
      .pipe(unpackEnvelope(), defaultIfEmpty([]));
  }

  /**
   * Get customers available for current user.
   * @param customerId   The customer ID.
   * @returns            The created cam_cards.
   */
  getDeliveryAddresses(customerId: string): Observable<CamCardAddress[]> {
    return this.apiService
      .get(`camfilcustomers/${customerId}/deliveryaddresses`)
      .pipe(unpackEnvelope(), defaultIfEmpty([]));
  }

  /**
   * Get customers available for current user.
   * @returns             The created cam_cards.
   * @deprecated
   */
  // TODO: verify if needed / deprecated
  createDeliveryAddress(): Observable<void> {
    return this.apiService.get('camfilcustomers');
  }

  /**
   * Get customers available for current user.
   * @returns             The created cam_cards.
   * @deprecated
   */
  // TODO: verify if needed / deprecated
  updateDeliveryAddress(): Observable<void> {
    return this.apiService.get('camfilcustomers');
  }

  /**
   * Adds a product to the cam cards with the given id and reloads the cam_cards.
   * @param camCardId
   * @param sku           The product sku.
   * @param quantity      The products quantity
   * @param boxLabel      Comment label
   * @returns             The changed cam_cards.
   */
  addProductToCamCard(
    camCardId: string,
    sku: string,
    quantity: number,
    boxLabel?: string,
    position?: number
  ): Observable<CamCard> {
    return this.apiService
      .post(`camcards/${camCardId}/products`, {
        quantity,
        position,
        product: { sku },
        comment: {
          label: boxLabel,
        },
      })
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Update a product from the cam card with the given id. Returns an error observable if parameters are falsy.
   * @returns             The changed cam card item.
   * @param camCardId
   * @param camCardItem
   */
  updateCamCardProduct(camCardId: string, camCardItem: CamCardItem): Observable<CamCardItem> {
    return this.apiService.put(`camcards/${camCardId}/products/${camCardItem.id}`, camCardItem);
  }

  /**
   * Reset the positions of its directly assigned line items of this camcard
   * @returns             The changed cam card item.
   * @param camCardId
   * @param gapSize
   */
  resetItemPositions(rootCamCardId: string, camCardId: string, gapSize: number): Observable<CamCardItem[]> {
    if (!camCardId) {
      return throwError('resetItemPositions() called without camCardId');
    }
    if (!gapSize) {
      return throwError('resetItemPositions() called without gapSize');
    }

    const data = { gapSize };
    if (!rootCamCardId) {
      return this.apiService.put(`camcards/${camCardId}/products`, data).pipe(unpackEnvelope());
    } else {
      return this.apiService
        .put(`camcards/${rootCamCardId}/childcamcards/${camCardId}/products`, data)
        .pipe(unpackEnvelope());
    }
  }

  /**
   * Removes a product from the cam cards with the given id. Returns an error observable if parameters are falsy.
   * @returns             The changed cam_cards.
   * @param camCardId
   * @param camCardItemId
   */
  removeProductFromCamCard(camCardId: string, camCardItemId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeProductFromCamCard() called without camCardId');
    }
    if (!camCardItemId) {
      return throwError('removeProductFromCamCard() called without camCard Item Id');
    }
    return this.apiService
      .delete(`camcards/${camCardId}/products/${camCardItemId}`)
      .pipe(concatMap(() => this.getCamCard(camCardId)));
  }

  /**
   * Removes all products from the cam cards with the given id. Returns an error observable if parameters are falsy.
   * @returns             The changed cam_cards.
   * @param camCardId
   */
  removeAllProductsFromCamCard(camCardId: string): Observable<CamCard> {
    if (!camCardId) {
      return throwError('removeAllProductsFromCamCard() called without camCardId');
    }
    return this.apiService.delete(`camcards/${camCardId}/products`).pipe(concatMap(() => this.getCamCard(camCardId)));
  }
}

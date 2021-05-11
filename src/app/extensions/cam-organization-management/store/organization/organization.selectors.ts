// tslint:disable: ish-ordered-imports project-structure ban-specific-imports force-jsdoc-comments
import { createSelector } from '@ngrx/store';
import { getContacts } from '../contact';
import { getRoles } from '../role';
import { getCustomer } from '../customer';
import { getUser, getUsers } from '../user';

// Contacts

/**
 * Get Contact by Customer ID
 * @param customerId
 */
export const getContactsByCustomerId = (customerId: string) =>
  createSelector(getContacts, contacts => contacts.filter(({ customerIDs }) => customerIDs?.includes(customerId)));

/**
 * Get Contacts By User ID
 * @param userId
 */
export const getContactsByUserId = (userId: string) =>
  createSelector(getContacts, contacts => contacts.filter(({ userIDs }) => userIDs?.includes(userId)));

/**
 * Get Contact By Customer ID and User ID
 * @param customerId
 * @param userId
 */
export const getContactByCustomerIdAndUserId = (customerId: string, userId: string) =>
  createSelector(getContacts, contacts =>
    contacts?.find(({ customerIDs, userIDs }) => customerIDs?.includes(customerId) && userIDs?.includes(userId))
  );

// Roles

/**
 * Get Roles by Customer ID
 * @param customerId
 */
export const getRolesByCustomerId = (customerId: string) =>
  createSelector(getRoles, getCustomer(customerId), (roles, customer) =>
    roles.filter(({ id }) => customer?.roleIDs?.includes(id))
  );

/**
 * Get Roles by User ID
 * @param userId
 */
export const getRolesByUserId = (userId: string) =>
  createSelector(getRoles, getUser(userId), (roles, user) => roles.filter(({ id }) => user?.roleIDs?.includes(id)));

// Users

/**
 * Get Users by Customer ID
 * @param customerId
 */
export const getUsersByCustomerId = (customerId: string) =>
  createSelector(getUsers, entities => entities.filter(e => e.customerId === customerId));

/**
 * Get User By Customer ID
 * @param customerId
 * @param userId
 */
export const getUserByCustomerId = (customerId: string, userId: string) =>
  createSelector(getUsers, entities => entities.find(e => e.customerId === customerId && e.id === userId));

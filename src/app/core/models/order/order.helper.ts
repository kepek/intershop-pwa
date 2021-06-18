export class OrderHelper {
  static getOrderStatusText(orderStatus: string) {
    return orderStatus
      ? `camfil.dynamic.account.orderlist.status.${orderStatus.trim().replace(' ', '_').toLowerCase()}`
      : '---';
  }
}

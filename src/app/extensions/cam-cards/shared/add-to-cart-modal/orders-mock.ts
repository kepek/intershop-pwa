export interface OrderMock {
  id: string;
  name: string;
  nextDelivery?: string;
  orderMark?: string;
  segments?: OrderMock[];
}

export const ORDERS_MOCK_DATA = [
  {
    id: 'o0',
    name: 'Order 1',
    nextDelivery: '2021-01-01',
    orderMark: 'aaabbbcccddd',
    segments: [
      {
        id: 's0',
        name: 'Building 1',
      },
      {
        id: 's1',
        name: 'Building 2',
      },
    ],
  },
  {
    id: 'o1',
    name: 'Order 2',
    nextDelivery: '2021-01-01',
    orderMark: 'aaabbbcccddd',
    segments: [
      {
        id: 's2',
        name: 'Building 1',
      },
      {
        id: 's3',
        name: 'Building 2',
      },
    ],
  },
];

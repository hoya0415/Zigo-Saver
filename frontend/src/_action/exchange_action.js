import axios from 'axios';
import {
  EXCHANGE_POINT_TO_CASH,
  EXCHANGE_CASH_TO_POINT,
  EXCHANGE_POINT_TO_SEED,
} from './types';

const EXCHANGE_URL = 'http://k6d202.p.ssafy.io:5000/exchanges';

export function exchangePointToCash(access, price, bank, account_num, holder) {
  const request = axios
    .post(
      `${EXCHANGE_URL}/refunds/`,
      { price: price, bank: bank, account_num: account_num, holder: holder },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: EXCHANGE_POINT_TO_CASH,
    payload: request,
  };
}
export function exchangeCashToPoint(access, price) {
  const request = axios
    .post(
      `${EXCHANGE_URL}/charge/`,
      { price: price},
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: EXCHANGE_CASH_TO_POINT,
    payload: request,
  };
}
export function exchangePointToSeed(access, cnt) {
  const request = axios
    .post(
      `${EXCHANGE_URL}/charge/seed/`,
      { cnt:cnt },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      } 
    )
    .then((res) => res.data);
  return {
    type: EXCHANGE_POINT_TO_SEED,
    payload: request,
  };
}

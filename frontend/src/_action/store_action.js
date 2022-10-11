import axios from 'axios';
import {
  GET_STORE_INFO,
  GET_ITEM_INFO,
  GET_SEARCH_ITEM,
  REGISTER_ITEM,
  BUY_ITEM,
  DELETE_ITEM,
  GET_ITEM_DETAIL,
} from './types';

const STORE_URL = 'http://k6d202.p.ssafy.io:5000/stores';

export function getStoreInfo(access) {
  const request = axios
    .get(`${STORE_URL}/album/list/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data);
  return {
    type: GET_STORE_INFO,
    payload: request,
  };
}

export function getItemInfo(albumId) {
  const request = axios
    .get(`${STORE_URL}/album/${albumId}/`)
    .then((res) => res.data);
  return {
    type: GET_ITEM_INFO,
    payload: request,
  };
}
export function getSearchItem(keyword) {
  const request = axios
    .get(`${STORE_URL}/album/search/${keyword}/`)
    .then((res) => res.data);
  return {
    type: GET_SEARCH_ITEM,
    payload: request,
  };
}
export function registerItem(access, album_id, is_opened, price, cnt, detail) {
  const request = axios
    .post(
      `${STORE_URL}/sales/`,
      {
        album_id: album_id,
        is_opened: is_opened,
        price: price,
        cnt: cnt,
        detail: detail,
      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: REGISTER_ITEM,
    payload: request,
  };
}
export function buyItem(access, item_id) {
  const request = axios
    .post(
      `${STORE_URL}/buy/${item_id}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: GET_STORE_INFO,
    payload: request,
  };
}

export function deleteItem(album_id) {
  const request = axios
    .delete(`${STORE_URL}/item/delete/${album_id}/`)
    .then((res) => res.data);
  return {
    type: DELETE_ITEM,
    payload: request,
  };
}

export function getItemDetail(item) {
  return {
    type: GET_ITEM_DETAIL,
    payload: item,
  };
}

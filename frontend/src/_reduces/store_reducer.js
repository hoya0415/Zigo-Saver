import {
  GET_STORE_INFO,
  GET_ITEM_INFO,
  GET_SEARCH_ITEM,
  REGISTER_ITEM,
  BUY_ITEM,
  DELETE_ITEM,
  GET_ITEM_DETAIL,
} from '../_action/types';

const initState = {};

export default function store(state = initState, action) {
  switch (action.type) {
    case GET_STORE_INFO:
      return {
        ...state,
        albumList: action.payload,
      };
    case GET_ITEM_INFO:
      return {
        ...state,
        sellingList: action.payload,
        priceList: action.payload.item,
      };
    case GET_SEARCH_ITEM:
      return {
        ...state,
        searchList: action.payload,
      };
    case GET_ITEM_DETAIL:
      return {
        ...state,
        itemPrice: action.payload.price,
        itemDetail: action.payload.detail,
        itemSeller: action.payload.seller,
        itemDate: action.payload.date,
        itemOpened: action.payload.opened,
        itemCnt: action.payload.cnt,
        itemId: action.payload.id,
      };

    case REGISTER_ITEM:
      return {
        ...state,
        priceList: action.payload,
      };
    default:
      return state;
  }
}

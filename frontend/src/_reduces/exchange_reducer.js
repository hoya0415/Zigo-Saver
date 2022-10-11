import {
    EXCHANGE_POINT_TO_CASH,
    EXCHANGE_CASH_TO_POINT,
    EXCHANGE_POINT_TO_SEED,
} from '../_action/types';

const initState = {};

export default function exchange(state = initState, action) {
  switch (action.type) {
    case EXCHANGE_POINT_TO_CASH:
      return {
        ...state,
        exchangeBank: action.payload.bank,
        exchangeAccountNum: action.payload.account_num,
        exchangeHolder: action.payload.holder,
    };
    default:
      return state;
  }
}

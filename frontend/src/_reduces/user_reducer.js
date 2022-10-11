import {
  LOGIN_USER,
  SIGNUP_USER,
  LOGOUT_USER,
  DELETE_USER,
  GET_USER_INFO,
  PLANT_SEED,
  GET_ALARM,
  GET_BUY_LIST,
  GET_SELL_LIST,
  GET_SEED_LIST,
  GET_SELL_DETAIL,
  EXCHANGE_POINT_TO_CASH,
  EXCHANGE_CASH_TO_POINT,
  EXCHANGE_POINT_TO_SEED,
  GET_HISTORY_DETAIL
} from '../_action/types';

const initState = {};

export default function user(state = initState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        access: action.payload.access,
      };
    case GET_USER_INFO:
      return {
        ...state,
        userId: action.payload.id,
        userAddress: action.payload.address,
        userCharacter: action.payload.character,
        userLevel: action.payload.level,
        userName: action.payload.name,
        userNickname: action.payload.nickname,
        userPhone: action.payload.phonenum,
        userPoint: action.payload.point,
        userSeed: action.payload.user_seed,
        userMessage: action.payload.message,
      };
    case GET_ALARM:
      return {
        ...state,
        alarmList: action.payload,
      };
    case LOGOUT_USER:
      return initState;
    case DELETE_USER:
      return initState;
    case SIGNUP_USER:
      return { ...state, signupMsg: action.payload.message };
    case PLANT_SEED:
      return {
        ...state,
        userSeed: action.payload.user.user_seed,
      };
    case GET_BUY_LIST:
      return {
        ...state,
        buyList: action.payload
      };
    case GET_SELL_LIST:
      return {
        ...state,
        sellList: action.payload
      };
    case GET_SEED_LIST:
      return {
        ...state,
        seedList: action.payload
      };
    case GET_SELL_DETAIL:
      return {
        ...state,
        sellDetail: action.payload
      };
    case EXCHANGE_POINT_TO_CASH:
      return {
        ...state,
        userPoint: action.payload.user.point,
      };
    case EXCHANGE_CASH_TO_POINT:
      return {
        ...state,
        userPoint: action.payload.point,
      };
    case EXCHANGE_POINT_TO_SEED:
      return {
        ...state,
        userPoint: action.payload.point,
        userSeed: action.payload.user_seed,
      };
    case   GET_HISTORY_DETAIL:
      return {
        ...state,
        historyDetail: action.payload,
      };
    default:
      return state;
  }
}

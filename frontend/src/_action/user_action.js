import axios from 'axios';
import {
  LOGIN_USER,
  SIGNUP_USER,
  LOGOUT_USER,
  DELETE_USER,
  GET_USER_INFO,
  GET_ALARM,
  GET_BUY_LIST,
  GET_SELL_LIST,
  GET_SEED_LIST,
  GET_SELL_DETAIL,
  GET_HISTORY_DETAIL,
} from './types';

const USER_URL = 'http://k6d202.p.ssafy.io:5000/accounts';

export function loginUser(inputId, inputPassword) {
  const request = axios
    .post(`${USER_URL}/login/`, { username: inputId, password: inputPassword })
    .then((res) => res.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function getUserInfo(access) {
  const request = axios
    .get(`${USER_URL}/info/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data);
  return {
    type: GET_USER_INFO,
    payload: request,
  };
}
export function getAlarm(access) {
  const request = axios
    .get(`${USER_URL}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data);
  return {
    type: GET_ALARM,
    payload: request,
  };
}

export function signupUser(
  inputId,
  inputPassword,
  inputPasswordConfirm,
  inputNickname,
  inputCharacter
) {
  const request = axios
    .post(`${USER_URL}/signup/`, {
      username: inputId,
      nickname: inputNickname,
      character: inputCharacter,
      password: inputPassword,
      password2: inputPasswordConfirm,
    })
    .then((res) => res.data);
  return {
    type: SIGNUP_USER,
    payload: request,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function deleteUser(access) {
  const request = axios
    .delete(`${USER_URL}/delete/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: DELETE_USER,
    payload: request,
  };
}

export function getBuyList(access, type_pk) {
  const request = axios
    .get(`${USER_URL}/history/buy/${type_pk}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_BUY_LIST,
    payload: request,
  };
}

export function getSellList(access, type_pk) {
  const request = axios
    .get(`${USER_URL}/history/sales/${type_pk}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_SELL_LIST,
    payload: request,
  };
}

export function getSellDetail(access, item_pk) {
  const request = axios
    .get(`${USER_URL}/detail/sales/${item_pk}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_SELL_DETAIL,
    payload: request,
  };
}

export function getHistoryDetail(access, history_pk) {
  const request = axios
    .get(`${USER_URL}/history/detail/${history_pk}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_HISTORY_DETAIL,
    payload: request,
  };
}

export function getSeedList(access) {
  const request = axios
    .get(`${USER_URL}/history/seed/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_SEED_LIST,
    payload: request,
  };
}

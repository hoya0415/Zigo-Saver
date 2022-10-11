import axios from 'axios';
import { GET_FOREST_INFO, GET_FOREST_LIST, GET_TOPLIST, PLANT_SEED } from './types';

const FOREST_URL = 'http://k6d202.p.ssafy.io:5000/forest';

export function getForestInfo(forestId) {
  const request = axios
    .get(`${FOREST_URL}/${forestId}/`)
    .then((res) => res.data);
  return {
    type: GET_FOREST_INFO,
    payload: request,
  };
}
export function getForestList() {
  const request = axios
    .get(`${FOREST_URL}/`)
    .then((res) => res.data);
  return {
    type: GET_FOREST_LIST,
    payload: request,
  };
}
export function plantSeed(access, forestId, seedCnt) {
  const request = axios
    .post(
      `${FOREST_URL}/${forestId}/`,
      { seed_cnt: seedCnt },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: PLANT_SEED,
    payload: request,
  };
}
export function getToplist(forestId) {
  const request = axios
    .get(`${FOREST_URL}/${forestId}/rank/`)
    .then((res) => res.data);
  return {
    type: GET_TOPLIST,
    payload: request,
  };
}
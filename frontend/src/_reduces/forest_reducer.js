import { GET_FOREST_INFO, GET_FOREST_LIST, GET_TOPLIST, PLANT_SEED } from '../_action/types';

const initState = {};

export default function forest(state = initState, action) {
  switch (action.type) {
    case GET_FOREST_INFO:
      return {
        ...state,
        forestId: action.payload.id,
        forestSinger: action.payload.singer,
        forestSeed: action.payload.total_seed,
        forestTree: action.payload.total_tree,
      };
    case GET_FOREST_LIST:
      return {
        ...state,
        forestList: action.payload,
      };
    case PLANT_SEED:
      return {
        ...state,
        forestId: action.payload.forest.id,
        forestSinger: action.payload.forest.singer,
        forestSeed: action.payload.forest.total_seed,
        forestTree: action.payload.forest.total_tree,
      };
    case GET_TOPLIST:
      return {
        ...state,
        forestToplist : action.payload
      };
    default:
      return state;
  }
}

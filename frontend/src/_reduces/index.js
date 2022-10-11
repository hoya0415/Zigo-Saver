import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import user from './user_reducer';
import forest from './forest_reducer';
import store from './store_reducer';
import exchange from './exchange_reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user, forest, store, exchange
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;

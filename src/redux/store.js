import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { persistStore, persistReducer } from 'redux-persist'

import rootSaga from 'Sagas';
import rootReducer from 'Reducers';

const persistConfig = {
  key: 'root',
  storage,
}

let sagaMiddleware = createSagaMiddleware();
let persistedReducer = persistReducer(persistConfig, rootReducer);
let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
let persistor = persistStore(store);
sagaMiddleware.run(rootSaga);
  
export { store, persistor }


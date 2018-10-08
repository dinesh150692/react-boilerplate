import { all, fork } from 'redux-saga/effects';

import counterSaga from 'Sagas/counterSagas';

/**
 * rootSaga
 */
export default function* root() {
  yield all([
    fork(counterSaga),
  ]);
}

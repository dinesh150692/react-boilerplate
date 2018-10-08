import { all, put, takeLatest } from 'redux-saga/effects';
import { ACTION_TYPE } from 'ActionType';

/**
 * Update Counter Action
 */
export function* updateCounter({payload}) {
    yield put({type: ACTION_TYPE.UPDATE_PAGE_COUNTER, payload});
}

/**
 * Counter Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ACTION_TYPE.PAGE_COUNTER, updateCounter),
  ]);
}
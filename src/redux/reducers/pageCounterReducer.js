import { ACTION_TYPE } from 'ActionType';

let initialState = 0;

export default function devicePrintReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_PAGE_COUNTER:
            return Number(action.payload) + 1;
        default:
            return state;
    }
  }
  
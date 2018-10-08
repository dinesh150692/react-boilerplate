import { ACTION_TYPE } from 'ActionType';


export const updateCounter = (payload) => ({
  type: ACTION_TYPE.PAGE_COUNTER,
  payload
});


/* Library Imports */
import { combineReducers } from 'redux';

/* Custom Reducer Imports */
import pageCounterReducer from 'Reducers/pageCounterReducer';

export default combineReducers({
    counter: pageCounterReducer
});
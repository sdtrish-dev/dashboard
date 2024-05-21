// reducers.js
import {
  FETCH_WIDGET_DATA_START,
  FETCH_WIDGET_DATA_SUCCESS,
  FETCH_WIDGET_DATA_FAILURE,
} from './actions';

const initialState = {
  widgetData: null,
  loading: false,
  error: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_WIDGET_DATA_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_WIDGET_DATA_SUCCESS:
      return {
        ...state,
        widgetData: action.payload,
        loading: false,
      };
    case FETCH_WIDGET_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export default rootReducer;

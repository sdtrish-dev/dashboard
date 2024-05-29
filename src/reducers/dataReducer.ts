import { Action } from 'redux';
import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  DataState,
  FetchDataRequestAction,
  FetchDataSuccessAction,
  FetchDataFailureAction
} from '../types';

const initialState: DataState = {
  data: null,
  isLoading: false,
  error: null,
};

const dataReducer = (state = initialState, action: Action): DataState => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return { ...state, isLoading: true };
    case FETCH_DATA_SUCCESS:
      const successAction = action as FetchDataSuccessAction;
      return { ...state, isLoading: false, data: successAction.payload };
    case FETCH_DATA_FAILURE:
      const failureAction = action as FetchDataFailureAction;
      return { ...state, isLoading: false, error: failureAction.error };
    default:
      return state;
  }
};

export default dataReducer;
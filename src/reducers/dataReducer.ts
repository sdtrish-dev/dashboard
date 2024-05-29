// src/reducers/dataReducer.ts
import { DataState, WidgetState } from '../types';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, DataActionTypes } from '../actions/dataActions';

const initialState: DataState = {};

const dataReducer = (state = initialState, action: DataActionTypes): DataState => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return {
        ...state,
        [action.payload.symbol]: { data: null, isLoading: true, error: null },
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        [action.payload.symbol]: { data: action.payload.data, isLoading: false, error: null },
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        [action.payload.symbol]: { data: null, isLoading: false, error: action.payload.error },
      };
    default:
      return state;
  }
};

export default dataReducer;

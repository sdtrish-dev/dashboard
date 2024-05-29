// src/actions/dataActions.ts
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { Action } from 'redux';

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

interface FetchDataRequestAction {
  type: typeof FETCH_DATA_REQUEST;
  payload: { symbol: string };
}

interface FetchDataSuccessAction {
  type: typeof FETCH_DATA_SUCCESS;
  payload: { symbol: string, data: any };
}

interface FetchDataFailureAction {
  type: typeof FETCH_DATA_FAILURE;
  payload: { symbol: string, error: string };
}

export type DataActionTypes = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction;

export const fetchData = (
  symbol: string,
  type: string,
  refreshRate: number
): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  dispatch({ type: FETCH_DATA_REQUEST, payload: { symbol } });

  try {
    const res = await fetch(`/api/financial-data?symbol=${symbol}&type=${type}&refreshRate=${refreshRate}`);
    const data = await res.json();

    if (data && data['Meta Data']) {
      dispatch({ type: FETCH_DATA_SUCCESS, payload: { symbol, data } });
    } else {
      dispatch({ type: FETCH_DATA_FAILURE, payload: { symbol, error: 'No data found' } });
    }
  } catch (err) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: { symbol, error: 'No data found' } });
  }
};

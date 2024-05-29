// types.ts
export interface DataState {
  data: any;
  isLoading: boolean;
  error: string | null;
}

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

export interface FetchDataRequestAction {
  type: typeof FETCH_DATA_REQUEST;
}

export interface FetchDataSuccessAction {
  type: typeof FETCH_DATA_SUCCESS;
  payload: any;
}

export interface FetchDataFailureAction {
  type: typeof FETCH_DATA_FAILURE;
  error: string;
}

export type DataAction =
  | FetchDataRequestAction
  | FetchDataSuccessAction
  | FetchDataFailureAction;

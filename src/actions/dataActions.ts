import { AppThunk } from '../store';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from '../types';

export const fetchData = (symbol: string, type: string, refreshRate: number): AppThunk => async dispatch => {
  dispatch({ type: FETCH_DATA_REQUEST });

  try {
    // Replace this with the actual API call
    const response = await fetch(`/api/financial-data?symbol=${symbol}&type=${type}&refreshRate=${refreshRate}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    dispatch({ type: FETCH_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, error: 'Error fetching data' });
  }
};
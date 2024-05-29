import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';

interface WidgetState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
}

interface DataState {
  [key: string]: WidgetState;
}

const initialState: DataState = {};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetchDataRequest(state, action: PayloadAction<{ symbol: string }>) {
      const { symbol } = action.payload;
      state[symbol] = { data: null, isLoading: true, error: null };
    },
    fetchDataSuccess(state, action: PayloadAction<{ symbol: string; data: any }>) {
      const { symbol, data } = action.payload;
      state[symbol] = { data, isLoading: false, error: null };
    },
    fetchDataFailure(state, action: PayloadAction<{ symbol: string; error: string }>) {
      const { symbol, error } = action.payload;
      state[symbol] = { data: null, isLoading: false, error };
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;

export default dataSlice.reducer;

export const fetchData = (symbol: string, type: string, refreshRate: number): AppThunk => async dispatch => {
  dispatch(fetchDataRequest({ symbol }));

  try {
    const res = await fetch(`/api/financial-data?symbol=${symbol}&type=${type}&refreshRate=${refreshRate}`);
    const data = await res.json();

    if (data && data['Meta Data']) {
      dispatch(fetchDataSuccess({ symbol, data }));
    } else {
      dispatch(fetchDataFailure({ symbol, error: 'No data found' }));
    }
  } catch (err) {
    dispatch(fetchDataFailure({ symbol, error: 'No data found' }));
  }
};

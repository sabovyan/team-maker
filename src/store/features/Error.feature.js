import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'error',
  initialState: null,
  reducers: {
    setError: (_state, { payload }) => payload,
  },
});

export default reducer;
export const { setError } = actions;

import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'activeStep',
  initialState: 0,
  reducers: {
    getNextStep: (state) => state + 1,
    getPrevStep: (state) => state - 1,
    reset: (state) => 0,
  },
});

export default reducer;
export const { getNextStep, getPrevStep, reset } = actions;

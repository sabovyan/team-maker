import { configureStore } from '@reduxjs/toolkit';

import reducer from './features';

const store = configureStore({ reducer });

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default store;

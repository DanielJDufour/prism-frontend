import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type AuthState = {
  name?: string;
};

const initialState: AuthState = {};

const authStateSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    setUserData: (rest, { payload }: PayloadAction<AuthState>) => {
      return payload;
    },
  },
});

export const { setUserData } = authStateSlice.actions;

export const usernameSelector = (state: RootState): string | undefined =>
  state.authState.name;

export default authStateSlice.reducer;

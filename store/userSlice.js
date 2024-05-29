import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setLogout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export default userSlice.reducer;
export const { setLogin, setLogout } = userSlice.actions;

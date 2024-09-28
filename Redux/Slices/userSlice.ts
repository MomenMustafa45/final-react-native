import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../components/Nav";
export interface UserState {
  user: UserType;
}

const initialState: UserState = {
  user: {
    id: "",
    firstName: "",
    lastName: "",
    // name: "",
    gender: "",
    email: "",
    age: 0,
    role: "",

    ////////////////////////
    photoURL: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...action.payload };
    },
    resetUser: (state) => {
      state.user = {
        id: "",
        firstName: "",
        lastName: "",
        // name: "",
        gender: "",
        email: "",
        age: 0,
        role: "",
        photoURL: "",
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;

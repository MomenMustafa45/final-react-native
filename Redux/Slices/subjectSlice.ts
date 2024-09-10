import { createSlice } from "@reduxjs/toolkit";
import { SubjectType } from "../../utils/types";
export interface subState {
  subject: SubjectType[];
}

const initialState: subState = {
  subject: [],
};

export const subSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    setSubject: (state, action) => {
      state.subject = [...action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSubject } = subSlice.actions;

export default subSlice.reducer;

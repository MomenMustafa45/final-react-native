import { createSlice } from "@reduxjs/toolkit";
export interface LevelsState {
  levels: { id: string; name: string }[];
}

const initialState: LevelsState = {
  levels: [],
};

export const levelsSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    setLevels: (state, action) => {
      state.levels = [...action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLevels } = levelsSlice.actions;

export default levelsSlice.reducer;

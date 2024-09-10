import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchParentKids } from '../../services/KidsService';

export const getKids = createAsyncThunk(
  'kids/getKids',
  async (parentId: string) => {
    const kids = await fetchParentKids(parentId);
    return kids;
  }
);

const kidsSlice = createSlice({
  name: 'kids',
  initialState: { kidsList: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKids.fulfilled, (state, action) => {
        state.kidsList = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getKids.pending, (state) => {
        state.status = 'loading';
      });
  }
});

export default kidsSlice.reducer;

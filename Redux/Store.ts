import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";

import gradesReducer from "./Slices/subjectSlice"

import levelsReducer from "./Slices/levelsSlice";
import subjectSlice from "./Slices/subjectSlice";

import kidsReducer from './Slices/KidsSlice'


export const Store = configureStore({
  reducer: {
    user: userReducer,

    grades :gradesReducer,

    levels: levelsReducer,
    subject:subjectSlice,
    kids:kidsReducer

  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;

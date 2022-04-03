import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playlistReducer from '../reducers/PlaylistReducer';
import queueReducer from '../reducers/queueReducer'
import userReducer from '../reducers/userReducer'
import searchReducer from '../reducers/searchReducer';
const store = configureStore({
  reducer: {
    user: userReducer,
    queue: queueReducer,
    playlist: playlistReducer,
    search: searchReducer
  }
})



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;
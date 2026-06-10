import { configureStore } from '@reduxjs/toolkit';
import recommendationReducer from '../features/recommendation/recommendationSlice';
import submissionsReducer from '../features/submissions/submissionsSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    recommendation: recommendationReducer,
    submissions: submissionsReducer,
    analytics: analyticsReducer,
    auth: authReducer,
  },
});
export default store;

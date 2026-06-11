import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/api/v1') 
      ? import.meta.env.VITE_API_URL 
      : `${import.meta.env.VITE_API_URL}/api/v1`)
    : 'http://localhost:8080/api/v1');

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to retrieve dashboard analytics.';
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState = {
  loading: false,
  totalSubmissions: 0,
  recommendationCounts: {},
  qualificationCounts: {},
  monthlySubmissions: [],
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSubmissions = action.payload.totalSubmissions || 0;
        state.recommendationCounts = action.payload.recommendationCounts || {};
        state.qualificationCounts = action.payload.qualificationCounts || {};
        state.monthlySubmissions = action.payload.monthlySubmissions || [];
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;

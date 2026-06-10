import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const submitProfile = createAsyncThunk(
  'recommendation/submitProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/recommendations`, profileData);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to process recommendation request.';
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState = {
  loading: false,
  currentRecommendation: null,
  error: null,
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    clearRecommendation: (state) => {
      state.currentRecommendation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecommendation = action.payload;
      })
      .addCase(submitProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecommendation } = recommendationSlice.actions;
export default recommendationSlice.reducer;

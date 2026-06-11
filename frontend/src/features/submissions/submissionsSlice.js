import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/api/v1') 
      ? import.meta.env.VITE_API_URL 
      : `${import.meta.env.VITE_API_URL}/api/v1`)
    : 'http://localhost:8080/api/v1');

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async ({ search = '', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/submissions`, {
        params: { search, page, size, sortBy, direction }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to retrieve submissions.';
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState = {
  loading: false,
  submissions: [],
  totalPages: 0,
  totalElements: 0,
  page: 0,
  size: 10,
  searchTerm: '',
  error: null,
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 0; // Reset page on new search
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.page = action.payload.number || 0;
        state.size = action.payload.size || 10;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setPage } = submissionsSlice.actions;
export default submissionsSlice.reducer;

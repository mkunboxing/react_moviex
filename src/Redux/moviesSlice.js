import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = '4afc60f757eb572f5b1db283d623b3a0';
const apiUrl = 'https://api.themoviedb.org/3/movie/';

export const fetchFilteredMovies = createAsyncThunk(
  'movies/fetchFilteredMovies',
  async ({ filter }) => {
    try {
      const response = await axios.get(`${apiUrl}${filter}`, {
        params: {
          api_key: apiKey,
          page: 1, // Always fetch the first page for new filter
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }
);

export const fetchMoreMovies = createAsyncThunk(
  'movies/fetchMoreMovies',
  async ({ filter, page }) => {
    try {
      const response = await axios.get(`${apiUrl}${filter}`, {
        params: {
          api_key: apiKey,
          page: page,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching more movies:', error);
      throw error;
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    status: 'idle',
    error: null,
    currentPage: 1, // Track current page for loading more movies
    currentFilter: 'now_playing', // Track current filter
  },
  reducers: {
    voteMovie(state, action) {
      const movie = state.movies.find(movie => movie.id === action.payload);
      if (movie) {
        movie.votes += 1;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFilteredMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchFilteredMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload;
        state.currentPage = 1; // Reset page for new filter
      })
      .addCase(fetchFilteredMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMoreMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMoreMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = state.movies.concat(action.payload);
        state.currentPage += 1; // Increment page for loading more movies
      })
      .addCase(fetchMoreMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { voteMovie } = moviesSlice.actions;
export default moviesSlice.reducer;

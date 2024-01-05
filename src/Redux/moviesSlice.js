import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiKey = '4afc60f757eb572f5b1db283d623b3a0';
const apiUrl = 'https://api.themoviedb.org/3/movie/';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async ({ filter, page }) => {
  try {
    const response = await axios.get(`${apiUrl}${filter}`, {
      params: {
        api_key: apiKey,
        page: page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    status: 'idle',
    error: null,
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
      .addCase(fetchMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = state.movies.concat(action.payload); // Append fetched movies to the existing list
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { voteMovie } = moviesSlice.actions;
export default moviesSlice.reducer;

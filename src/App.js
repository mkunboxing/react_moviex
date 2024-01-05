import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredMovies, fetchMoreMovies } from './Redux/moviesSlice';
import MovieCard from './components/MovieCards';
import './App.css';
import { Select, Button, Flex } from 'antd';


const { Option } = Select;

const App = () => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies.movies);
  const status = useSelector(state => state.movies.status);
  const error = useSelector(state => state.movies.error);
  const currentPage = useSelector(state => state.movies.currentPage);
  const currentFilter = useSelector(state => state.movies.currentFilter);
  const bottomBoundaryRef = useRef();

  const [filter, setFilter] = useState('now_playing');

  useEffect(() => {
    dispatch(fetchFilteredMovies({ filter }));
    setFilter(currentFilter); // Set local filter state to the current filter from Redux
  }, [dispatch, filter]);

  const handleFilterChange = value => {
    setFilter(value);
  };

  const handleLoadMore = () => {
    dispatch(fetchMoreMovies({ filter: currentFilter, page: currentPage + 1 }));
  };

  return (
    <div className="App">
      <div className="sticky-top">
        <h1 style={{ textAlign: 'center' }}>My IMDb Clone</h1>
        <Select defaultValue="now_playing" style={{ width: 500, marginBottom:10, marginLeft:500}} onChange={handleFilterChange}>
          <Option value="now_playing">Now Playing</Option>
          <Option value="popular">Popular</Option>
          <Option value="top_rated">Top Rated</Option>
          <Option value="upcoming">Upcoming</Option>
          <Option value="trending">Trending</Option>
        </Select>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>Displayed movies count: {movies.length}</p>
      </div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      <div className="pinterest-grid">
        {movies.map((movie, index) => (
          <React.Fragment key={movie.id}>
            <MovieCard movie={movie} />
            {index === movies.length - 1 && <div ref={bottomBoundaryRef}></div>}
          </React.Fragment>
        ))}
      </div>
      <Button onClick={handleLoadMore} type="primary" style={{ marginBottom: '20px' }}>
        Load More
      </Button>
      
    </div>
  );
};

export default App;

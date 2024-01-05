import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from './Redux/moviesSlice';
import MovieCard from './components/MovieCards';
import './App.css';
import { Select, Button } from 'antd';

const { Option } = Select;

const App = () => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies.movies);
  const status = useSelector(state => state.movies.status);
  const error = useSelector(state => state.movies.error);
  const [filter, setFilter] = useState('now_playing');
  const [page, setPage] = useState(1);
  const bottomBoundaryRef = useRef();

  useEffect(() => {
    dispatch(fetchMovies({ filter, page }));
  }, [dispatch, filter, page]);

  const handleFilterChange = value => {
    setFilter(value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="App">
      <h1>My IMDb Clone</h1>
      <Select defaultValue="now_playing" style={{ width: 200 }} onChange={handleFilterChange}>
        <Option value="now_playing">Now Playing</Option>
        <Option value="popular">Popular</Option>
        <Option value="top_rated">Top Rated</Option>
        <Option value="upcoming">Upcoming</Option>
        <Option value="trending">Trending</Option>
      </Select>
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

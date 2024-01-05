import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredMovies, fetchMoreMovies } from './Redux/moviesSlice';
import MovieCard from './components/MovieCards';
import './App.css';
import { Select, Button } from 'antd';

const { Option } = Select;

const App = () => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies.movies);
  const status = useSelector(state => state.movies.status);
  const error = useSelector(state => state.movies.error);
  const currentPage = useSelector(state => state.movies.currentPage);
  const currentFilter = useSelector(state => state.movies.currentFilter);
  const bottomBoundaryRef = useRef();

  const [filter, setFilter] = useState(() => {
    return localStorage.getItem('filter') || 'now_playing';
  });

  const [page, setPage] = useState(() => {
    return parseInt(localStorage.getItem('currentPage')) || 1;
  });

  useEffect(() => {
    dispatch(fetchFilteredMovies({ filter }));
    localStorage.setItem('filter', filter);
    setPage(1); // Reset page on filter change
  }, [dispatch, filter]);

  useEffect(() => {
    if (page > 1) {
      dispatch(fetchMoreMovies({ filter: currentFilter, page }));
    }
  }, [dispatch, currentFilter, page]);

  const handleFilterChange = value => {
    setFilter(value);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    localStorage.setItem('currentPage', page);
  }, [page]);

  return (
    <div className="pp">
      <div className="sticky-top">
        <h1>Movie X</h1>
        <div className='select-box'>
        <Select  style={{width:150}} defaultValue={filter}  onChange={handleFilterChange}>
          <Option value="now_playing">Now Playing</Option>
          <Option value="popular">Popular</Option>
          <Option value="top_rated">Top Rated</Option>
          <Option value="upcoming">Upcoming</Option>
          {/* <Option value="trending">Trending</Option> */}
        </Select>
        </div>
       
        <p style={{marginBottom:30 }}>Movies count: {movies.length}</p>
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
      <Button onClick={handleLoadMore} type="primary" style={{  marginBottom: '20px' }}>
        Load More
      </Button>
    </div>
  );
};

export default App;

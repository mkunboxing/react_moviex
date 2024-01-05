import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { voteMovie } from '../Redux/moviesSlice';
import { Card, Button, message } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import './PinterestGrid.css';

const { Meta } = Card;

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const votedMovies = JSON.parse(localStorage.getItem('votedMovies')) || {};
    if (votedMovies[movie.id]) {
      setVoted(true);
    }
  }, [movie.id]);

  const handleVote = async () => {
    try {
      if (!voted) {
        const userVote = 8; // Replace with logic to get user's vote

        dispatch(voteMovie({ id: movie.id, vote: userVote }));

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWZjNjBmNzU3ZWI1NzJmNWIxZGIyODNkNjIzYjNhMCIsInN1YiI6IjY1OTcxMmMzMGU2NGFmMmQ5NDhjMTkwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3_5XTW1laCHI3QM1LGIT0RPaI4ilS8MpiwEzNbBjSg0', // Replace with your access token
          },
          body: JSON.stringify({ value: userVote }), // Use the user's vote value here
        };

        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/rating`, options);

        if (response.ok) {
          message.success('Vote submitted successfully!');
          setVoted(true);

          const votedMovies = JSON.parse(localStorage.getItem('votedMovies')) || {};
          localStorage.setItem(
            'votedMovies',
            JSON.stringify({
              ...votedMovies,
              [movie.id]: true,
            })
          );
        } else {
          message.error('Failed to submit vote.');
        }
      } else {
        message.info('You have already voted for this movie.');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      message.error('Failed to submit vote. Please try again.');
    }
  };

  return (
    <div className='grid-item'>
      <Card
        hoverable
        style={{ width: '100%',}}
        cover={<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />}
      >
        <Meta title={movie.title} description={`Vote Count: ${movie.vote_count}`} />
        <Button onClick={handleVote} disabled={voted}>
          Vote
        </Button>
        <LikeOutlined style={{ fontSize: '24px', color: voted ? 'blue' : 'gray', marginLeft: '8px' }} />
      </Card>
    </div>
  );
};

export default MovieCard;

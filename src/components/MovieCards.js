import React from 'react';
import { useDispatch } from 'react-redux';
import { voteMovie } from '../Redux/moviesSlice';
import { Card, Button } from 'antd';
import './PinterestGrid.css'

const { Meta } = Card;

const MovieCard = ({ movie }) => {
    const dispatch = useDispatch();

    const handleVote = () => {
        dispatch(voteMovie(movie.id));
    };

    return (
        <div className= "grid-item">
            <Card
                hoverable
                style={{ width: '100%' }}
                cover={<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />}
            >
                <Meta title={movie.title} description="www.instagram.com" />
                <Button onClick={handleVote}>Vote</Button> {/* Use Ant Design Button */}
            </Card>
        </div>
    );
};

export default MovieCard;

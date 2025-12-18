import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = ({ recipeId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/reviews/${recipeId}`);
                setReviews(response.data);
            } catch (err) {
                setError('Failed to fetch reviews');
            }
        };
        fetchReviews();
    }, [recipeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            setError('Rating must be between 1 and 5');
            return;
        }
        if (!comment) {
            setError('Comment cannot be empty');
            return;
        }
        try {
            const response = await axios.post(`/api/reviews`, { recipeId, rating, comment });
            setReviews([...reviews, response.data]);
            setRating(0);
            setComment('');
            setError('');
        } catch (err) {
            setError('Failed to submit review');
        }
    };

    return (
        <div>
            <h2>Reviews</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value="0">Select Rating</option>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>{star}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
                <button type="submit">Submit Review</button>
            </form>
            <h3>All Reviews</h3>
            <ul>
                {reviews.map((review) => (
                    <li key={review._id}>
                        <strong>Rating: {review.rating}</strong>
                        <p>{review.comment}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reviews;
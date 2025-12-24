import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ReviewList = ({ villageId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/reviews/${villageId}`);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [villageId]);

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <p className="no-reviews">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map(review => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <h4>{review.user.name}</h4>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={i < review.rating ? "fas fa-star" : "far fa-star"}
                ></i>
              ))}
            </div>
          </div>
          <p className="review-comment">{review.comment}</p>
          <div className="review-date">
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
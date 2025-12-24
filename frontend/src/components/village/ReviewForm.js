import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ReviewForm = ({ villageId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to leave a review');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await api.post(`/reviews/${villageId}`, { rating, comment });
      setSuccess(true);
      setComment('');
      setRating(5);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="review-form-container">
        <p>Please <a href="/login">log in</a> to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>Leave a Review</h3>
      
      {success && <div className="success-message">Review submitted successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={star <= rating ? 'active' : ''}
                onClick={() => setRating(star)}
              >
                <i className="fas fa-star"></i>
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          ></textarea>
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
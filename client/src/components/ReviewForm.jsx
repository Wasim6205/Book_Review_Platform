import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ bookId, onReviewSubmitted }) => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to submit a review');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await axios.post('http://localhost:5000/api/reviews', {
        bookId,
        ...formData
      });
      
      setFormData({ rating: 5, title: '', content: '' });
      onReviewSubmitted();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="review-form-container">
        <p>Please <a href="/login">login</a> to write a review.</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Rating:</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            required
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Review Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Brief title for your review"
          />
        </div>
        
        <div className="form-group">
          <label>Review:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows="5"
            placeholder="Share your thoughts about this book..."
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
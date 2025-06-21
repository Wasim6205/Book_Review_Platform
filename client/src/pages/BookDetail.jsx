import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import ReviewForm from '../components/ReviewForm';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const { currentBook, loading, fetchBook } = useBooks();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchBook(id);
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/books/${id}/reviews`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    fetchBook(id); // Refresh book data to update ratings
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (!currentBook) {
    return <div className="error">Book not found</div>;
  }

  return (
    <div className="book-detail">
      <div className="container">
        <div className="book-header">
          <div className="book-cover-large">
            {currentBook.coverImage ? (
              <img src={currentBook.coverImage} alt={currentBook.title} />
            ) : (
              <div className="book-placeholder-large">📖</div>
            )}
          </div>
          
          <div className="book-details">
            <h1>{currentBook.title}</h1>
            <h2>by {currentBook.author}</h2>
            <p className="book-genre">{currentBook.genre}</p>
            <p className="book-year">Published: {currentBook.publishedYear}</p>
            
            <div className="book-rating-large">
              <span className="stars-large">
                {'★'.repeat(Math.floor(currentBook.averageRating))}
                {'☆'.repeat(5 - Math.floor(currentBook.averageRating))}
              </span>
              <span className="rating-text-large">
                {currentBook.averageRating.toFixed(1)} ({currentBook.totalReviews} reviews)
              </span>
            </div>
            
            <div className="book-description">
              <h3>Description</h3>
              <p>{currentBook.description}</p>
            </div>
          </div>
        </div>
        
        <div className="reviews-section">
          <ReviewForm bookId={id} onReviewSubmitted={handleReviewSubmitted} />
          
          <div className="reviews-list">
            <h3>Reviews ({reviews.length})</h3>
            {reviewsLoading ? (
              <div className="loading">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <strong>{review.userId.username}</strong>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-content">{review.content}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this book!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
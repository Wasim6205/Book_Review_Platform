import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          <div className="book-placeholder">📖</div>
        )}
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-genre">{book.genre}</p>
        
        <div className="book-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(book.averageRating))}
            {'☆'.repeat(5 - Math.floor(book.averageRating))}
          </span>
          <span className="rating-text">
            {book.averageRating.toFixed(1)} ({book.totalReviews} reviews)
          </span>
        </div>
        
        <Link to={`/books/${book._id}`} className="book-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
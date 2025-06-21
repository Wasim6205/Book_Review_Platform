import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';

const Home = () => {
  const { featuredBooks, loading, fetchFeaturedBooks } = useBooks();

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Great Read</h1>
          <p>Explore thousands of books and read reviews from fellow book lovers</p>
          <Link to="/books" className="cta-button">Browse Books</Link>
        </div>
      </section>
      
      <section className="featured-books">
        <div className="container">
          <h2>Featured Books</h2>
          {loading ? (
            <div className="loading">Loading featured books...</div>
          ) : (
            <div className="books-grid">
              {featuredBooks.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
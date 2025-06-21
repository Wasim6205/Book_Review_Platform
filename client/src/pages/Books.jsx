import React, { useEffect, useState } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';

const Books = () => {
  const { books, loading, totalPages, currentPage, fetchBooks } = useBooks();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History'];

  useEffect(() => {
    fetchBooks(1, search, genre);
  }, [search, genre]);

  const handlePageChange = (page) => {
    fetchBooks(page, search, genre);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(1, search, genre);
  };

  return (
    <div className="books-page">
      <div className="container">
        <h1>Book Library</h1>
        
        <div className="filters">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search books or authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
          
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="genre-filter"
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div className="loading">Loading books...</div>
        ) : (
          <>
            <div className="books-grid">
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`page-button ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Books;
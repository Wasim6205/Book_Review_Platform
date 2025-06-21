import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const BookContext = createContext();

const bookReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload.books,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        total: action.payload.total,
        loading: false
      };
    case 'SET_CURRENT_BOOK':
      return { ...state, currentBook: action.payload, loading: false };
    case 'SET_FEATURED_BOOKS':
      return { ...state, featuredBooks: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const BookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, {
    books: [],
    featuredBooks: [],
    currentBook: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0
  });

  const fetchBooks = async (page = 1, search = '', genre = '') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('http://localhost:5000/api/books', {
        params: { page, search, genre, limit: 12 }
      });
      dispatch({ type: 'SET_BOOKS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch books' });
    }
  };

  const fetchFeaturedBooks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('http://localhost:5000/api/books', {
        params: { featured: true, limit: 6 }
      });
      dispatch({ type: 'SET_FEATURED_BOOKS', payload: response.data.books });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch featured books' });
    }
  };

  const fetchBook = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      dispatch({ type: 'SET_CURRENT_BOOK', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch book' });
    }
  };

  return (
    <BookContext.Provider value={{
      ...state,
      fetchBooks,
      fetchFeaturedBooks,
      fetchBook
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
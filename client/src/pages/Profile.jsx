import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', avatar: '' });

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setProfile(response.data.user);
      setReviews(response.data.reviews);
      setEditForm({ bio: response.data.user.bio, avatar: response.data.user.avatar });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, editForm);
      setProfile({ ...profile, ...editForm });
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          
          <div className="profile-info">
            <h1>{profile.username}</h1>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-joined">
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </p>
            
            {editing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label>Bio:</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="form-group">
                  <label>Avatar URL:</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-bio">
                <p>{profile.bio || 'No bio available'}</p>
                {isOwnProfile && (
                  <button onClick={() => setEditing(true)} className="edit-button">
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-reviews">
          <h2>Reviews ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map(review => (
                <div key={review._id} className="profile-review-card">
                  <div className="review-book-info">
                    <h3>{review.bookId.title}</h3>
                    <p>by {review.bookId.author}</p>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                  <h4>{review.title}</h4>
                  <p className="review-excerpt">
                    {review.content.length > 150 
                      ? `${review.content.substring(0, 150)}...` 
                      : review.content
                    }
                  </p>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

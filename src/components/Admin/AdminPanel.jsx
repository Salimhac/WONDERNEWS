// src/components/Admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNews } from '../../hooks/useNews';
import NewsForm from './NewsForm';
import './AdminPanel.css';
import { ADMIN_PASSWORD } from '../../config';


const AdminPanel = () => {
  const { news, removeNews } = useNews();
  const [editingNews, setEditingNews] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Restore authentication state on reload
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // --- LOGIN LOGIC ---
  const handleLogin = (e) => {
    e.preventDefault();

    if (locked) {
      alert('Admin panel is temporarily locked. Try again later.');
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-authenticated', 'true');
      setAttempts(0);
      setPassword('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
        }, 30000); // Lock for 30 seconds
        alert('Too many failed attempts. Admin panel locked for 30 seconds.');
      } else {
        alert(`Invalid password. ${3 - newAttempts} attempts remaining.`);
      }
      setPassword('');
    }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-authenticated');
  };

  // --- DELETE NEWS ---
// --- DELETE NEWS ---
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this news article?')) {
    try {
      await removeNews(id);
      alert('News article deleted successfully ✅');
    } catch (error) {
      console.error('Failed to delete news:', error);
      alert('❌ Failed to delete news. Please try again.');
    }
  }
};

  const categoryIcons = {
    mental: '🧠',
    sports: '⚽',
    politics: '🏛️',
    finance: '💹',
    life: '🌟',
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>🔐 Admin Login</h2>
          <p>Enter admin password to access the management panel.</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={locked}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={locked}>
              {locked ? '🔒 Locked (30s)' : '🚀 Login'}
            </button>
          </form>

          {attempts > 0 && (
            <div className="attempts-warning">Failed attempts: {attempts}/3</div>
          )}
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN DASHBOARD ---
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="header-top">
          <h2>📊 News Management</h2>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
        <p>Create and manage your news articles</p>
      </div>

      <div className="admin-content">
        <div className="admin-form-section">
          <NewsForm
            editingNews={editingNews}
            onCancelEdit={() => setEditingNews(null)}
          />
        </div>

        <div className="news-list">
          <h3>📝 Published Articles ({news.length})</h3>

          {news.length === 0 ? (
            <p className="empty-news">No news articles yet. Create your first one!</p>
          ) : (
            <div className="news-management-list">
              {news.map((newsItem) => (
                <div key={newsItem.id} className="management-card">
                  <div className="management-content">
                    <span className="news-category">
                      {categoryIcons[newsItem.category]} {newsItem.category}
                    </span>
                    <h4>{newsItem.title}</h4>
                    <p className="news-preview">
                      {newsItem.content.substring(0, 80)}...
                    </p>
                    <div className="news-stats">
                      <span>👁️ {newsItem.views} views</span>
                      <span>❤️ {newsItem.likes} likes</span>
                      <span>
                        📅 {new Date(newsItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="management-actions">
                    <button
                      onClick={() => setEditingNews(newsItem)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
